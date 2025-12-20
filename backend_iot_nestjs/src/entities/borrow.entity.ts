import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Book } from './book.entity';
import { Client } from './client.entity';

@Entity()
export class Borrow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.borrows, { onDelete: 'CASCADE' })
  book: Book;

  @ManyToOne(() => Client, (client) => client.borrows, { onDelete: 'CASCADE' })
  client: Client;

  @Column()
  borrowedAt: Date;

  @Column()
  dueDate: Date;

  @Column({ nullable: true })
  returnedAt?: Date;
}
