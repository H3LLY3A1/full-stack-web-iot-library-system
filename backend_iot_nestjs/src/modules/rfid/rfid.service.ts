import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MqttService } from '../../mqtt/mqtt.service';
import { CardService } from '../card/card.service';
import { ClientService } from '../client/client.service';
import { BorrowService } from '../borrow/borrow.service';
import { EventsGateway } from '../../gateway/events.gateway';

@Injectable()
export class RfidService implements OnModuleInit {
  private readonly logger = new Logger('RfidService');

  constructor(
    private readonly mqtt: MqttService,
    private readonly cardService: CardService,
    private readonly clientService: ClientService,
    private readonly borrowService: BorrowService,
    private readonly gateway: EventsGateway,
  ) {}

  onModuleInit() {
    this.mqtt.onMessage(async (topic, message) => {
      if (topic === 'raspberry/rfid/scan') {
        try {
          const payload = JSON.parse(message);
          await this.handleCardScan(payload.uid);
        } catch (e) {
          this.logger.error('Invalid message from MQTT: ' + message);
        }
      }
      if (topic === 'raspberry/rfid/cancel') {
        this.mqtt.publish('raspberry/led', { color: 'green' });
        this.gateway.emit('rfid/cancelled', { ok: true });
      }
    });

    this.mqtt.publish('raspberry/led', { color: 'green' });
  }

  async handleCardScan(uid: string) {
    this.gateway.emit('rfid/scanned', { uid });
    this.mqtt.publish('raspberry/led', { color: 'red' });

    const card = await this.cardService.findByUid(uid);
    if (!card || !card.user) {
      this.logger.log(`Card ${uid} unknown`);
      this.mqtt.publish('raspberry/rfid/response', { uid, status: 'unknown' });
      this.gateway.emit('rfid/response', { uid, status: 'unknown' });
      return { status: 'unknown' };
    }

    const client = await this.clientService.findOne(card.user.id);
    const borrows = await this.borrowService.borrowsForClient(client.id);
    const activeBorrows = borrows.filter(b => !b.returnedAt);
    this.mqtt.publish('raspberry/rfid/response', { uid, status: 'found', client, borrows: activeBorrows });
    this.gateway.emit('rfid/response', { uid, status: 'found', client, borrows: activeBorrows });
    return { status: 'found', client, borrows: activeBorrows };
  }

  async finishedAction(uid: string) {
    this.mqtt.publish('raspberry/led', { color: 'green' });
    this.gateway.emit('rfid/done', { uid });
  }

  async cancelRead() {
    this.mqtt.publish('raspberry/rfid/cancel', { reason: 'user_cancelled' });
    this.mqtt.publish('raspberry/led', { color: 'green' });
    this.gateway.emit('rfid/cancelled', { ok: true });
  }
}
