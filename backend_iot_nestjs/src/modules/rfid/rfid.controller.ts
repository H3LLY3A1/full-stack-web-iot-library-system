import { Controller, Post, Body } from '@nestjs/common';
import { RfidService } from './rfid.service';

@Controller('rfid')
export class RfidController {
  constructor(private readonly rfidService: RfidService) {}

  @Post('scan')
  async scan(@Body('uid') uid: string) {
    return this.rfidService.handleCardScan(uid);
  }

  @Post('finish')
  async finish(@Body('uid') uid: string) {
    await this.rfidService.finishedAction(uid);
    return { ok: true };
  }

  @Post('cancel')
  async cancel() {
    await this.rfidService.cancelRead();
    return { ok: true };
  }
}
