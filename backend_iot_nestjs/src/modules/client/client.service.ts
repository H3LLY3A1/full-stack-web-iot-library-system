import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../entities/client.entity';
import { Card } from '../../entities/card.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,
  ) {}

  create(dto: CreateClientDto) {
    const client = this.clientRepo.create({ name: dto.name, email: dto.email } as any);
    return this.clientRepo.save(client);
  }

  findAll() {
    return this.clientRepo.find({ relations: ['borrows', 'card'] });
  }

  findOne(id: number) {
    return this.clientRepo.findOne({ where: { id }, relations: ['borrows', 'card'] });
  }

  async update(id: number, dto: UpdateClientDto) {
    const client = await this.findOne(id);
    if (!client) throw new NotFoundException('Client not found');
    Object.assign(client, dto as any);
    return this.clientRepo.save(client);
  }

  async remove(id: number) {
    const client = await this.findOne(id);
    if (!client) throw new NotFoundException('Client not found');
    return this.clientRepo.remove(client);
  }

  async assignCard(clientId: number, uid: string) {
    const client = await this.findOne(clientId);
    if (!client) throw new NotFoundException('Client not found');

    let card = await this.cardRepo.findOne({ where: { uid } });
    if (!card) {
      card = this.cardRepo.create({ uid });
      await this.cardRepo.save(card);
    }

    client.card = card;
    await this.clientRepo.save(client);
    return client;
  }

  async unassignCard(clientId: number) {
    const client = await this.findOne(clientId);
    if (!client) throw new NotFoundException('Client not found');
    client.card = null;
    await this.clientRepo.save(client);
    return client;
  }
}

