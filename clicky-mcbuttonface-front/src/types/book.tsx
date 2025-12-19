import type { Borrow } from "./borrow";

export type Book = {
  id: number;
  title: string;
  author: string;
  borrows: Borrow[];
};
