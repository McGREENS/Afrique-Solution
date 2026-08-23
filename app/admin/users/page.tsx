"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, ChevronLeft, ChevronRight, User, Phone } from "lucide-react";

interface Subscriber {
  id:         string;
  name:       string;
  phone:      string;
  created_at: string;
}

interface Response {
  subscribers: Subscriber[];
  total:       number;
  page:        number;
  pages:       number;
}

const CARD_BG = "#161a2a";
const BORDER  = "rgba(255,255,255,0.07)";
const MUTED   = "rgba(255,255,255,0.35)";
const TEXT    = "#fff";
const ACCENT  = "#b4f75f";
const DARK_BG = "#0d1018";

function formatDate(str: string) {
  try {
    return new Date(str).toLocaleString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return str; }
}

export default function UsersPage() {
  const [data,    setData]    = useState<Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [page,    setPage]    = useState(1);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/subscribers?page=${p}&limit=25`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) {
      setError("Impossible de charger les utilisateurs.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [load, page]);

  const subscribers = data?.subscribers ?? [];
  const total       = data?.total  ?? 0;
  const pages       = data?.pages  ?? 1;

  return (
    <div style={{ background: DARK_BG, minHeight: "100%", color: TEXT }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: TEXT, marginBottom: "4px" }}>Utilisateurs</h1>
          <p style={{ fontSize: "13px", color: MUTED }}>
            {loading ? "Chargement…" : `${total.toLocaleString("fr-FR")} utilisateur${total !== 1 ? "s" : ""} enregistré${total !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => load(page)}
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

      {error && (
        <div style={{
          background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: "14px", padding: "14px 18px", marginBottom: "16px",
          fontSize: "14px", color: "#fca5a5",
        }}>
          {error}
        </div>
      )}

      {/* Cards grid */}
      {loading && subscribers.length === 0 ? (
        <div style={{
          background: CARD_BG, border: `1px solid ${BORDER}`,
          borderRadius: "20px", padding: "48px", textAlign: "center",
          color: MUTED, fontSize: "14px",
        }}>
          Chargement…
        </div>
      ) : subscribers.length === 0 ? (
        <div style={{
          background: CARD_BG, border: `1px solid ${BORDER}`,
          borderRadius: "20px", padding: "48px", textAlign: "center",
          color: MUTED, fontSize: "14px",
        }}>
          Aucun utilisateur enregistré.
        </div>
      ) : (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "14px",
            marginBottom: "20px",
          }}>
            {subscribers.map((sub) => (
              <div
                key={sub.id}
                style={{
                  background: CARD_BG, border: `1px solid ${BORDER}`,
                  borderRadius: "16px", padding: "18px 20px",
                }}
              >
                {/* Avatar + name */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: `${ACCENT}20`, border: `1px solid ${ACCENT}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <User size={18} strokeWidth={1.8} color={ACCENT} />
                  </div>
                  <div style={{ overflow: "hidden" }}>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: TEXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {sub.name || "Utilisateur"}
                    </p>
                    <p style={{ fontSize: "11px", color: MUTED, fontFamily: "monospace", marginTop: "1px" }}>
                      {sub.id.slice(0, 16)}…
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <Phone size={13} strokeWidth={1.8} color={MUTED} />
                  <span style={{ fontSize: "13px", color: TEXT, fontFamily: "monospace" }}>
                    {sub.phone || "—"}
                  </span>
                </div>

                {/* Date */}
                <p style={{ fontSize: "11px", color: MUTED }}>
                  Enregistré le {formatDate(sub.created_at)}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 0", flexWrap: "wrap", gap: "12px",
            }}>
              <span style={{ fontSize: "13px", color: MUTED }}>
                Page {page} / {pages}
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
        </>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
