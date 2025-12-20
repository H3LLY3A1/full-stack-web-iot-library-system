import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/loading";
import ErrorInfo from "../../components/error-info";
import Button from "../../components/button";
import type { Client } from "../../types/client";

export default function ClientPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");

    axios
      .get<Client>(`http://localhost:3000/clients/${id}`)
      .then((res) => setClient(res.data))
      .catch((e) => setError(e?.message ?? "Request failed"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBack = () => {
    navigate("/clients");
  };

  const handleEditClient = () => {
    if (!id) return;
    navigate(`/clients/${id}/edit`);
  };

  const handleDeleteClient = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    setActionLoading(true);
    setError("");

    try {
      await axios.delete(`http://localhost:3000/clients/${id}`);
      navigate("/clients");
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete client");
      setActionLoading(false);
    }
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <p className="text-sm text-red-600">Invalid client id.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  if (error && !client) {
    return <ErrorInfo />;
  }

  if (!client) {
    return (
      <div className="min-h-[70vh] w-full bg-white text-black">
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="text-center">
            <p className="text-sm text-neutral-600">Client not found.</p>

            <div className="mt-4">
              <Button variant="primary" type="button" onClick={handleBack}>
                Back to clients
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeBorrows = client.borrows.filter((b: any) => !b.returnedAt);
  const pastBorrows = client.borrows.filter((b: any) => !!b.returnedAt);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <article className="flex flex-col rounded-2xl border border-neutral-200 bg-neutral-50/80 p-12 shadow-sm">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold leading-tight tracking-tight">
                {client.name}
              </h1>
              <p className="text-sm text-neutral-500">{client.email}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="primary"
                onClick={handleBack}
                disabled={actionLoading}
              >
                Back
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={handleEditClient}
                disabled={actionLoading}
              >
                Edit client
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={handleDeleteClient}
                disabled={actionLoading}
                bgColor="bg-red-700"
              >
                {actionLoading ? "Deleting..." : "Delete client"}
              </Button>
            </div>
          </header>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <p className="font-medium">Something went wrong</p>
              <p className="mt-1 text-xs text-red-700">{error}</p>
            </div>
          )}

          <div className="mt-6 divide-y divide-neutral-200">
            <section className="py-5">
              <h2 className="text-md font-semibold tracking-tight text-neutral-800">
                Card
              </h2>

              <p className="mt-2 text-sm text-neutral-600">
                {client.cardId ? client.cardId : "No card assigned."}
              </p>
            </section>

            <section className="py-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-md font-semibold tracking-tight text-neutral-800">
                  Borrows
                </h2>
              </div>

              {activeBorrows.length === 0 ? (
                <p className="mt-2 text-sm text-neutral-600">
                  No active borrows.
                </p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                  {activeBorrows.map((borrow: any) => (
                    <li
                      key={borrow.id}
                      className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2"
                    >
                      <div className="space-y-0.5">
                        {borrow.book?.title && (
                          <p className="font-medium">{borrow.book.title}</p>
                        )}
                        <p className="text-xs text-neutral-500">
                          Borrowed{" "}
                          {new Date(borrow.borrowedAt).toLocaleDateString()} •
                          Due {new Date(borrow.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="py-5">
              <h2 className="text-md font-semibold tracking-tight text-neutral-800">
                Borrow history
              </h2>

              {pastBorrows.length === 0 ? (
                <p className="mt-2 text-sm text-neutral-600">
                  No past borrows.
                </p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                  {pastBorrows.map((borrow: any) => (
                    <li
                      key={borrow.id}
                      className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2"
                    >
                      <div className="space-y-0.5">
                        {borrow.book?.title && (
                          <p className="font-medium">{borrow.book.title}</p>
                        )}
                        <p className="text-xs text-neutral-500">
                          Borrowed{" "}
                          {new Date(borrow.borrowedAt).toLocaleDateString()} •
                          Returned{" "}
                          {borrow.returnedAt
                            ? new Date(borrow.returnedAt).toLocaleDateString()
                            : "—"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
