import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/button";
import Loading from "../../components/loading";

export default function UpdateClientFormPage() {
  const navigate = useNavigate();
  const { cardUid } = useParams<{ cardUid: string }>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [existingCardUid, setExistingCardUid] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cardUid) return;

    setLoading(true);
    setError("");

    axios
      .get<{ name: string; email: string; cardUid?: string | null }>(
        `http://localhost:3000/clients/${cardUid}`
      )
      .then((res) => {
        setName(res.data?.name ?? "");
        setEmail(res.data?.email ?? "");
        setExistingCardUid(res.data?.cardUid ?? cardUid ?? null);
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
        name: name.trim(),
        email: email.trim(),
      };

      await axios.put(`http://localhost:3000/clients/${cardUid}`, payload);
      navigate(`/clients/${cardUid}`);
    } catch (err: any) {
      setError(err?.message ?? "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (cardUid) navigate(`/clients/${cardUid}`);
    else navigate("/clients");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-[80vh] bg-white text-black flex items-center justify-center">
      <div className="w-full max-w-5xl px-4 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Update client
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Edit the RFID library member details
            </p>
          </div>

          <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700">
            UID: {existingCardUid ?? cardUid ?? "-"}
          </span>
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
                disabled={submitting}
                className="w-full min-h-12 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:opacity-70"
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
                disabled={submitting}
                className="w-full min-h-12 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:opacity-70"
                placeholder="alice@example.com"
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
