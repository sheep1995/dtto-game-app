import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserItem } from './UserItem';

@Entity('Items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  itemId: string;

  @Column({ type: 'varchar' })
  itemName: string;

  @Column({ type: 'varchar' })
  itemType: string;

  @Column({ type: 'json', nullable: true })
  itemAttributes: any;

  @Column({ type: 'text', nullable: true })
  itemDescription: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedTime: Date;

  @OneToMany(() => UserItem, userItem => userItem.item)
  userItems: UserItem[];
}
