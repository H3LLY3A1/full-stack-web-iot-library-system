import type { Borrow } from "./borrow";

export type Book = {
  cardId: string;
  title: string;
  author: string;
  borrows: Borrow[];
};
