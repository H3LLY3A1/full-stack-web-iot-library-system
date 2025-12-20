import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Borrow } from './borrow.entity';

@Entity()
export class Client {

  @PrimaryColumn()
  cardId: string; 

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Borrow, (borrow) => borrow.client)
  borrows: Borrow[];


}
