import { AppDataSource } from "../config/data-source";
import { UserTask } from "../entities/UserTask";
import { Task } from "../entities/Task";
import { Reward } from "../entities/Reward";

export class UserTaskService {
	static async getUserTasks(userId: string) {
		const userTasksRepository = AppDataSource.getRepository(UserTask);
		const taskRepository = AppDataSource.getRepository(Task);

		const today = new Date();
		const dayOfWeek = today.getDay() + 1;
		const weekOfYear = Math.ceil((today.getDate() - 1 - today.getDay()) / 7);
		const taskDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

		const tasks = await taskRepository.find();
		const relevantTasks = tasks.filter(task => {
			const mappingNumbers = task.mappingNumbers.split(',').map(Number);
			if (task.type === 'daily' && mappingNumbers.includes(dayOfWeek)) {
				return true;
			}
			if (task.type === 'weekly' && mappingNumbers.includes(weekOfYear)) {
				return true;
			}
			return false;
		});

		for (const task of relevantTasks) {
			let userTask = await userTasksRepository.findOne({ where: { userId, taskId: task.taskId, taskDate } });
			if (!userTask) {
				userTask = new UserTask();
				userTask.userId = userId;
				userTask.taskId = task.taskId;
				userTask.currentCount = 0;
				userTask.status = 'incomplete';
				userTask.taskDate = taskDate;
				await userTasksRepository.save(userTask);
			}
		}

		// 处理特定模式中达到指定分数门槛的任务，随机选择子任务
		const scoreThresholdParentTask = tasks.find(task => task.operation === 'reach_score_threshold');
		if (scoreThresholdParentTask) {
			const childTasks = tasks.filter(task => task.parentTaskId === scoreThresholdParentTask.taskId);
			const randomChildTask = childTasks[Math.floor(Math.random() * childTasks.length)];

			let userTask = await userTasksRepository.findOne({ where: { userId, taskId: randomChildTask.taskId, taskDate } });
			if (!userTask) {
				userTask = new UserTask();
				userTask.userId = userId;
				userTask.taskId = randomChildTask.taskId;
				userTask.currentCount = 0;
				userTask.status = 'incomplete';
				userTask.taskDate = taskDate;
				await userTasksRepository.save(userTask);
			}
		}

		const userTasks = await userTasksRepository.find({ where: { userId, taskDate }, relations: ['task'] });
		const groupedTasks = userTasks.reduce((groups, userTask) => {
			const parentTaskId = userTask.task.parentTaskId || userTask.task.taskId;
			if (!groups[parentTaskId]) {
				groups[parentTaskId] = [];
			}
			groups[parentTaskId].push(userTask);
			return groups;
		}, {});

		return groupedTasks;
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
