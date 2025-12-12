import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrow } from '../../entities/borrow.entity';
import { Book } from '../../entities/book.entity';
import { Client } from '../../entities/client.entity';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Borrow, Book, Client])],
  providers: [BorrowService],
  controllers: [BorrowController],
  exports: [BorrowService],
})
export class BorrowModule {}
