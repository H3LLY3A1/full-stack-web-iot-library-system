import axios from "axios";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function AddClientFormPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cardUid, setCardUid] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        cardUid: cardUid.trim() === "" ? null : cardUid.trim(),
      };

      await axios.post("http://localhost:3000/clients", payload);
      navigate("/clients");
    } catch (err: any) {
      setError(err?.message ?? "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/clients");
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-5xl px-4 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Add new client
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Register a new RFID library member
            </p>
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
                htmlFor="name"
                className="text-xs font-medium uppercase tracking-wide text-neutral-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                placeholder="Alice Smith"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-wide text-neutral-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                placeholder="alice@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="cardUid"
                className="text-xs font-medium uppercase tracking-wide text-neutral-700"
              >
                Card UID (optional)
              </label>
              <input
                id="cardUid"
                type="text"
                value={cardUid}
                onChange={(e) => setCardUid(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                placeholder="04A1B2C3D4"
              />
              <p className="text-[11px] text-neutral-500">
                Leave empty if the client doesn&apos;t have a card yet.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50 active:bg-neutral-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-neutral-900 active:bg-black/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Saving..." : "Save client"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
