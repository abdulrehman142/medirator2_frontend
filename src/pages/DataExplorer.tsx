import { useEffect, useState } from "react";
import { getCategoryData } from "../api/api";

const TABS = ["patients", "medicines", "inventory"] as const;

export default function DataExplorer() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("patients");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setSelected(null);

    getCategoryData(tab, search.trim() || undefined)
      .then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setSelected(res.items[0] ?? null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load data");
        setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-ibm-plex-mono text-3xl font-semibold text-sea-deep">
        Data Explorer
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/65">
        Browse the synthetic JSON knowledge base used by keyword retrieval.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {TABS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setTab(name)}
            className={[
              "rounded-md px-3 py-1.5 text-sm font-medium capitalize transition",
              tab === name ? "bg-sea text-white" : "bg-white/70 text-ink/70 hover:bg-sand",
            ].join(" ")}
          >
            {name}
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search records…"
          className="ml-auto w-full max-w-xs rounded-md border border-sea/20 bg-white px-3 py-1.5 text-sm outline-none ring-sea/30 focus:ring-2 sm:w-56"
        />
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-critical/10 px-3 py-2 text-sm text-critical">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="max-h-[60vh] overflow-auto rounded-xl border border-sea/15 bg-white/70">
          {loading && <div className="p-4 text-sm text-ink/50">Loading…</div>}
          {!loading && items.length === 0 && (
            <div className="p-4 text-sm text-ink/50">No records found.</div>
          )}
          <ul>
            {items.map((item) => {
              const id = String(item.id ?? "");
              const label = String(
                item.name ?? item.item ?? item.id ?? "Record",
              );
              const active = selected?.id === item.id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => setSelected(item)}
                    className={[
                      "flex w-full flex-col items-start border-b border-sea/10 px-3 py-2.5 text-left text-sm transition",
                      active ? "bg-sea/10 text-sea-deep" : "hover:bg-mist",
                    ].join(" ")}
                  >
                    <span className="font-medium">{label}</span>
                    <span className="text-[11px] text-ink/45">{id}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <pre className="max-h-[60vh] overflow-auto rounded-xl bg-ink p-4 text-xs leading-relaxed text-sand">
          {selected
            ? JSON.stringify(selected, null, 2)
            : "// Select a record to preview JSON"}
        </pre>
      </div>
    </div>
  );
}
