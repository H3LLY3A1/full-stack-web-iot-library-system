import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Client } from './client.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uid: string;

  @OneToOne(() => Client, (client) => client.card, { nullable: true })
  user: Client;
}
