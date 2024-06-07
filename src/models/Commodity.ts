import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Commodity {
  @PrimaryGeneratedColumn()
  commodityId: string;

  @Column()
  commodityName: string;

  @Column('text')
  commodityDescription: string;

  @Column('decimal')
  price: number;

  @Column()
  currencyType: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}