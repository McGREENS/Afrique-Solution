"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Search, RefreshCw, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, Clock, AlertCircle, Copy, Check,
} from "lucide-react";

interface Order {
  id:                    string;
  subscriber_id:         string;
  service_id:            string;
  service_name:          string;
  service_provider:      string;
  country_id:            string | null;
  amount_usd:            number;
  payer_phone:           string;
  recipient_detail:      string | null;
  status:                string;
  created_at:            string;
  transaction_reference: string | null;
}

interface OrdersResponse {
  orders: Order[];
  total:  number;
  page:   number;
  limit:  number;
  pages:  number;
}

const CARD_BG  = "#161a2a";
const BORDER   = "rgba(255,255,255,0.07)";
const MUTED    = "rgba(255,255,255,0.35)";
const TEXT     = "#fff";
const ACCENT   = "#b4f75f";
const DARK_BG  = "#0d1018";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  COMPLETED: { label: "Complété",  color: "#86efac", bg: "rgba(134,239,172,0.12)", icon: CheckCircle },
  FAILED:    { label: "Échoué",    color: "#f87171", bg: "rgba(248,113,113,0.12)", icon: XCircle     },
  CANCELLED: { label: "Annulé",    color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  icon: AlertCircle },
  PENDING:   { label: "En attente",color: "#94a3b8", bg: "rgba(148,163,184,0.12)", icon: Clock       },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status.toUpperCase()] ?? STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: cfg.bg, color: cfg.color,
      borderRadius: "999px", padding: "3px 10px",
      fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap",
    }}>
      <Icon size={12} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={copy}
      title="Copier"
      style={{
        background: "none", border: "none", cursor: "pointer",
        padding: "2px", color: copied ? ACCENT : "rgba(255,255,255,0.25)",
        display: "inline-flex", alignItems: "center",
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

function formatDate(str: string) {
  try {
    const d = new Date(str);
    return d.toLocaleString("fr-FR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return str;
  }
}

function shortId(id: string) {
  return id.length > 16 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id;
}

export default function PaymentsPage() {
  const [data,    setData]    = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState("");
  const [inputVal, setInputVal] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (p: number, q: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" });
      if (q) params.set("search", q);
      const res = await fetch(`/api/admin/orders?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) {
      setError("Impossible de charger les paiements.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page, search); }, [load, page, search]);

  // Debounced search input
  function handleSearchInput(val: string) {
    setInputVal(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
  }

  const orders = data?.orders ?? [];
  const total  = data?.total  ?? 0;
  const pages  = data?.pages  ?? 1;

  return (
    <div style={{ background: DARK_BG, minHeight: "100%", color: TEXT }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: TEXT, marginBottom: "4px" }}>Paiements</h1>
          <p style={{ fontSize: "13px", color: MUTED }}>
            {loading ? "Chargement…" : `${total.toLocaleString("fr-FR")} transaction${total !== 1 ? "s" : ""} au total`}
          </p>
        </div>
        <button
          onClick={() => load(page, search)}
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`,
            borderRadius: "10px", padding: "8px 14px",
            fontSize: "13px", color: loading ? MUTED : TEXT,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          <RefreshCw size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          Actualiser
        </button>
      </div>

      {/* Search bar */}
      <div style={{
        position: "relative", marginBottom: "16px",
      }}>
        <Search size={15} style={{
          position: "absolute", left: "14px", top: "50%",
          transform: "translateY(-50%)", color: MUTED, pointerEvents: "none",
        }} />
        <input
          type="text"
          placeholder="Rechercher par ID, téléphone, service, statut…"
          value={inputVal}
          onChange={(e) => handleSearchInput(e.target.value)}
          style={{
            width: "100%", padding: "10px 14px 10px 40px",
            background: CARD_BG, border: `1px solid ${BORDER}`,
            borderRadius: "12px", fontSize: "14px",
            color: TEXT, outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {error && (
        <div style={{
          background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: "14px", padding: "14px 18px", marginBottom: "16px",
          fontSize: "14px", color: "#fca5a5",
        }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div style={{
        background: CARD_BG, border: `1px solid ${BORDER}`,
        borderRadius: "20px", overflow: "hidden",
      }}>

        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 120px 120px 110px 110px 140px",
          padding: "12px 20px",
          borderBottom: `1px solid ${BORDER}`,
          gap: "12px",
        }}
          className="payments-header"
        >
          {["ID / Service", "Téléphone", "Montant", "Statut", "Pays", "Date"].map((h) => (
            <span key={h} style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: MUTED }}>
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {loading && orders.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: MUTED, fontSize: "14px" }}>
            Chargement…
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: MUTED, fontSize: "14px" }}>
            {search ? "Aucun résultat pour cette recherche." : "Aucun paiement enregistré."}
          </div>
        ) : (
          orders.map((order) => {
            const isOpen = expanded === order.id;
            return (
              <div key={order.id}>
                {/* Main row */}
                <div
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 120px 120px 110px 110px 140px",
                    padding: "14px 20px",
                    gap: "12px",
                    borderBottom: `1px solid ${BORDER}`,
                    cursor: "pointer",
                    background: isOpen ? "rgba(255,255,255,0.03)" : "transparent",
                    transition: "background 120ms",
                    alignItems: "center",
                  }}
                  className="payments-row"
                >
                  {/* ID / Service */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "12px", fontFamily: "monospace", color: "rgba(255,255,255,0.5)" }}>
                        {shortId(order.id)}
                      </span>
                      <CopyButton text={order.id} />
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: TEXT }}>
                      {order.service_name}
                    </span>
                    <span style={{ fontSize: "12px", color: MUTED, marginLeft: "6px" }}>
                      {order.service_provider}
                    </span>
                  </div>

                  {/* Phone */}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontSize: "13px", color: TEXT, fontFamily: "monospace" }}>
                      {order.payer_phone}
                    </span>
                  </div>

                  {/* Amount */}
                  <span style={{ fontSize: "14px", fontWeight: 700, color: ACCENT }}>
                    ${Number(order.amount_usd).toFixed(2)}
                  </span>

                  {/* Status */}
                  <StatusBadge status={order.status} />

                  {/* Country */}
                  <span style={{ fontSize: "13px", color: MUTED, textTransform: "uppercase" }}>
                    {order.country_id ?? "—"}
                  </span>

                  {/* Date */}
                  <span style={{ fontSize: "12px", color: MUTED }}>
                    {formatDate(order.created_at)}
                  </span>
                </div>

                {/* Expanded detail row */}
                {isOpen && (
                  <div style={{
                    background: "rgba(255,255,255,0.02)",
                    borderBottom: `1px solid ${BORDER}`,
                    padding: "16px 20px 20px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "16px",
                  }}>
                    {[
                      { label: "ID Transaction",   value: order.transaction_reference ?? order.id },
                      { label: "Abonné ID",         value: order.subscriber_id },
                      { label: "Service ID",        value: order.service_id },
                      { label: "Numéro décodeur",   value: order.recipient_detail ?? "—" },
                      { label: "Montant (USD)",     value: `$${Number(order.amount_usd).toFixed(2)}` },
                      { label: "Statut",            value: order.status },
                    ].map((field) => (
                      <div key={field.label}>
                        <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: "4px" }}>
                          {field.label}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <p style={{ fontSize: "13px", color: TEXT, fontFamily: field.label.includes("ID") ? "monospace" : "inherit", wordBreak: "break-all" }}>
                            {field.value}
                          </p>
                          {field.label.includes("ID") && field.value !== "—" && (
                            <CopyButton text={field.value} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 20px", borderTop: `1px solid ${BORDER}`,
            flexWrap: "wrap", gap: "12px",
          }}>
            <span style={{ fontSize: "13px", color: MUTED }}>
              Page {page} / {pages} — {total.toLocaleString("fr-FR")} résultats
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  padding: "6px 12px", borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`,
                  fontSize: "13px", color: page === 1 ? MUTED : TEXT,
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                <ChevronLeft size={14} /> Précédent
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages || loading}
                style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  padding: "6px 12px", borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`,
                  fontSize: "13px", color: page === pages ? MUTED : TEXT,
                  cursor: page === pages ? "not-allowed" : "pointer",
                }}
              >
                Suivant <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .payments-header { display: none !important; }
          .payments-row {
            grid-template-columns: 1fr 1fr !important;
            grid-template-rows: auto auto auto !important;
          }
        }
      `}</style>
    </div>
  );
}
