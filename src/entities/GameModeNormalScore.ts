import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('GameModeNormalScores')
export class GameModeNormalScore {
  @PrimaryGeneratedColumn('uuid')
  roundId: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.scoresNormal)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: User;

  @Column()
  score: number;

  @Column()
  playTimeMs: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;
}
