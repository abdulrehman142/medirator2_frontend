interface Props {
  data: Record<string, unknown>;
}

export default function MedicineCard({ data }: Props) {
  const contraindications = Array.isArray(data.contraindications)
    ? (data.contraindications as string[])
    : [];

  return (
    <div className="rounded-xl border border-black/10 bg-[#eaeae8] p-5 text-black">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        Medicine
      </div>
      <h3 className="font-ibm-plex-mono mt-1 text-2xl font-semibold text-black">
        {String(data.name ?? "Unknown")}
      </h3>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="font-semibold text-black/55">Usage</dt>
          <dd className="mt-0.5 text-black">{String(data.usage ?? "—")}</dd>
        </div>
        <div>
          <dt className="font-semibold text-black/55">Dosage</dt>
          <dd className="mt-0.5 text-black">{String(data.dosage ?? "—")}</dd>
        </div>
        <div>
          <dt className="font-semibold text-black/55">Contraindications</dt>
          <dd className="mt-1">
            {contraindications.length === 0 ? (
              <span className="text-black">—</span>
            ) : (
              <ul className="list-disc space-y-1 pl-5 text-black">
                {contraindications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}
