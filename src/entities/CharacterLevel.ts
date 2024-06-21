import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { User } from './User';

@Entity({ name: 'CharacterLevels' })
export class CharacterLevel {
  @PrimaryColumn()
  characterLevel: number;

  @Column({ type: 'varchar' })
  characterName: string;

  @Column({ type: 'int' })
  quantity: number;

  @OneToMany(() => User, (user) => user.characterLevel)
  users: User[];
}
