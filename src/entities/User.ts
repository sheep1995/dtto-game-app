import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CharacterLevel } from './CharacterLevel';
import { UserItem } from './UserItem';

@Entity({ name: 'Users' })
export class User {
  @PrimaryGeneratedColumn()
  uId: number;

  @Column({ type: 'varchar', unique: true })
  userId: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @ManyToOne(() => CharacterLevel, (characterLevel) => characterLevel.users)
  characterLevel: CharacterLevel;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedTime: Date;

  @OneToMany(() => UserItem, (userItem) => userItem.user)
  userItems: UserItem[];
}
