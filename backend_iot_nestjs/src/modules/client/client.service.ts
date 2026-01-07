import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Client } from "../../entities/client.entity";

import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>
  ) {}

  async create(dto: CreateClientDto & { cardId: string }) {
    const client = this.clientRepo.create({
      cardId: dto.cardId,
      name: dto.name,
      email: dto.email,
    });
    return this.clientRepo.save(client);
  }

  findAll() {
    return this.clientRepo.find({ relations: ["borrows"] });
  }

  async findOneByCardUid(cardUid: string) {
    return this.clientRepo.findOne({
      where: { cardId: cardUid },
      relations: {
        borrows: { book: true },
      },
    });
  }

  async updateByCardUid(cardUid: string, dto: UpdateClientDto) {
    const client = await this.clientRepo.findOne({
      where: { cardId: cardUid },
      relations: ["borrows"],
    });
    if (!client) throw new NotFoundException("Client not found");
    Object.assign(client, dto as any);
    return this.clientRepo.save(client);
  }

  async removeByCardUid(cardUid: string) {
    const client = await this.clientRepo.findOne({
      where: { cardId: cardUid },
      relations: ["borrows"],
    });
    if (!client) throw new NotFoundException("Client not found");
    return this.clientRepo.remove(client);
  }

  // async assignCard(clientId: number, uid: string) {
  //   const client = await this.findOne(clientId);
  //   if (!client) throw new NotFoundException("Client not found");
  //
  //   let card = await this.cardRepo.findOne({ where: { uid } });
  //   if (!card) {
  //     card = this.cardRepo.create({ uid });
  //     await this.cardRepo.save(card);
  //   }
  //
  //   client.card = card;
  //   await this.clientRepo.save(client);
  //   return client;
  // }

  // async unassignCard(clientId: number) {
  //   const client = await this.findOne(clientId);
  //   if (!client) throw new NotFoundException("Client not found");
  //   client.card = null;
  //   await this.clientRepo.save(client);
  //   return client;
  // }
}
