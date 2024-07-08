import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('DailyMetrics')
export class DailyMetrics {
    @PrimaryColumn({ type: 'date' })
    date: string;

    @Column({ type: 'int', default: 0 })
    highestConcurrentUsers: number;
}