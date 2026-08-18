interface Props {
  data: Record<string, unknown>;
}

function statusTone(status: string) {
  const s = status.toLowerCase();
  if (s.includes("critical")) return "bg-red-100 text-red-800";
  if (s.includes("low")) return "bg-amber-100 text-amber-900";
  return "bg-black/10 text-black";
}

export default function InventoryPanel({ data }: Props) {
  const status = String(data.status ?? "Unknown");

  return (
    <div className="rounded-xl border border-black/10 bg-[#eaeae8] p-5 text-black">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
            Inventory
          </div>
          <h3 className="font-ibm-plex-mono mt-1 text-xl font-semibold text-black">
            {String(data.item ?? data.name ?? "Item")}
          </h3>
        </div>
        <span
          className={`rounded-md px-2.5 py-1 text-xs font-semibold ${statusTone(status)}`}
        >
          {status}
        </span>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">
            Quantity
          </div>
          <div className="mt-1 text-lg font-semibold text-black">
            {String(data.quantity ?? "—")}
          </div>
        </div>
        <div className="sm:col-span-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">
            Location
          </div>
          <div className="mt-1 text-sm text-black">
            {String(data.location ?? "—")}
          </div>
        </div>
      </div>
    </div>
  );
}
