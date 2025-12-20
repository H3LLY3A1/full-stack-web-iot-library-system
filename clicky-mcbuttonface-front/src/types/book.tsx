import type { Borrow } from "./borrow";

export type Book = {
  id: number;
  cardId: string;
  title: string;
  author: string;
  borrows: Borrow[];
};
