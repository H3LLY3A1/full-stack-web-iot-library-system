import { Injectable, Logger } from '@nestjs/common';
import { MqttService } from '../../mqtt/mqtt.service';
import { CardService } from '../card/card.service';
import { ClientService } from '../client/client.service';
import { BorrowService } from '../borrow/borrow.service';
import { EventsGateway } from '../../gateway/events.gateway';

@Injectable()
export class RfidService {

  async scanForRfidCard(
    validateFn: (uid: string, card: any) => Promise<{ ok: boolean; reason?: string }>,
    scanTopic = 'raspberry/rfid/register',
    scanPayload: any = { action: 'scan' },
    timeoutMs = 10000
  ): Promise<{ status: string; uid?: string; reason?: string }> {
    this.mqtt.publish(scanTopic, scanPayload);

    return new Promise((resolve) => {
      let resolved = false;
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.mqtt.publish('raspberry/led', { color: 'red' });
          resolve({ status: 'timeout' });
        }
      }, timeoutMs);

      const handler = async (topic: string, message: string) => {
        if (topic === 'raspberry/rfid/scan') {
          try {
            const payload = JSON.parse(message);
            const card = await this.cardService.findByUid(payload.uid);
            const validation = await validateFn(payload.uid, card);
            if (!validation.ok) {
              this.mqtt.publish('raspberry/led', { color: 'red' });
              if (!resolved) {
                resolved = true;
                clearTimeout(timeout);
                resolve({ status: 'rejected', uid: payload.uid, reason: validation.reason });
              }
            } else {
              this.mqtt.publish('raspberry/led', { color: 'green' });
              if (!resolved) {
                resolved = true;
                clearTimeout(timeout);
                resolve({ status: 'ok', uid: payload.uid });
              }
            }
          } catch (e) {
            this.logger.error('Invalid message from MQTT: ' + message);
          }
        }
      };
      this.mqtt.onMessage(handler);
    });
  }
  private readonly logger = new Logger('RfidService');

  constructor(
    private readonly mqtt: MqttService,
    private readonly cardService: CardService,
    private readonly clientService: ClientService,
    private readonly borrowService: BorrowService,
    public readonly gateway: EventsGateway,
  ) {}

}
