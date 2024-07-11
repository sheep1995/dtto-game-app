import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { UserTask } from "../entities/UserTask";
import { Task } from "../entities/Task";
import { Reward } from "../entities/Reward";

export class UserTaskService {
  private static userTaskRepository: Repository<UserTask> = AppDataSource.getRepository(UserTask);
  private static taskRepository: Repository<Task> = AppDataSource.getRepository(Task);
  private static rewardRepository: Repository<Reward> = AppDataSource.getRepository(Reward);

  static async getUserTasks(userId: string): Promise<UserTask[]> {
    const today = new Date().toLocaleString("en-US", { weekday: "long" });
    const userTasks = await this.userTaskRepository.find({
      where: { userId },
      relations: ["task"],
    });

    const mappingNumber = this.getMappingNumber(today);

    const todayTasks = userTasks.filter((ut) => ut.task.mappingNumber === mappingNumber);

    if (todayTasks.length === 0) {
      const tasks = await this.taskRepository.find({ where: { mappingNumber } });
      const newTasks = tasks.map((task) => {
        const userTask = new UserTask();
        userTask.userId = userId;
        userTask.taskId = task.taskId;
        userTask.task = task;
        return userTask;
      });

      await this.userTaskRepository.save(newTasks);
      return newTasks;
    } else {
      return todayTasks;
    }
  }

  static async completeTask(userId: string, taskId: string): Promise<any> {
    const userTask = await this.userTaskRepository.findOne({ where: { userId, taskId }, relations: ["task"] });

    if (userTask) {
      userTask.status = "completed";
      userTask.completedTime = new Date();
      await this.userTaskRepository.save(userTask);

      const reward = await this.rewardRepository.findOne({ where: { point: userTask.task.reward } });
      const rewards = reward ? reward.rewards : [];
      
      return { message: "Task completed", rewards };
    } else {
      throw new Error("Task not found");
    }
  }

  private static getMappingNumber(day: string): number {
    const mapping = {
      "Sunday": 1,
      "Monday": 2,
      "Tuesday": 3,
      "Wednesday": 4,
      "Thursday": 5,
      "Friday": 6,
      "Saturday": 7,
    };
    return mapping[day];
  }
}
