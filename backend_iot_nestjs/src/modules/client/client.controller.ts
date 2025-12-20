import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() dto: CreateClientDto & { cardId: string }) {
    return this.clientService.create(dto);
  }

  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Get(':cardUid')
  findOne(@Param('cardUid') cardUid: string) {
    return this.clientService.findOneByCardUid(cardUid);
  }

  @Put(':cardUid')
  update(@Param('cardUid') cardUid: string, @Body() dto: UpdateClientDto) {
    return this.clientService.updateByCardUid(cardUid, dto);
  }

  @Delete(':cardUid')
  remove(@Param('cardUid') cardUid: string) {
    return this.clientService.removeByCardUid(cardUid);
  }

  // @Post(':id/card/:uid')
  // assignCard(@Param('id') id: string, @Param('uid') uid: string) {
  //   return this.clientService.assignCard(Number(id), uid);
  // }

  // @Delete(':id/card')
  // unassignCard(@Param('id') id: string) {
  //   return this.clientService.unassignCard(Number(id));
  // }
}
