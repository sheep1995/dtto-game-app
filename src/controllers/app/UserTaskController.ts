import { Request, Response } from "express";
import { UserTaskService } from "../../services/UserTaskService";

export class UserTaskController {
  async getUserTasks(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const tasks = await UserTaskService.getUserTasks(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async completeTask(req: Request, res: Response) {
    try {
      const { userId, taskId } = req.params;
      const result = await UserTaskService.completeTask(userId, taskId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
