import { Module } from '@nestjs/common';
import { RfidService } from './rfid.service';
import { RfidController } from './rfid.controller';
import { MqttModule } from '../../mqtt/mqtt.module';
import { CardModule } from '../card/card.module';
import { ClientModule } from '../client/client.module';
import { BorrowModule } from '../borrow/borrow.module';
import { BookModule } from '../book/book.module';
import { EventsGateway } from '../../gateway/events.gateway';

@Module({
  imports: [MqttModule, CardModule, ClientModule, BorrowModule, BookModule],
  controllers: [RfidController],
  providers: [RfidService, EventsGateway],
  exports: [RfidService],
})
export class RfidModule {}
