import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.bookService.create(dto);
  }

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':cardUid')
  findOne(@Param('cardUid') cardUid: string) {
    return this.bookService.findOneByCardUid(cardUid);
  }

  @Put(':cardUid')
  update(@Param('cardUid') cardUid: string, @Body() dto: UpdateBookDto) {
    return this.bookService.updateByCardUid(cardUid, dto);
  }

  @Delete(':cardUid')
  remove(@Param('cardUid') cardUid: string) {
    return this.bookService.removeByCardUid(cardUid);
  }

}
