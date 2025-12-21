import type { Client } from "../../types/client";

type ClientTileProps = {
  client: Client;
  onClick?: () => void;
};

export default function ClientTile({ client, onClick }: ClientTileProps) {
  return (
    <article
      key={client.cardId}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold leading-tight">
            {client.name}
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">{client.email}</p>
        </div>

        <span
          className={`inline-flex h-8 items-center rounded-full px-6 text-[11px] font-semibold border border-neutral-300 bg-white text-neutral-600`}
        >
          {client.borrows.length} borrow
          {client.borrows.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-3 space-y-2 text-xs text-neutral-600">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-neutral-400">{client.cardId}</span>
        </div>
      </div>
    </article>
  );
}
