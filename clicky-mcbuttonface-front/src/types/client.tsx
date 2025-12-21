import type { Borrow } from "./borrow";

export type Client = {
  cardId: string;
  name: string;
  email: string;
  borrows: Borrow[];
};
