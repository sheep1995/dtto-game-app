import { AppDataSource } from "../config/data-source";
import { Between, Like, In, Not } from "typeorm";
import { UserTask } from "../entities/UserTask";
import { Task } from "../entities/Task";
import { TaskCondition } from "../entities/TaskCondition";
import { Reward } from "../entities/Reward";
import { UserItem } from "../entities/UserItem";
import { getWeekInCycle } from "../utils/getWeekInCycle";

export class UserTaskService {
    static async getTasks(userId: string, taskType: string): Promise<any> {
        const userTaskRepository = AppDataSource.getRepository(UserTask);
        const rewardRepository = AppDataSource.getRepository(Reward);

        // Determine the start and end of the relevant period (day or week)
        const today = new Date();
        let periodStart, periodEnd;
        if (taskType === 'daily') {
            periodStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0); // Start of the day
            periodEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999); // End of the day
        } else if (taskType === 'weekly') {
            const dayOfWeek = today.getDay();
            const startOffset = dayOfWeek * 24 * 60 * 60 * 1000; // calculate the start of the week
            periodStart = new Date(today.getTime() - startOffset);
            periodEnd = new Date(periodStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1); // End of the week
        }

        // Query tasks assigned for the current period
        let userTasks = await userTaskRepository.find({
            where: {
                userId: userId,
                assignedDate: Between(periodStart, periodEnd),
                task: {
                    type: taskType,
                    taskId: Not(Like('%_all')) //過濾掉全部完成的任務
                }
            },
            relations: ['task', 'task.conditions', 'taskCondition']
        });

        // Check for tasks assigned in the period
        if (userTasks.length === 0) {
            // No tasks found for the period, proceed to assign tasks
            await UserTaskService.assignTasks(userId, taskType);
            userTasks = await userTaskRepository.find({
                where: {
                    userId: userId,
                    assignedDate: Between(periodStart, periodEnd),
                    task: {
                        type: taskType,
                        taskId: Not(Like('%_all')) //過濾掉全部完成的任務
                    }
                },
                relations: ['task', 'task.conditions', 'taskCondition']
            });
        }

        // Fetch all reward details for the tasks that have a rewardId
        const rewardIds = userTasks.map(userTask => userTask.task.rewardId).filter(id => id !== null);
        const rewards = await rewardRepository.findBy({ rewardId: In(rewardIds) });

        // Fetch the overall completion reward based on task type
        const completionRewardId = taskType === 'daily' ? 'reward_daily_all' : 'reward_weekly_all';
        const completionReward = await rewardRepository.findOneBy({ rewardId: completionRewardId });
        const completionTask = await userTaskRepository.findOne({
            where: {
                userId: userId,
                assignedDate: Between(periodStart, periodEnd),
                task: {
                    type: taskType,
                    taskId: Like('%_all')
                }
            }
        });

        // Map rewards by id for quick access
        const rewardsMap = new Map(rewards.map(reward => [reward.rewardId, reward]));

        // Format response
        const groupedTasks = {};
        userTasks.forEach(userTask => {
            const { task, taskCondition } = userTask;
            const reward = rewardsMap.get(task.rewardId);

            if (!groupedTasks[task.taskId]) {
                groupedTasks[task.taskId] = {
                    taskId: task.taskId,
                    description: task.description,
                    conditions: [],
                    reward: reward ? {
                        description: reward.description,
                        contents: reward.rewards.contents,
                        claimed: userTask.rewardClaimed
                    } : null
                };
            }
            groupedTasks[task.taskId].conditions.push({
                description: taskCondition.description,
                progress: {
                    current: userTask.currentCount,
                    total: taskCondition ? taskCondition.targetValue : 1
                },
                completed: userTask.status === 'complete'
            });
        });

        const tasksArray = Object.values(groupedTasks);

        return {
            tasks: tasksArray,
            count: tasksArray.length,
            completionReward: completionReward ? {
                description: completionReward.description,
                contents: completionReward.rewards.contents,
                claimed: completionTask.rewardClaimed
            } : null
        };
    }

    static async assignTasks(userId: string, taskType: string): Promise<UserTask[]> {
        const startDate = new Date('2024-07-01T00:00:00+08:00');
        const today = new Date();
        const offset = 8; // Taipei is UTC+8
        const taipeiDate = new Date(today.getTime() + offset * 3600 * 1000);

        const schedule = taskType === 'daily' ? taipeiDate.getDay() : getWeekInCycle(taipeiDate, startDate);

        // 根据当天是星期几来筛选任务
        const tasks = await AppDataSource.getRepository(Task).find({
            where: {
                type: taskType,
                schedule: Like(`%${schedule}%`)  // 假设数据库中星期天存为1，星期一为2，依此类推
            }
        });

        const newTasks: UserTask[] = [];

        // 遍历任务并分配条件
        for (const task of tasks) {
            const conditions = await AppDataSource.getRepository(TaskCondition).find({
                where: { taskId: task.taskId }
            });

            // 随机选择条件
            const selectedConditions = conditions
                .sort(() => 0.5 - Math.random())
                .slice(0, task.conditionCount)
                .sort((a, b) => a.id - b.id);

            // 为每个选中的条件创建用户任务
            for (const condition of selectedConditions) {
                const newUserTask = new UserTask();
                newUserTask.userId = userId;
                newUserTask.taskId = task.taskId;
                newUserTask.taskConditionId = condition.id;
                newUserTask.status = 'assigned';
                newUserTask.assignedDate = new Date();

                newTasks.push(newUserTask);
            }
        }

        // 保存新的全部完成的任务
        const allCompletedTask = new UserTask();
        allCompletedTask.userId = userId;
        allCompletedTask.taskId = `task_${taskType}_all`;
        allCompletedTask.taskConditionId = null;
        allCompletedTask.status = 'assigned';
        allCompletedTask.assignedDate = new Date();
        newTasks.push(allCompletedTask);

        // 批量保存新的用户任务
        await AppDataSource.getRepository(UserTask).save(newTasks);
        return newTasks;
    }

    static async claimReward(userId: string, taskId: string): Promise<boolean> {
        const userTaskRepository = AppDataSource.getRepository(UserTask);
        const rewardRepository = AppDataSource.getRepository(Reward);
        const userItemRepository = AppDataSource.getRepository(UserItem);

        const userTasks = await userTaskRepository.find({
            where: { userId, taskId },
            relations: ['task']
        });

        if (!userTasks) {
            throw new Error("Task not found.");
        }

        if (userTasks[0].rewardClaimed) {
            throw new Error("Reward has already been claimed.");
        }

        const reward = await rewardRepository.findOneBy({ rewardId: userTasks[0].task.rewardId });

        if (!reward) {
            throw new Error("Reward not found.");
        }

        // Mark the reward as claimed for all tasks
        userTasks.forEach(task => {
            if (!task.rewardClaimed) {  // Only update tasks where the reward hasn't been claimed
                task.rewardClaimed = true;
            }
        });
        await userTaskRepository.save(userTasks);

        // Add items to UserItems
        for (const content of reward.rewards.contents) {
            let userItem = await userItemRepository.findOne({
                where: { userId, itemId: content.itemId }
            });

            console.debug('userItem', userItem);
            if (userItem) {
                userItem.quantity += content.quantity;
            } else {
                userItem = userItemRepository.create({
                    userId,
                    itemId: content.itemId,
                    quantity: content.quantity
                });
            }

            await userItemRepository.save(userItem);
        }

        return true;
    }
}
