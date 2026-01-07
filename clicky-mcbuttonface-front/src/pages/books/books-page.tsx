import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import ErrorInfo from "../../components/error-info";
import BookTile from "../../components/books/book-tile";
import type { Book } from "../../types/book";
import Button from "../../components/button";
import { MdPlaylistAdd } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";
import { toast } from "react-toastify";
import ScanCardDialog from "../../components/scan-card-dialog";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCardScanning, setIsCardScanning] = useState(false);
  const scanCancelledRef = useRef(false);

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

  const handleScanBookCard = async () => {
    setIsCardScanning(true);
    scanCancelledRef.current = false;

    try {
      const { data } = await axios.post(
        "http://localhost:3000/rfid/scan-book"
      );

      const status = data.status;

      if (!scanCancelledRef.current) {
        if (status == "timeout") {
          toast.error("Timeout: No card scanned");
        } else if (status == "rejected") {
          toast.error("Card rejected");
        } else if (status == "ok") {
          navigate(`/books/${data.cardId}`);
        } else {
          toast.error("Unknown response status");
        }
      }
    } catch (err: any) {
      if (!scanCancelledRef.current) {
        toast.error(err?.message ?? "Request failed");
      }
    } finally {
      setIsCardScanning(false);
    }
  };

  const handleOpenBook = (id: string) => {
    navigate(`/books/${id}`);
  };

  const handleCancelDialog = () => {
    setIsCardScanning(false);
    axios.post("http://localhost:3000/rfid/cancel-scan");
    scanCancelledRef.current = true;
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
            <span className="inline-flex h-8 items-center rounded-full border border-neutral-200 bg-neutral-50 px-6 text-xs font-medium text-neutral-700">
              {books.length} book{books.length === 1 ? "" : "s"}
            </span>

            <Button type="button" variant="primary" onClick={handleAddBook}>
              <MdPlaylistAdd />
              <span>Add book</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={handleScanBookCard}
            >
              <FaRegAddressCard />
              <span>Scan book card</span>
            </Button>
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
              <BookTile
                key={book.cardId}
                book={book}
                onClick={() => handleOpenBook(book.cardId)}
              />
            ))}
          </div>
        )}
      </div>

      {isCardScanning && (
        <ScanCardDialog
          title="Book page"
          subtitle="Please scan the book's card"
          onCancel={handleCancelDialog}
        />
      )}
    </div>
  );
}
