import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Borrow } from './borrow.entity';

@Entity()
export class Book {

  @PrimaryColumn()
  cardId: string; 

  @Column()
  title: string;

  @Column()
  author: string;

  @OneToMany(() => Borrow, (borrow) => borrow.book)
  borrows: Borrow[];


}
