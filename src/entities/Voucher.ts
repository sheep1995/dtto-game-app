import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from './User';
  import { Item } from './Item';
  
  @Entity('Vouchers')
  export class Voucher {
    @PrimaryGeneratedColumn()
    voucherId: string;
  
    @Column()
    userId: string;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;
  
    @Column()
    itemId: string;
  
    @ManyToOne(() => Item, item => item.vouchers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'itemId' })
    item: Item;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdTime: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedTime: Date;
  }
  