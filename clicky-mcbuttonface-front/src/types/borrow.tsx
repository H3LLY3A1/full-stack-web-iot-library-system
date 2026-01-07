import type { Book } from "./book";

export type Borrow = {
  id: number;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  book: Book;
};
