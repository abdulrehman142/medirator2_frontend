interface Props {
  data: Record<string, unknown>;
}

function statusTone(status: string) {
  const s = status.toLowerCase();
  if (s.includes("maintenance") || s.includes("due") || s.includes("out")) {
    return "bg-amber-100 text-amber-900";
  }
  if (s.includes("critical") || s.includes("fault")) {
    return "bg-red-100 text-red-800";
  }
  return "bg-black/10 text-black";
}

export default function InstrumentPanel({ data }: Props) {
  const status = String(data.status ?? "Unknown");

  return (
    <div className="rounded-xl border border-black/10 bg-[#eaeae8] p-5 text-black">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
            Instrument
          </div>
          <h3 className="font-ibm-plex-mono mt-1 text-xl font-semibold text-black">
            {String(data.name ?? "Equipment")}
          </h3>
        </div>
        <span
          className={`rounded-md px-2.5 py-1 text-xs font-semibold ${statusTone(status)}`}
        >
          {status}
        </span>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">
            Department
          </div>
          <div className="mt-1 text-sm text-black">
            {String(data.department ?? "—")}
          </div>
        </div>
        <div>
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
