import axios from "axios";
import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button";
import { toast } from "react-toastify";
import ScanCardDialog from "../../components/scan-card-dialog";

export default function AddClientFormPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const scanCancelledRef = useRef(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    scanCancelledRef.current = false;

    const payload = {
      name: name.trim(),
      email: email.trim(),
    };

    try {
      const result = await axios.post(
        "http://localhost:3000/rfid/register-client",
        payload
      );

      if (!scanCancelledRef.current) {
        if (result.data.status == "timeout") {
          toast.error("Timeout: No card scanned");
        } else if (result.data.status == "rejected") {
          toast.error("Card rejected");
        } else if (result.data.status == "ok") {
          toast.success("Client added successfully");
          navigate("/clients");
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
    navigate("/clients");
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
              Add new client
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Register a new RFID library member
            </p>
          </div>
        </header>

        <div className="w-full mt-6">
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

      {submitting && (
        <ScanCardDialog
          title="Registering client"
          subtitle="Please scan the new client's card"
          onCancel={handleDialogCancel}
        />
      )}
    </div>
  );
}
