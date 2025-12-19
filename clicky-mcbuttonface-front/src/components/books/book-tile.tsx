import type { Book } from "../../types/book";

export default function BookTile({ book }: { book: Book }) {
  const activeBorrow = book.borrows.find((b) => !b.returnedAt);
  const isBorrowed = Boolean(activeBorrow);

  return (
    <article
      key={book.id}
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
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            isBorrowed
              ? "border border-red-600 bg-red-50 text-red-700"
              : "border border-neutral-300 bg-white text-neutral-600"
          }`}
        >
          {isBorrowed ? "Borrowed" : "Available"}
        </span>
      </div>

      <div className="mt-3 space-y-2 text-xs text-neutral-600">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate">
            Status:{" "}
            <span className="font-medium">
              {isBorrowed ? "Currently borrowed" : "On shelf"}
            </span>
          </span>
          <span className="text-[11px] text-neutral-500">
            {book.borrows.length} borrow
            {book.borrows.length === 1 ? "" : "s"}
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
