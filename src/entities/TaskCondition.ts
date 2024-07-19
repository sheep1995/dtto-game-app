import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { Task } from "./Task";

@Entity('TaskConditions')
export class TaskCondition {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    taskId: string;

    @Column({
        type: "varchar",
        length: 255
    })
    description: string;

    @Column("int")
    targetValue: number;

    @Column({
        type: "json",
        nullable: true
    })
    extra: any;

    @ManyToOne(() => Task)
    @JoinColumn({ name: "taskId" })
    task: Task;
}