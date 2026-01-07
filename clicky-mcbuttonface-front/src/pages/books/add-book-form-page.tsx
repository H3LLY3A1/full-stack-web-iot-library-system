import axios from "axios";
import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button";
import { toast } from "react-toastify";
import ScanCardDialog from "../../components/scan-card-dialog";

export default function AddBookFormPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const scanCancelledRef = useRef(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    scanCancelledRef.current = false;

    const payload = {
      title: title.trim(),
      author: author.trim(),
    };

    try {
      const result = await axios.post(
        "http://localhost:3000/rfid/register-book",
        payload
      );

      if (!scanCancelledRef.current) {
        if (result.data.status == "timeout") {
          toast.error("Timeout: No card scanned");
        } else if (result.data.status == "rejected") {
          toast.error("Card rejected");
        } else if (result.data.status == "ok") {
          toast.success("Book added successfully");
          navigate("/books");
        } else {
          toast.error("Unknown response status");
        }
      }
    } catch (err: any) {
      if (!scanCancelledRef.current) {
        toast.error(err?.message ?? "Request failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/books");
  };

  const handleDialogCancel = () => {
    setSubmitting(false);
    axios.post("http://localhost:3000/rfid/cancel-scan");
    scanCancelledRef.current = true;
  };

  return (
    <div className="flex h-[70vh] w-5xl items-center justify-center bg-white text-black">
      <div className="w-5xl px-4 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Add new book
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Add a new book to the library catalogue
            </p>
          </div>
        </header>

        <div className="w-full mt-10">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 w-full rounded-2xl border border-neutral-200 bg-neutral-50/80 p-6 shadow-sm"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="title"
                className="text-xs font-medium uppercase tracking-wide text-neutral-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full min-h-12 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                placeholder="Clean Code"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="author"
                className="text-xs font-medium uppercase tracking-wide text-neutral-700"
              >
                Author
              </label>
              <input
                id="author"
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full min-h-12 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                placeholder="Robert C. Martin"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Saving..." : "Save book"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {submitting && (
        <ScanCardDialog
          title="Registering book"
          subtitle="Please scan the new book's card"
          onCancel={handleDialogCancel}
        />
      )}
    </div>
  );
}
