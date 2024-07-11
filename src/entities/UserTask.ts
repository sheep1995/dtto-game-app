import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity('UserTaks')
export class UserTask {
    @PrimaryColumn()
    userId: string;

    @PrimaryColumn()
    taskId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Task)
    @JoinColumn({ name: "taskId" })
    task: Task;

    @Column({ type: "enum", enum: ["pending", "completed"], default: "pending" })
    status: string;

    @Column({ type: "timestamp", nullable: true })
    completedTime: Date;
}
