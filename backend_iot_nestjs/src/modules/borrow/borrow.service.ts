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

  async create(bookId: number, clientId: number) {
    const book = await this.bookRepo.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Book not found');
    const client = await this.clientRepo.findOne({ where: { id: clientId } });
    if (!client) throw new NotFoundException('Client not found');
    // Check if book is already borrowed (no returnedAt)
    const active = await this.borrowRepo.findOne({ where: { book: { id: bookId }, returnedAt: null } });
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

  async borrowsForClient(clientId: number) {
    return this.borrowRepo.find({ where: { client: { id: clientId } }, relations: ['book'] });
  }

  async borrowsForBook(bookId: number) {
    return this.borrowRepo.find({ where: { book: { id: bookId } }, relations: ['client'] });
  }
}
