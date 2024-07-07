import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from './User';
  import { Item } from './Item';
  
  @Entity('Compensations')
  export class Compensation {
    @PrimaryGeneratedColumn()
    compensationId: string;
  
    @Column()
    userId: string;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;
  
    @Column()
    itemId: string;
  
    @ManyToOne(() => Item)
    @JoinColumn({ name: 'itemId' })
    item: Item;
  
    @Column()
    quantity: number;
  
    @Column()
    staffId: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdTime: Date;
  }
  