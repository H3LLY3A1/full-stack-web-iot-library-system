import axios from "axios";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import Button from "../../components/button";

export default function AddClientFormPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cardUid, setCardUid] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [cardDialogOpen, setCardDialogOpen] = useState(false);

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

  const handleOpenCardDialog = () => {
    setCardDialogOpen(true);
  };

  const handleCloseCardDialog = () => {
    setCardDialogOpen(false);
  };

  return (
    <div className="flex h-[70vh] w-5xl items-center justify-center bg-white text-black">
      <div className="w-5xl px-4 py-8">
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
                className="w-full min-h-12 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
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
                className="w-full min-h-12 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                placeholder="alice@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-neutral-700">
                Card UID
              </span>

              <div className="w-full min-h-12 flex items-center rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100">
                {cardUid.trim() === "" ? (
                  <span className="text-sm text-neutral-500">
                    No card assigned
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-sm font-mono text-neutral-800">
                    {cardUid}
                  </span>
                )}

                <div className="ml-auto">
                  {cardUid.trim() === "" ? (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleOpenCardDialog}
                      disabled={submitting}
                    >
                      Add card
                    </Button>
                  ) : null}
                </div>
              </div>
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
                {submitting ? "Saving..." : "Save client"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {cardDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="min-w-1/4 max-w-2/5 rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-base font-semibold leading-tight">
              Waiting for card…
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Hold the RFID card near the reader to assign it to this client.
            </p>

            <div className="mt-16 flex flex-col items-center gap-4">
              <HashLoader />
              <Button
                type="button"
                variant="primary"
                className="mt-12"
                onClick={handleCloseCardDialog}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
