import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { BookModule } from './modules/book/book.module';
import { ClientModule } from './modules/client/client.module';
import { CardModule } from './modules/card/card.module';
import { RfidModule } from './modules/rfid/rfid.module';
import { BorrowModule } from './modules/borrow/borrow.module';
import { MqttModule } from './mqtt/mqtt.module';
import { EventsGateway } from './gateway/events.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_DATABASE || 'database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
    }),
    MqttModule,
    BookModule,
    ClientModule,
    CardModule,
    RfidModule,
    BorrowModule,
  ],
  controllers: [],
  providers: [EventsGateway],
})
export class AppModule {}
