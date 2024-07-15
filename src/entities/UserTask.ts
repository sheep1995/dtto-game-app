import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity('UserTasks')
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

    @Column({
        type: 'enum',
        enum: ['incomplete', 'complete'],
        default: 'incomplete'
    })
    status: string;

    @Column({ default: 0 })
    currentCount: number;

    @Column({ type: "timestamp", nullable: true })
    completedTime: Date;

    @Column({ default: false })
    rewardClaimed: boolean;

    @Column({ type: "date" })
    taskDate: Date;
}
