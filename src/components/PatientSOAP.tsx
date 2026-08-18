interface Props {
  data: Record<string, unknown>;
}

export default function PatientSOAP({ data }: Props) {
  const field = (key: string) => String(data[key] ?? "—");

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-[#eaeae8] text-black">
      <div className="border-b border-black/10 px-4 py-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-black">
          SOAP Note
        </h3>
      </div>
      <div className="grid gap-0 sm:grid-cols-2">
        {(
          [
            ["Subjective", "subjective"],
            ["Objective", "objective"],
            ["Assessment", "assessment"],
            ["Plan", "plan"],
          ] as const
        ).map(([label, key]) => (
          <div
            key={key}
            className="border-b border-black/10 px-4 py-4 sm:odd:border-r"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
              {label}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-black">{field(key)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
