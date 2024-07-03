import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('GameModeLimitedTimeScores')
export class GameModeLimitedTimeScore {
    @PrimaryGeneratedColumn('uuid')
    roundId: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, user => user.scoresLimitedTime)
    @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
    user: User;

    @Column()
    score: number;

    @Column()
    playTimeMs: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;
}
