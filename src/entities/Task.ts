import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { UserTask } from './UserTask';

@Entity('Tasks')
export class Task {
    @PrimaryGeneratedColumn()
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

    @Column({ default: 1 })
    requiredCount: number;

    @Column('text') // 使用 TEXT 字段來存儲多個 mappingNumber, 舉例：1,4
    mappingNumbers: string;

    @Column()
    operation: string;

    @Column({ nullable: true }) // 添加 parentTaskId 字段，允许为空
    parentTaskId: string;

    @OneToMany(() => UserTask, userTask => userTask.task)
    userTasks: UserTask[];

    @ManyToOne(() => Task, task => task.subTasks)
    @JoinColumn({ name: "parentTaskId" })
    parentTask: Task;

    @OneToMany(() => Task, task => task.parentTask)
    subTasks: Task[];
}