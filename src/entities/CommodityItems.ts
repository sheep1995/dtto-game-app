import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Commodities } from './Commodities';
import { Items } from './Items';

@Entity('CommodityItems')  // 指定表名為 'CommodityItems'
export class CommodityItems {
  @PrimaryColumn()
  commodityId: string;

  @PrimaryColumn()
  itemId: string;

  @Column()
  quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedTime: Date;

  @ManyToOne(() => Commodities, commodity => commodity.commodityItems)
  @JoinColumn({ name: 'commodityId' })
  commodity: Commodities;

  @ManyToOne(() => Items, item => item.commodityItems)
  @JoinColumn({ name: 'itemId' })
  item: Items;
}
