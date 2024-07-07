import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Admins')
export class Admin {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;
}
