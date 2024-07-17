import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Task } from "./Task";

@Entity()
export class TaskCondition {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    targetValue: number;

    @ManyToOne(() => Task, task => task.conditions)
    task: Task;
}