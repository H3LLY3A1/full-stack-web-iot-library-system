import { Controller, Post, Body } from "@nestjs/common";
import { RfidService } from "./rfid.service";
import { ClientService } from "../client/client.service";
import { BookService } from "../book/book.service";

@Controller("rfid")
export class RfidController {
  constructor(
    private readonly rfidService: RfidService,
    private readonly clientService: ClientService,
    private readonly bookService: BookService
  ) {}

  @Post("register-client")
  async registerClientAndScan(@Body() dto: any) {
    const result = await this.rfidService.scanForRfidCard(async (uid, card) => {
      if (!card) return { ok: false, reason: "unknown" };
      const existingClient =
        (await this.clientService.findOneByCardUid?.(card.uid)) || null;
      if (existingClient) return { ok: false, reason: "busy" };
      return { ok: true };
    });
    if (result.status === "ok" && result.uid) {
      const client = await this.clientService.create({
        ...dto,
        cardId: result.uid,
      });
      return { status: "ok", client };
    }
    return result;
  }

  @Post("register-book")
  async registerBookAndScan(@Body() dto: any) {
    const result = await this.rfidService.scanForRfidCard(async (uid, card) => {
      if (!card) return { ok: false, reason: "unknown" };
      const existingBook =
        (await this.bookService.findOneByCardUid?.(card.uid)) || null;
      if (existingBook) return { ok: false, reason: "busy" };
      return { ok: true };
    });
    if (result.status === "ok" && result.uid) {
      const book = await this.bookService.create({
        ...dto,
        cardId: result.uid,
      });
      return { status: "ok", book };
    }
    return result;
  }

  @Post("scan-client")
  async scanClientCard() {
    const result = await this.rfidService.scanForRfidCard(
      async (uid, card) => ({ ok: true })
    );

    if (result.status === "ok" && result.uid) {
      return { status: "ok", cardId: result.uid };
    }
    return result;
  }

  @Post("scan-book")
  async scanBookCard() {
    const result = await this.rfidService.scanForRfidCard(
      async (uid, card) => ({ ok: true })
    );
    if (result.status === "ok" && result.uid) {
      return { status: "ok", cardId: result.uid };
    }
    return result;
  }

  @Post("register-request")
  async registerRequest() {
    const result = await this.rfidService.scanForRfidCard(async (uid, card) => {
      if (!card) return { ok: false, reason: "unknown" };
      const existingClient =
        (await this.clientService.findOneByCardUid?.(card.uid)) || null;
      if (existingClient) return { ok: false, reason: "busy" };
      return { ok: true };
    });
    this.rfidService.gateway.emit("rfid/register-result", result);
    return result;
  }

  @Post("register-book-request")
  async registerBookRequest() {
    const result = await this.rfidService.scanForRfidCard(async (uid, card) => {
      if (!card) return { ok: false, reason: "unknown" };
      const existingBook =
        (await this.bookService.findOneByCardUid?.(card.uid)) || null;
      if (existingBook) return { ok: false, reason: "busy" };
      return { ok: true };
    });
    this.rfidService.gateway.emit("rfid/register-book-result", result);
    return result;
  }

  @Post("register-client-mock")
  async registerClientMock(@Body() dto: any) {
    const testUid = "NoXDummyUID1234";
    let card = await this.rfidService["cardService"].findByUid(testUid);
    if (card) {
      const existingClient =
        (await this.clientService.findOneByCardUid?.(card.uid)) || null;
      if (existingClient) {
        return { status: "rejected", reason: "busy", uid: testUid };
      }
    }
    if (!card) {
      card = await this.rfidService["cardService"].create(testUid);
    }
    const client = await this.clientService.create({ ...dto, cardId: testUid });
    return { status: "ok", client };
  }

  @Post("register-book-mock")
  async registerBookMock(@Body() dto: any) {
    const testUid = "NoXDummyBOOK1234";
    let card = await this.rfidService["cardService"].findByUid(testUid);
    if (card) {
      const existingBook =
        (await this.bookService.findOneByCardUid?.(card.uid)) || null;
      if (existingBook) {
        return { status: "rejected", reason: "busy", uid: testUid };
      }
    }
    if (!card) {
      card = await this.rfidService["cardService"].create(testUid);
    }
    const book = await this.bookService.create({ ...dto, cardId: testUid });
    return { status: "ok", book };
  }

  @Post("cancel-scan")
  async cancelScan() {
    this.rfidService.cancelScan();
    return { status: "cancelled" };
  }
}
