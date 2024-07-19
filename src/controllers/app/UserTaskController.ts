import { Request, Response } from "express";
import { UserTaskService } from "../../services/UserTaskService";

export class UserTaskController {
	static async getTasks(req: Request, res: Response) {
		try {
			const { userId } = req.user;
			const { type = 'daily' } = req.query;
			const tasks = await UserTaskService.getTasks(userId, type as string);
			res.send(tasks);
		} catch (error) {
			console.error(error);
			res.status(500).send('Internal Server Error');
		}
	}

	static async claimReward(req: Request, res: Response) {
        const { taskId } = req.body;
        const { userId } = req.user;
		try {
            const result = await UserTaskService.claimReward(userId, taskId);
            res.status(200).json({ success: true, message: "Reward claimed successfully." });
        } catch (error) {
            console.error(error);
			res.status(500).send('Internal Server Error');
        }
    }
}
