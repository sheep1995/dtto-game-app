import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn  } from 'typeorm';
import { User } from './User';
import { Item } from './Item';

@Entity('UserItems')
export class UserItem {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  itemId: string;

  @ManyToOne(() => User, user => user.userItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Item, item => item.userItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column()
  quantity: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedTime: Date;
}
