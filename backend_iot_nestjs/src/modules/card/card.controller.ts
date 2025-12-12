import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CardService } from './card.service';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  create(@Body('uid') uid: string) {
    return this.cardService.create(uid);
  }

  @Get()
  findAll() {
    return this.cardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(Number(id));
  }

  @Get('uid/:uid')
  findByUid(@Param('uid') uid: string) {
    return this.cardService.findByUid(uid);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body('uid') uid: string) {
    return this.cardService.update(Number(id), uid);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardService.remove(Number(id));
  }
}
