import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import ErrorInfo from "../../components/error-info";
import BookTile from "../../components/books/book-tile";
import type { Book } from "../../types/book";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Book[]>("http://localhost:3000/books")
      .then((res) => setBooks(res.data))
      .catch((e) => setError(e?.message ?? "Request failed"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddBook = () => {
    navigate("/books/add-form");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorInfo />;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Books</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Library catalogue and current availability
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700 sm:inline-flex">
              {books.length} book{books.length === 1 ? "" : "s"}
            </span>
            <button
              type="button"
              onClick={handleAddBook}
              className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-neutral-900 active:bg-black/90"
            >
              <span className="text-sm leading-none">+</span>
              <span>Add book</span>
            </button>
          </div>
        </header>

        {books.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-10 text-center text-sm text-neutral-500">
            No books in the catalogue yet. Add a new book in the admin panel and
            it&apos;ll show up here.
          </div>
        ) : (
          <div className="space-y-4">
            {books.map((book) => (
              <BookTile key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
