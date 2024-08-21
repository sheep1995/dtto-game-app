import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserItem } from './UserItem';
import { Transaction } from './Transaction';
import { Voucher } from './Voucher';

@Entity('Items')
export class Item {
  @PrimaryGeneratedColumn()
  itemId: string;

  @Column({ type: 'varchar' })
  itemName: string;

  @Column({ type: 'varchar' })
  itemType: string;

  @Column({ type: 'json', nullable: true })
  itemAttributes: any;

  @Column({ type: 'text', nullable: true })
  itemDescription: string;

  @Column({ type: 'boolean', default: false })
  amortizable: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedTime: Date;

  @OneToMany(() => UserItem, userItem => userItem.item)
  userItems: UserItem[];

  @OneToMany(() => Transaction, transaction => transaction.item)
  transactions: Transaction[];
  
  @OneToMany(() => Voucher, voucher => voucher.item)
  vouchers: Voucher[];
}
