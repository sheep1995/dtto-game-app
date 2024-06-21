import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CommodityItems } from './CommodityItems';

@Entity('Commodities')
export class Commodities {
  @PrimaryGeneratedColumn('uuid')
  commodityId: string;

  @Column()
  commodityName: string;

  @Column({ type: 'text', nullable: true })
  commodityDescription: string;

  @Column('decimal')
  price: number;

  @Column()
  currencyType: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedTime: Date;

  @OneToMany(() => CommodityItems, commodityItem => commodityItem.commodity)
  commodityItems: CommodityItems[];
}
