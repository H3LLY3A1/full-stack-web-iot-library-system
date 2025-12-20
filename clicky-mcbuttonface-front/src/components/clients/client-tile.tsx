import type { Client } from "../../types/client";

export default function ClientTile({ client }: { client: Client }) {
  return (
    <article
      key={client.id}
      className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold leading-tight">
            {client.name}
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">{client.email}</p>
        </div>
      </div>

      <div className="mt-3 space-y-2 text-xs text-neutral-600">
        <div className="flex items-center justify-between gap-2">
              <span className="truncate">
                Card ID:{" "}
                <span className="font-medium">{client.cardId ?? "—"}</span>
              </span>
          <span className="text-[11px] text-neutral-500">
            {client.borrows.length} borrow
            {client.borrows.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </article>
  );
}
