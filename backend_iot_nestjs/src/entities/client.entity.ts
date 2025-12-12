import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Borrow } from './borrow.entity';
import { Card } from './card.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Borrow, (borrow) => borrow.client)
  borrows: Borrow[];

  @OneToOne(() => Card, (card) => card.user, { cascade: true, nullable: true })
  @JoinColumn()
  card: Card;
}
