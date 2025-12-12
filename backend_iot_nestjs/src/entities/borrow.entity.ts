import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Book } from './book.entity';
import { Client } from './client.entity';

@Entity()
export class Borrow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.borrows)
  book: Book;

  @ManyToOne(() => Client, (client) => client.borrows)
  client: Client;

  @Column()
  borrowedAt: Date;

  @Column()
  dueDate: Date;

  @Column({ nullable: true })
  returnedAt?: Date;
}
