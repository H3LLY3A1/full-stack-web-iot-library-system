import { Controller, Post, Body } from "@nestjs/common";
import { RfidService } from "./rfid.service";
import { ClientService } from "../client/client.service";
import { BookService } from "../book/book.service";
import { CardService } from "../card/card.service";

@Controller("rfid")
export class RfidController {
  constructor(
    private readonly rfidService: RfidService,
    private readonly clientService: ClientService,
    private readonly bookService: BookService,
    private readonly cardService: CardService
  ) {}

  @Post("register-client")
  async registerClientAndScan(@Body() dto: any) {
    const result = await this.rfidService.scanForRfidCard(async (uid, card) => {
      if (!card) return { ok: true };

      const existingClient =
        (await this.clientService.findOneByCardUid?.(card.uid)) || null;
      if (existingClient) return { ok: false, reason: "busy" };

      return { ok: true };
    });
    if (result.status === "ok" && result.uid) {
      // added: if card doens't exist yet, add it
      let card = await this.cardService.findByUid(result.uid);
      if (!card) {
        card = await this.cardService.create(result.uid);
      }

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
      if (!card) return { ok: true };

      const existingBook =
        (await this.bookService.findOneByCardUid?.(card.uid)) || null;
      if (existingBook) return { ok: false, reason: "busy" };

      return { ok: true };
    });
    if (result.status === "ok" && result.uid) {
      let card = await this.cardService.findByUid(result.uid);
      if (!card) {
        card = await this.cardService.create(result.uid);
      }

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
      if (!card) return { ok: true };

      const existingClient =
        (await this.clientService.findOneByCardUid?.(card.uid)) || null;
      if (existingClient) return { ok: false, reason: "busy" };

      return { ok: true };
    });
    this.rfidService.gateway.emit("rfid/register-result", result);
    return result;
  }

  // @Post("register-request")
  // async registerRequest() {
  //   const result = await this.rfidService.scanForRfidCard(async (uid, card) => {
  //     if (!card) return { ok: true };

  //     const existingClient =
  //       (await this.clientService.findOneByCardUid?.(card.uid)) || null;
  //     if (existingClient) return { ok: false, reason: "busy" };

  //     return { ok: true };
  //   });
  //   this.rfidService.gateway.emit("rfid/register-result", result);
  //   return result;
  // }

  @Post("register-book-request")
  async registerBookRequest() {
    const result = await this.rfidService.scanForRfidCard(async (uid, card) => {
      if (!card) return { ok: true };

      const existingBook =
        (await this.bookService.findOneByCardUid?.(card.uid)) || null;
      if (existingBook) return { ok: false, reason: "busy" };

      return { ok: true };
    });
    this.rfidService.gateway.emit("rfid/register-book-result", result);
    return result;
  }

  @Post("cancel-scan")
  async cancelScan() {
    this.rfidService.cancelScan();
    return { status: "cancelled" };
  }
}
