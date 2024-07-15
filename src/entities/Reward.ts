import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('Rewards')
export class Reward {
  @PrimaryColumn()
  rewardId: string;

  @Column('text')
  description: string;

  @Column({ type: 'json', nullable: true })
  rewards: any;
}