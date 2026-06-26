"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import fw26Data from "@/data/fw26.json";
import ss27Data from "@/data/ss27.json";

type Item = {
  brand: string;
  style: string;
  type: string;
  colorway: string;
  units: number;
  image: string;
};

type Season = { key: string; label: string; data: Item[] };

const SEASONS: Season[] = [
  { key: "fw26", label: "FW26", data: fw26Data as Item[] },
  { key: "ss27", label: "SS27", data: ss27Data as Item[] },
];

const TYPE_ORDER = ["All", "Outerwear", "Knitwear", "Shirts", "Trousers", "Accessories"];

export default function VisualPage() {
  const [seasonKey, setSeasonKey] = useState("fw26");
  const [typeFilter, setTypeFilter] = useState("All");
  const [brandFilter, setBrandFilter] = useState("All");

  const season = SEASONS.find((s) => s.key === seasonKey)!;
  const items = season.data;

  const brands = useMemo(() => {
    const set = new Set(items.map((i) => i.brand));
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        const matchType = typeFilter === "All" || i.type === typeFilter;
        const matchBrand = brandFilter === "All" || i.brand === brandFilter;
        return matchType && matchBrand;
      }),
    [items, typeFilter, brandFilter]
  );

  const totalStyles = useMemo(
    () => new Set(filtered.map((i) => `${i.brand}::${i.style}`)).size,
    [filtered]
  );
  const totalUnits = useMemo(() => filtered.reduce((s, i) => s + i.units, 0), [filtered]);
  const totalBrands = useMemo(() => new Set(filtered.map((i) => i.brand)).size, [filtered]);

  const groupedByBrand = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const item of filtered) {
      if (!map.has(item.brand)) map.set(item.brand, []);
      map.get(item.brand)!.push(item);
    }
    return map;
  }, [filtered]);

  const handleSeasonChange = (key: string) => {
    setSeasonKey(key);
    setTypeFilter("All");
    setBrandFilter("All");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#1c1917", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <header className="vb-header">
        <div className="vb-header-inner">
          <span className="vb-title">Fazenda</span>

          <div className="vb-season-toggle">
            {SEASONS.map((s) => (
              <button
                key={s.key}
                onClick={() => handleSeasonChange(s.key)}
                className={`vb-season-btn${seasonKey === s.key ? " active" : ""}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="vb-counts">
            <span><strong>{totalStyles}</strong> styles</span>
            <span><strong>{totalUnits}</strong> units</span>
            <span><strong>{totalBrands}</strong> brands</span>
          </div>
        </div>
      </header>

      {/* Filter rows */}
      <div className="vb-filters">
        <div className="vb-filters-inner">
          <div className="vb-pills">
            {TYPE_ORDER.filter((t) => t === "All" || items.some((i) => i.type === t)).map((opt) => (
              <button
                key={opt}
                onClick={() => setTypeFilter(opt)}
                className={`vb-pill${typeFilter === opt ? " active" : ""}`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="vb-pills">
            {brands.map((opt) => (
              <button
                key={opt}
                onClick={() => setBrandFilter(opt)}
                className={`vb-pill${brandFilter === opt ? " active" : ""}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Board */}
      <main className="vb-main">
        {groupedByBrand.size === 0 && (
          <p className="vb-empty">No items match the current filters.</p>
        )}
        {Array.from(groupedByBrand.entries()).map(([brand, brandItems]) => {
          const brandStyles = new Set(brandItems.map((i) => i.style)).size;
          const brandUnits = brandItems.reduce((s, i) => s + i.units, 0);
          return (
            <section key={brand}>
              <div className="vb-brand-heading">
                <h2 className="vb-brand-name">{brand}</h2>
                <span className="vb-brand-meta">
                  {brandStyles} {brandStyles === 1 ? "style" : "styles"} · {brandUnits} units
                </span>
              </div>
              <div className="vb-grid">
                {brandItems.map((item, idx) => (
                  <ProductCard key={idx} item={item} seasonKey={seasonKey} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

function ProductCard({ item, seasonKey }: { item: Item; seasonKey: string }) {
  const src = item.image ? `/buy/${seasonKey}/${item.image}.jpg` : null;
  const [imgError, setImgError] = useState(false);
  const showPlaceholder = !src || imgError;

  return (
    <div>
      <div className="vb-img-wrap">
        {showPlaceholder ? (
          <div className="vb-placeholder">
            <span>{item.type}</span>
          </div>
        ) : (
          <Image
            src={src!}
            alt={`${item.style} — ${item.colorway}`}
            fill
            style={{ objectFit: "cover" }}
            onError={() => setImgError(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        )}
      </div>
      <div className="vb-card-info">
        <p className="vb-card-style">{item.style}</p>
        <p className="vb-card-color">{item.colorway}</p>
        <p className="vb-card-units">{item.units} units</p>
      </div>
    </div>
  );
}
