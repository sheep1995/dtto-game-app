import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('Sessions')
export class Session {
    @PrimaryGeneratedColumn('uuid')
    sessionId: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, user => user.sessions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    loginTime: Date;

    @Column({ nullable: true })
    lastHeartbeat: Date;

    @Column({ nullable: true })
    logoutTime: Date;

    @Column({ default: true })
    active: boolean;
}
