import { HashLoader } from "react-spinners";
import Button from "./button";

interface SubmitScanCardDialogProps {
  title: string;
  subtitle?: string;
  onCancel: () => void;
}

export default function ScanCardDialog({
  onCancel,
  title,
  subtitle = "Please scan a card",
}: SubmitScanCardDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="min-w-1/4 max-w-2/5 rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-base font-semibold leading-tight">{title}</h2>
        <p className="mt-1 text-xs text-neutral-500">{subtitle}</p>

        <div className="mt-16 flex flex-col items-center gap-4">
          <HashLoader />
          <Button
            type="button"
            variant="primary"
            className="mt-12"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
