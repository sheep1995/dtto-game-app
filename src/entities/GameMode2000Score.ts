import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('GameMode2000Scores')
export class GameMode2000Score {
    @PrimaryGeneratedColumn('uuid')
    roundId: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, user => user.scores2000)
    @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
    user: User;

    @Column()
    score: number;

    @Column()
    playTimeMs: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;
}
