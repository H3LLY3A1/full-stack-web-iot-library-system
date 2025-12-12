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
    private readonly repo: Repository<Book>,
  ) {}

  create(dto: CreateBookDto) {
    const b = this.repo.create(dto as any);
    return this.repo.save(b);
  }

  findAll() {
    return this.repo.find({ relations: ['borrows'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['borrows'] });
  }

  async update(id: number, dto: UpdateBookDto) {
    const book = await this.findOne(id);
    if (!book) throw new NotFoundException('Book not found');
    Object.assign(book, dto as any);
    return this.repo.save(book);
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    if (!book) throw new NotFoundException('Book not found');
    return this.repo.remove(book);
  }

}
