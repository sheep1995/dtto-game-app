import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { UserTask } from './UserTask';
import { TaskCondition } from "./TaskCondition";

@Entity('Tasks')
export class Task {
    @PrimaryColumn()
    taskId: string;

    @Column({
        type: 'enum',
        enum: ['daily', 'weekly']
    })
    type: string;

    @Column('text')
    description: string;

    @Column({ nullable: true })
    rewardId: string;

    @Column({ type: "varchar", length: 30 })
    schedule: string;
    
    @Column()
    conditionCount: number;

    @Column({ type: "varchar", length: 50 })
    operation: string;

    @OneToMany(() => UserTask, userTask => userTask.task)
    userTasks: UserTask[];

    @OneToMany(() => TaskCondition, taskCondition => taskCondition.task)
    conditions: TaskCondition[];
}