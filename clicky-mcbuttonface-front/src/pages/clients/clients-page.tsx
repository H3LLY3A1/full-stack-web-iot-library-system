import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import ErrorInfo from "../../components/error-info";
import ClientTile from "../../components/clients/client-tile";
import type { Client } from "../../types/client";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Client[]>("http://localhost:3000/clients")
      .then((res) => setClients(res.data))
      .catch((e) => setError(e?.message ?? "Request failed"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddClient = () => {
    navigate("/clients/add-form");
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
            <h1 className="text-3xl font-semibold tracking-tight">Clients</h1>
            <p className="mt-1 text-sm text-neutral-500">
              RFID library members and their active borrows
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700 sm:inline-flex">
              {clients.length} client{clients.length === 1 ? "" : "s"}
            </span>
            <button
              type="button"
              onClick={handleAddClient}
              className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-neutral-900 active:bg-black/90"
            >
              <span className="text-sm leading-none">+</span>
              <span>Add client</span>
            </button>
          </div>
        </header>

        {clients.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-10 text-center text-sm text-neutral-500">
            No clients yet. Add someone in the admin panel and they&apos;ll show
            up here.
          </div>
        ) : (
          <div className="space-y-4">
            {clients.map((client) => (
              <ClientTile key={client.cardId} client={client} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
