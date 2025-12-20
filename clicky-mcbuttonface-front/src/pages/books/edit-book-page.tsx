import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/button";
import Loading from "../../components/loading";

export default function UpdateBookFormPage() {
  const navigate = useNavigate();
  const { cardUid } = useParams<{ cardUid: string }>();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cardUid) return;

    setLoading(true);
    setError("");

    axios
      .get<{ title: string; author: string }>(
        `http://localhost:3000/books/${cardUid}`
      )
      .then((res) => {
        setTitle(res.data?.title ?? "");
        setAuthor(res.data?.author ?? "");
      })
      .catch((e) => setError(e?.message ?? "Request failed"))
      .finally(() => setLoading(false));
  }, [cardUid]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!cardUid) return;

    setError("");
    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        author: author.trim(),
      };

      await axios.put(`http://localhost:3000/books/${cardUid}`, payload);
      navigate(`/books/${cardUid}`);
    } catch (err: any) {
      setError(err?.message ?? "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (cardUid) navigate(`/books/${cardUid}`);
    else navigate("/books");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex w-full h-[80vh] items-center justify-center bg-white text-black">
      <div className="w-5xl px-4 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Update book
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Edit the book details in the library catalogue
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700">
              UID: {cardUid ?? "-"}
            </span>
          </div>
        </header>

        <div className="w-full mt-10">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <p className="font-medium">Something went wrong</p>
              <p className="mt-1 text-xs text-red-700">{error}</p>
            </div>
          )}

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
                disabled={submitting}
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
                disabled={submitting}
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
                {submitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
