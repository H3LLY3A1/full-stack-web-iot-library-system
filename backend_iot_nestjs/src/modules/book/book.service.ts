import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../../entities/book.entity';

import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>
  ) {}

  async create(dto: CreateBookDto & { cardId: string }) {
    const book = this.bookRepo.create({
      cardId: dto.cardId,
      title: dto.title,
      author: dto.author,
    });
    return this.bookRepo.save(book);
  }

  findAll() {
    return this.bookRepo.find({ relations: ['borrows'] });
  }


  async findOneByCardUid(cardUid: string) {
    return this.bookRepo.findOne({ where: { cardId: cardUid }, relations: ['borrows'] });
  }


  async updateByCardUid(cardUid: string, dto: UpdateBookDto) {
    const book = await this.bookRepo.findOne({ where: { cardId: cardUid }, relations: ['borrows'] });
    if (!book) throw new NotFoundException('Book not found');
    Object.assign(book, dto as any);
    return this.bookRepo.save(book);
  }


  async removeByCardUid(cardUid: string) {
    const book = await this.bookRepo.findOne({ where: { cardId: cardUid }, relations: ['borrows'] });
    if (!book) throw new NotFoundException('Book not found');
    return this.bookRepo.remove(book);
  }

}
