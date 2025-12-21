import type { Book } from "../../types/book";

type BookTileProps = {
  book: Book;
  onClick?: () => void;
};

export default function BookTile({ book, onClick }: BookTileProps) {
  const activeBorrow = book.borrows.find((b) => !b.returnedAt);
  const isBorrowed = Boolean(activeBorrow);

  return (
    <article
      key={book.cardId}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold leading-tight">
            {book.title}
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">{book.author}</p>
        </div>

        <span
          className={`inline-flex h-8 items-center rounded-full px-6 text-[11px] font-semibold ${
            isBorrowed
              ? "border border-red-600 bg-red-50 text-red-700"
              : "border border-neutral-300 bg-white text-neutral-600"
          }`}
        >
          {book.borrows.length} borrow
          {book.borrows.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-3 space-y-2 text-xs text-neutral-600">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-neutral-400">{book.cardId}</span>
          <span
            className={`mr-2 text-[13px] font-medium ${
              isBorrowed ? "text-red-600" : "text-green-600"
            }`}
          >
            {isBorrowed ? "Borrowed" : "Available"}
          </span>
        </div>

        {isBorrowed && activeBorrow?.dueDate && (
          <p className="text-[11px] text-neutral-500">
            Due date:{" "}
            <span className="font-medium">
              {new Date(activeBorrow.dueDate).toLocaleDateString()}
            </span>
          </p>
        )}
      </div>
    </article>
  );
}
