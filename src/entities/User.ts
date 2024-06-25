import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserItem } from './UserItem';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  uId: number;

  @Column({ unique: true })
  userId: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  characterLevel: number;

  @OneToMany(() => UserItem, userItem => userItem.user)
  userItems: UserItem[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedTime: Date;
}
