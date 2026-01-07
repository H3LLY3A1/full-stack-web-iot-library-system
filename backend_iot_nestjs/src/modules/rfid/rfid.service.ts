import { Injectable, Logger } from "@nestjs/common";
import { MqttService } from "../../mqtt/mqtt.service";
import { CardService } from "../card/card.service";
import { ClientService } from "../client/client.service";
import { BorrowService } from "../borrow/borrow.service";
import { BookService } from "../book/book.service";
import { EventsGateway } from "../../gateway/events.gateway";

@Injectable()
export class RfidService {
  private cancelScanFlag = false;

  cancelScan() {
    this.cancelScanFlag = true;
  }

  async scanForRfidCard(
    validateFn: (
      uid: string,
      card: any
    ) => Promise<{ ok: boolean; reason?: string }>,
    scanTopic = "raspberry/rfid/register",
    scanPayload: any = { action: "scan" },
    timeoutMs = 3000
  ): Promise<{ status: string; uid?: string; reason?: string }> {
    this.mqtt.publish(scanTopic, scanPayload);

    return new Promise((resolve) => {
      let resolved = false;
      this.cancelScanFlag = false;

      const cleanup = () => {
        clearTimeout(timeout);
        this.mqtt.offMessage(handler);
      };

      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          this.mqtt.publish("raspberry/led", { color: "red" });
          resolve({ status: "timeout" });
        }
      }, timeoutMs);

      const handler = async (topic: string, message: string) => {
        if (this.cancelScanFlag && !resolved) {
          resolved = true;
          cleanup();
          this.mqtt.publish("raspberry/led", { color: "red" });
          resolve({ status: "cancelled" });
          return;
        }
        if (topic === "raspberry/rfid/scan") {
          try {
            const payload = JSON.parse(message);
            const card = await this.cardService.findByUid(payload.uid);
            const validation = await validateFn(payload.uid, card);
            if (!validation.ok) {
              this.mqtt.publish("raspberry/led", { color: "red" });
              if (!resolved) {
                resolved = true;
                cleanup();
                resolve({
                  status: "rejected",
                  uid: payload.uid,
                  reason: validation.reason,
                });
              }
            } else {
              this.mqtt.publish("raspberry/led", { color: "green" });
              if (!resolved) {
                resolved = true;
                cleanup();
                resolve({ status: "ok", uid: payload.uid });
              }
            }
          } catch (e) {
            this.logger.error("Invalid message from MQTT: " + message);
          }
        }
      };
      this.mqtt.onMessage(handler);
    });
  }
  private readonly logger = new Logger("RfidService");

  constructor(
    private readonly mqtt: MqttService,
    private readonly cardService: CardService,
    private readonly clientService: ClientService,
    private readonly borrowService: BorrowService,
    private readonly bookService: BookService,
    public readonly gateway: EventsGateway
  ) {
    this.initializeAutoScanHandler();
  }

  private initializeAutoScanHandler() {
    this.mqtt.onMessage(async (topic: string, message: string) => {
      if (topic === 'raspberry/rfid/scan') {
        await this.handleRfidScan(message);
      } else if (topic === 'raspberry/rfid/cancel') {
        await this.handleRfidCancel();
      }
    });
    this.logger.log('Automatic RFID scan handler initialized');
  }

  private async handleRfidScan(message: string) {
    try {
      const payload = JSON.parse(message);
      const { uid } = payload;

      this.logger.log(`RFID card scanned: ${uid}`);

      // led to red (processing)
      this.mqtt.publish('raspberry/led', { color: 'red' });

      const card = await this.cardService.findByUid(uid);

      if (!card) {
        this.logger.log(`Card ${uid} not found in database`);

        const response = {
          uid,
          card: null,
          client: null,
          book: null,
          borrows: []
        };

        this.mqtt.publish('raspberry/rfid/response', response);

        this.gateway.emit('rfid/scanned', response);

        return;
      }

      const client = await this.clientService.findOneByCardUid(uid);
      const book = await this.bookService.findOneByCardUid(uid);

      if (client) {
        const borrows = await this.borrowService.findByClientId(client.cardId);
        const activeBorrows = borrows.filter(b => !b.returnedAt);

        this.logger.log(`Client ${client.name} has ${activeBorrows.length} active borrows`);

        const response = {
          uid,
          card,
          client,
          book: null,
          borrows: activeBorrows
        };

        this.mqtt.publish('raspberry/rfid/response', response);
        this.gateway.emit('rfid/scanned', response);

        setTimeout(() => {
          this.mqtt.publish('raspberry/led', { color: 'green' });
        }, 5000);

        return;
      }

      if (book) {
        this.logger.log(`Book ${book.title} found`);

        const response = {
          uid,
          card,
          client: null,
          book,
          borrows: []
        };

        this.mqtt.publish('raspberry/rfid/response', response);
        this.gateway.emit('rfid/scanned', response);

        setTimeout(() => {
          this.mqtt.publish('raspberry/led', { color: 'green' });
        }, 5000);

        return;
      }

      this.logger.log(`Card ${uid} found but not assigned`);

      const response = {
        uid,
        card,
        client: null,
        book: null,
        borrows: []
      };

      this.mqtt.publish('raspberry/rfid/response', response);
      this.gateway.emit('rfid/scanned', response);

    } catch (error) {
      this.logger.error(`Error handling RFID scan: ${error.message}`);
      this.mqtt.publish('raspberry/led', { color: 'red' });
    }
  }

  private async handleRfidCancel() {
    this.logger.log('RFID scan cancelled');
    this.mqtt.publish('raspberry/led', { color: 'green' });
    this.gateway.emit('rfid/cancelled', {});
  }
}
