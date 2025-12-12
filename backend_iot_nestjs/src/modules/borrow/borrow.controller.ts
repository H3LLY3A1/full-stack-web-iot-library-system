import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { BorrowService } from './borrow.service';

@Controller('borrows')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  create(@Body('bookId') bookId: number, @Body('clientId') clientId: number) {
    return this.borrowService.create(bookId, clientId);
  }

  @Get()
  findAll() {
    return this.borrowService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borrowService.findOne(Number(id));
  }

  @Post(':id/return')
  returnBook(@Param('id') id: string) {
    return this.borrowService.returnBook(Number(id));
  }

  @Get('client/:clientId')
  borrowsForClient(@Param('clientId') clientId: string) {
    return this.borrowService.borrowsForClient(Number(clientId));
  }

  @Get('book/:bookId')
  borrowsForBook(@Param('bookId') bookId: string) {
    return this.borrowService.borrowsForBook(Number(bookId));
  }
}
