import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Client } from './entities/client.entity';
import { Book } from './entities/book.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const cardRepo = app.get(getRepositoryToken(Card));
  const clientRepo = app.get(getRepositoryToken(Client));
  const bookRepo = app.get(getRepositoryToken(Book));

  await clientRepo.clear();
  await bookRepo.clear();
  await cardRepo.clear();


  // Example cards

  const cardUser1 = cardRepo.create({ uid: 'CARDUID-USER-1' });
  const cardUser2 = cardRepo.create({ uid: 'CARDUID-USER-2' });
  const cardUser3 = cardRepo.create({ uid: 'CARDUID-USER-3' });
  const cardUser4 = cardRepo.create({ uid: 'CARDUID-USER-4' });
  const cardBook1 = cardRepo.create({ uid: 'CARDUID-BOOK-1' });
  const cardBook2 = cardRepo.create({ uid: 'CARDUID-BOOK-2' });
  const cardBook3 = cardRepo.create({ uid: 'CARDUID-BOOK-3' });
  const cardBook4 = cardRepo.create({ uid: 'CARDUID-BOOK-4' });
  await cardRepo.save([cardUser1, cardUser2, cardUser3, cardUser4, cardBook1, cardBook2, cardBook3, cardBook4]);

  // Example users

  const user1 = clientRepo.create({ cardId: 'CARDUID-USER-1', name: 'Jan Example', email: 'jan@example.com' });
  const user2 = clientRepo.create({ cardId: 'CARDUID-USER-2', name: 'Anna Example', email: 'anna@example.com' });
  const user3 = clientRepo.create({ cardId: 'CARDUID-USER-3', name: 'Piotr Test', email: 'piotr@example.com' });
  const user4 = clientRepo.create({ cardId: 'CARDUID-USER-4', name: 'Maria Testowa', email: 'maria@example.com' });
  await clientRepo.save([user1, user2, user3, user4]);

  // Example books

  const book1 = bookRepo.create({ cardId: 'CARDUID-BOOK-1', title: 'Przykładowa Książka', author: 'Autor Testowy' });
  const book2 = bookRepo.create({ cardId: 'CARDUID-BOOK-2', title: 'Inna Książka', author: 'Drugi Autor' });
  const book3 = bookRepo.create({ cardId: 'CARDUID-BOOK-3', title: 'Trzecia Książka', author: 'Autor Trzeci' });
  const book4 = bookRepo.create({ cardId: 'CARDUID-BOOK-4', title: 'Czwarta Książka', author: 'Autor Czwarty' });
  await bookRepo.save([book1, book2, book3, book4]);

  await app.close();
  console.log('Database seeded!');
}

seed();