import { AppDataSource } from "../config/data-source";
import { UserTask } from "../entities/UserTask";
import { Task } from "../entities/Task";
import { Reward } from "../entities/Reward";

export class UserTaskService {
	static async getUserTasks(userId: string) {
		const userTasksRepository = AppDataSource.getRepository(UserTask);
		const taskRepository = AppDataSource.getRepository(Task);

		const today = new Date();
		const dayOfWeek = today.getDay();
		const weekOfYear = Math.ceil((today.getDate() - 1 - today.getDay()) / 7);
		const taskDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

		// 查询所有相关任务
		const tasks = await taskRepository.find();

		// 找到 reach_score 任务并随机选择一个子任务
		const taskOfReachScore = tasks.find(task => task.operation === 'reach_score');
		const taskIdOfReachScore = taskOfReachScore ? taskOfReachScore.taskId : null;
		let selectedModeTask = null;

		if (taskIdOfReachScore) {
			const modeTasks = tasks.filter(t => t.parentTaskId === taskIdOfReachScore);
			if (modeTasks.length > 0) {
				selectedModeTask = modeTasks[Math.floor(Math.random() * modeTasks.length)];
			}
		}

		// 过滤出相关任务并
		const relevantTasks = tasks.filter(task => {
			const mappingNumbers = task.mappingNumbers.split(',').map(Number);
			// 移除 reach_score_mode_tasks
			if (task.parentTaskId === taskIdOfReachScore) {
				return false;
			}
			if (task.type === 'daily' && mappingNumbers.includes(dayOfWeek)) {
				return true;
			}
			if (task.type === 'weekly' && mappingNumbers.includes(weekOfYear)) {
				return true;
			}
			return false;
		});

		// 添加随机选择的子任务到 relevantTasks
		if (selectedModeTask) {
			relevantTasks.push(selectedModeTask);
		}

		// 初始化 UserTask
		let userTask = await userTasksRepository.findOne({ where: { userId, taskDate } });
		const userTasksToInsert: UserTask[] = [];
		if (!userTask) {
			for (const task of relevantTasks) {
				userTask = new UserTask();
				userTask.userId = userId;
				userTask.taskId = task.taskId;
				userTask.currentCount = 0;
				userTask.status = 'incomplete';
				userTask.taskDate = taskDate;
				userTasksToInsert.push(userTask);
			}
		}

		// 批量插入數據
		if (userTasksToInsert.length > 0) {
			await userTasksRepository.save(userTasksToInsert);
		}

		// 查询所有用户任务
		const userTasks = await userTasksRepository.find({ where: { userId, taskDate }, relations: ['task'] });

		// 构建任务树
		const taskTree = this.buildTaskTree(userTasks);

		return taskTree;
	}

	private static buildTaskTree(userTasks: UserTask[]): any {
		const taskMap = new Map<string, any>();

		userTasks.forEach(userTask => {
			const task = userTask.task;
			const taskData = {
				taskId: task.taskId,
				type: task.type,
				description: task.description,
				rewardId: task.rewardId,
				requiredCount: task.requiredCount,
				currentCount: userTask.currentCount,
				childTasks: []
			};

			taskMap.set(task.taskId, taskData);
		});

		userTasks.forEach(userTask => {
			const task = userTask.task;
			if (task.parentTaskId) {
				const parentTask = taskMap.get(task.parentTaskId);
				if (parentTask) {
					parentTask.childTasks.push(taskMap.get(task.taskId));
				}
			}
		});

		// 找到最顶层的任务，确保它没有父任务
		const topParentTask = Array.from(taskMap.values()).find(task => !task.parentTaskId);
		return topParentTask;
	}

	static async handleOperation(userId: string, operation: string, detail: string) {
		const userTasksRepository = AppDataSource.getRepository(UserTask);
		const taskRepository = AppDataSource.getRepository(Task);

		const today = new Date();
		const taskDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const tasks = await taskRepository.find({ where: { operation } });

		for (const task of tasks) {
			let userTask = await userTasksRepository.findOne({ where: { userId, taskId: task.taskId, taskDate } });

			if (!userTask) {
				userTask = new UserTask();
				userTask.userId = userId;
				userTask.taskId = task.taskId;
				userTask.currentCount = 0;
				userTask.status = 'incomplete';
				userTask.taskDate = taskDate;
			}

			userTask.currentCount += 1;

			if (userTask.currentCount >= task.requiredCount) {
				userTask.status = 'complete';
				userTask.completedTime = new Date();
			}

			await userTasksRepository.save(userTask);

			// 递归更新父任务状态
			if (task.parentTaskId) {
				await UserTaskService.updateParentTaskStatus(userId, task.parentTaskId, taskDate);
			}
		}
	}

	static async updateParentTaskStatus(userId: string, parentTaskId: string, taskDate: Date) {
		const userTasksRepository = AppDataSource.getRepository(UserTask);
		const parentTask = await userTasksRepository.findOne({ where: { userId, taskId: parentTaskId, taskDate }, relations: ['task'] });

		if (parentTask) {
			const subTasks = await userTasksRepository.find({ where: { userId, taskId: parentTaskId, taskDate } });
			const allSubTasksComplete = subTasks.every(subTask => subTask.status === 'complete');

			if (allSubTasksComplete) {
				parentTask.status = 'complete';
				parentTask.completedTime = new Date();
				await userTasksRepository.save(parentTask);

				// 如果父任务还有更高层的父任务，继续递归更新
				if (parentTask.task.parentTaskId) {
					await UserTaskService.updateParentTaskStatus(userId, parentTask.task.parentTaskId, taskDate);
				}
			}
		}
	}

	static async claimReward(userId: string, taskId: string) {
		const userTasksRepository = AppDataSource.getRepository(UserTask);

		const today = new Date();
		const taskDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const userTask = await userTasksRepository.findOne({ where: { userId, taskId, taskDate } });

		if (!userTask) {
			throw new Error('UserTask not found');
		}

		if (userTask.status !== 'complete' || userTask.rewardClaimed) {
			throw new Error('Reward cannot be claimed');
		}

		userTask.rewardClaimed = true;
		await userTasksRepository.save(userTask);

		return userTask;
	}
}
