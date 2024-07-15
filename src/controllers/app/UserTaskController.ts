import { Request, Response } from "express";
import { UserTaskService } from "../../services/UserTaskService";

export class UserTaskController {
	static async getTasks(req: Request, res: Response) {
		try {
			const { userId } = req.user;
			const tasks = await UserTaskService.getUserTasks(userId);
			res.send(tasks);
		} catch (error) {
			console.error(error);
			res.status(500).send('Internal Server Error');
		}
	}

	static async claimReward(req: Request, res: Response) {
		const { userId, taskId } = req.body;

		try {
			const userTask = await UserTaskService.claimReward(userId, taskId);
			res.send({ message: 'Reward claimed successfully', userTask });
		} catch (error) {
			console.error(error.message);
			res.status(400).send(error.message);
		}
	}
}
