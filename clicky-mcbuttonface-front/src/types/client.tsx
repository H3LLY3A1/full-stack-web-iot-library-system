import type { Borrow } from "./borrow";
import type { Card } from "./card";

export type Client = {
  id: number;
  cardId: string;
  name: string;
  email: string;
  borrows: Borrow[];
  card: Card | null;
};
