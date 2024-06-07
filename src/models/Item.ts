import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  itemId: string;

  @Column()
  itemName: string;

  @Column()
  itemType: string;

  @Column('text')
  itemDescription: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}