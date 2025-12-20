import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { BorrowService } from './borrow.service';

@Controller('borrows')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  create(@Body('bookCardId') bookCardId: string, @Body('clientCardId') clientCardId: string) {
    return this.borrowService.create(bookCardId, clientCardId);
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

  @Get('client/:clientCardId')
  borrowsForClient(@Param('clientCardId') clientCardId: string) {
    return this.borrowService.borrowsForClient(clientCardId);
  }

  @Get('book/:bookCardId')
  borrowsForBook(@Param('bookCardId') bookCardId: string) {
    return this.borrowService.borrowsForBook(bookCardId);
  }
}
