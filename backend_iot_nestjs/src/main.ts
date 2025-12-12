import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const conn = app.get(DataSource);
  const clientRepo = conn.getRepository('Client');
  const bookRepo = conn.getRepository('Book');
  const borrowRepo = conn.getRepository('Borrow');

  if ((await clientRepo.count()) === 0 && (await bookRepo.count()) === 0) {
    const alice = clientRepo.create({ name: 'Alice', email: 'alice@example.com' });
    const bob = clientRepo.create({ name: 'Bob', email: 'bob@example.com' });
    const carol = clientRepo.create({ name: 'Carol', email: 'carol@example.com' });
    await clientRepo.save([alice, bob, carol]);

    const book1 = bookRepo.create({ title: '1984', author: 'George Orwell' });
    const book2 = bookRepo.create({ title: 'Brave New World', author: 'Aldous Huxley' });
    const book3 = bookRepo.create({ title: 'Dune', author: 'Frank Herbert' });
    await bookRepo.save([book1, book2, book3]);

    const now = new Date();
    const due = new Date();
    due.setDate(now.getDate() + 21);
    const borrow1 = borrowRepo.create({ book: book1, client: alice, borrowedAt: now, dueDate: due });
    const borrow2 = borrowRepo.create({ book: book2, client: bob, borrowedAt: now, dueDate: due });
    await borrowRepo.save([borrow1, borrow2]);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server started on port ${port}`);
}
bootstrap();
