import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserItem } from './UserItem';

@Entity('Items')
export class Item {
  @PrimaryGeneratedColumn()
  itemId: string;

  @Column()
  itemName: string;

  @Column()
  itemType: string;

  @Column('json')
  itemAttributes: any;

  @Column('text')
  itemDescription: string;

  @OneToMany(() => UserItem, userItem => userItem.item)
  userItems: UserItem[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedTime: Date;
}
