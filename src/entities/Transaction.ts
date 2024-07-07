import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
  import { User } from './User';
  import { Item } from './Item';
  
  @Entity('Transactions')
  export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    transactionId: string;
  
    @Column()
    userId: string;
  
    @ManyToOne(() => User, user => user.transactions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
  
    @Column()
    itemId: string;
  
    @ManyToOne(() => Item, item => item.transactions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'itemId' })
    item: Item;
  
    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
  
    @Column({ nullable: true })
    status: string;
  
    @Column({ nullable: true })
    purchaseToken: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdTime: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedTime: Date;
  }
  