import { Entity, PrimaryColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Item } from './Item';

@Entity({ name: 'UserItems' })
export class UserItem {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  itemId: string;

  @Column({ type: 'int' })
  quantity: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedTime: Date;

  @ManyToOne(() => User, (user) => user.userItems)
  user: User;

  @ManyToOne(() => Item, (item) => item.userItems)
  item: Item;
}
