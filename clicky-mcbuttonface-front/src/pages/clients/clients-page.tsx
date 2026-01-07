import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import ErrorInfo from "../../components/error-info";
import ClientTile from "../../components/clients/client-tile";
import type { Client } from "../../types/client";
import Button from "../../components/button";
import ScanCardDialog from "../../components/scan-card-dialog";
import { toast } from "react-toastify";
import { MdPlaylistAdd } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCardScanning, setIsCardScanning] = useState(false);
  const scanCancelledRef = useRef(false);

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

  const handleScanClientCard = async () => {
    setIsCardScanning(true);
    scanCancelledRef.current = false;

    try {
      const { data } = await axios.post(
        "http://localhost:3000/rfid/scan-client"
      );

      const status = data.status;

      if (!scanCancelledRef.current) {
        if (status == "timeout") {
          toast.error("Timeout: No card scanned");
        } else if (status == "rejected") {
          toast.error("Card rejected");
        } else if (status == "ok") {
          navigate(`/clients/${data.cardId}`);
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

  const handleOpenClient = (id: string) => {
    navigate(`/clients/${id}`);
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
            <h1 className="text-3xl font-semibold tracking-tight">Clients</h1>
            <p className="mt-1 text-sm text-neutral-500">
              RFID library members and their active borrows
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 items-center rounded-full border border-neutral-200 bg-neutral-50 px-6 text-xs font-medium text-neutral-700">
              {clients.length} client{clients.length === 1 ? "" : "s"}
            </span>

            <Button type="button" variant="primary" onClick={handleAddClient}>
              <MdPlaylistAdd />
              <span>Add client</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={handleScanClientCard}
            >
              <FaRegAddressCard />
              <span>Scan client card</span>
            </Button>
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
              <ClientTile
                key={client.cardId}
                client={client}
                onClick={() => handleOpenClient(client.cardId)}
              />
            ))}
          </div>
        )}
      </div>

      {isCardScanning && (
        <ScanCardDialog
          title="Client page"
          subtitle="Please scan the client's card"
          onCancel={handleCancelDialog}
        />
      )}
    </div>
  );
}
