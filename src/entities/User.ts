import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserItem } from './UserItem';
import { GameMode2000Score } from './GameMode2000Score';
import { GameModeLimitedTimeScore } from './GameModeLimitedTimeScore';
import { GameModeNormalScore } from './GameModeNormalScore';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  uId: string;

  @Column({ unique: true })
  userId: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 0 })
  coin: number;

  @Column()
  characterLevel: number;

  @OneToMany(() => UserItem, userItem => userItem.user)
  userItems: UserItem[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedTime: Date;

  @OneToMany(() => GameMode2000Score, score => score.user)
  scores2000: GameMode2000Score[];

  @OneToMany(() => GameModeLimitedTimeScore, score => score.user)
  scoresLimitedTime: GameModeLimitedTimeScore[];

  @OneToMany(() => GameModeNormalScore, score => score.user)
  scoresNormal: GameModeNormalScore[];
}
