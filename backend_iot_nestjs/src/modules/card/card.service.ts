import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../../entities/card.entity';

@Injectable()
export class CardService {
  constructor(@InjectRepository(Card) private readonly repo: Repository<Card>) {}

  create(uid: string) {
    const c = this.repo.create({ uid });
    return this.repo.save(c);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  findByUid(uid: string) {
    return this.repo.findOne({ where: { uid } });
  }

  async update(id: number, uid: string) {
    const card = await this.findOne(id);
    if (!card) throw new NotFoundException('Card not found');
    card.uid = uid;
    return this.repo.save(card);
  }

  async remove(id: number) {
    const card = await this.findOne(id);
    if (!card) throw new NotFoundException('Card not found');
    return this.repo.remove(card);
  }
}
