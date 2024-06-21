import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CommodityItems } from './CommodityItems';

@Entity('Items')  // 指定表名為 'Items'
export class Items {
  @PrimaryGeneratedColumn('uuid')
  itemId: string;

  @Column()
  itemName: string;

  @Column()
  itemType: string;

  @Column({ type: 'json', nullable: true })
  itemAttributes: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  itemDescription: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
  updatedTime: Date;

  @OneToMany(() => CommodityItems, commodityItem => commodityItem.item)
  commodityItems: CommodityItems[];
}
