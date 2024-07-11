import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('Tasks')
export class Task {
    @PrimaryGeneratedColumn()
    taskId: string;

    @Column({ type: "enum", enum: ["daily", "weekly"] })
    type: string;

    @Column()
    taskName: string;

    @Column('text')
    description: string;

    @Column()
    reward: number;

    @Column()
    mappingNumber: number;
}