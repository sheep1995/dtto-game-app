import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Task } from "./Task";
import { User } from "./User";
import { TaskCondition } from "./TaskCondition";

@Entity("UserTasks")
export class UserTask {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    taskId: string;

    @Column({ nullable: true })
    taskConditionId: number;

    @Column({ default: 0 })
    currentCount: number;

    @Column({
        type: "enum",
        enum: ["assigned", "inprogress", "complete"],
        default: "assigned"
    })
    status: string;

    @Column("timestamp")
    assignedDate: Date;

    @Column("boolean", { default: false })
    rewardClaimed: boolean;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Task)
    @JoinColumn({ name: "taskId" })
    task: Task;

    @ManyToOne(() => TaskCondition)
    @JoinColumn({ name: "taskConditionId" })
    taskCondition: TaskCondition;
}