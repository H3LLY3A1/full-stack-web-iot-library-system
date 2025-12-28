import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrow } from '../../entities/borrow.entity';
import { Book } from '../../entities/book.entity';
import { Client } from '../../entities/client.entity';

@Injectable()
export class BorrowService {
  constructor(
    @InjectRepository(Borrow) private readonly borrowRepo: Repository<Borrow>,
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
    @InjectRepository(Client) private readonly clientRepo: Repository<Client>,
  ) {}

  async create(bookCardId: string, clientCardId: string) {
    const book = await this.bookRepo.findOne({ where: { cardId: bookCardId } });
    if (!book) throw new NotFoundException('Book not found');
    const client = await this.clientRepo.findOne({ where: { cardId: clientCardId } });
    if (!client) throw new NotFoundException('Client not found');
    const borrows = await this.borrowRepo.find({ where: { book: { cardId: bookCardId } }, relations: ['book'] });
    const active = borrows.find(b => b.returnedAt == null);
    if (active) throw new BadRequestException('Book is already borrowed');
    const now = new Date();
    const due = new Date();
    due.setDate(now.getDate() + 21);
    const borrow = this.borrowRepo.create({ book, client, borrowedAt: now, dueDate: due });
    return this.borrowRepo.save(borrow);
  }

  findAll() {
    return this.borrowRepo.find({ relations: ['book', 'client'] });
  }

  findOne(id: number) {
    return this.borrowRepo.findOne({ where: { id }, relations: ['book', 'client'] });
  }

  async returnBook(borrowId: number) {
    const borrow = await this.findOne(borrowId);
    if (!borrow) throw new NotFoundException('Borrow not found');
    if (borrow.returnedAt) throw new BadRequestException('Book already returned');
    borrow.returnedAt = new Date();
    return this.borrowRepo.save(borrow);
  }

  async borrowsForClient(clientCardId: string) {
    return this.borrowRepo.find({ where: { client: { cardId: clientCardId } }, relations: ['book'] });
  }

  async borrowsForBook(bookCardId: string) {
    return this.borrowRepo.find({ where: { book: { cardId: bookCardId } }, relations: ['client'] });
  }

  async findByClientId(clientCardId: string) {
    return this.borrowRepo.find({ where: { client: { cardId: clientCardId } }, relations: ['book', 'client'] });
  }
}
