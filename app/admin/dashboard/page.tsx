"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CreditCard, Users, TrendingUp, Clock,
  CheckCircle, XCircle, RefreshCw, ArrowUpRight,
} from "lucide-react";

interface Stats {
  total_orders:      number;
  completed_orders:  number;
  failed_orders:     number;
  pending_orders:    number;
  total_revenue:     number;
  today_orders:      number;
  today_revenue:     number;
  total_subscribers: number;
}

const CARD_BG   = "#161a2a";
const BORDER    = "rgba(255,255,255,0.07)";
const MUTED     = "rgba(255,255,255,0.35)";
const TEXT      = "#fff";
const ACCENT    = "#b4f75f";
const DARK_BG   = "#0d1018";

function StatCard({
  label, value, sub, icon: Icon, accent = false,
}: {
  label:   string;
  value:   string;
  sub?:    string;
  icon:    React.ElementType;
  accent?: boolean;
}) {
  return (
    <div style={{
      background:   CARD_BG,
      border:       `1px solid ${BORDER}`,
      borderRadius: "20px",
      padding:      "22px 24px",
      display:      "flex",
      flexDirection: "column",
      gap:          "14px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>
          {label}
        </p>
        <div style={{
          width: "34px", height: "34px", borderRadius: "10px",
          background: accent ? `${ACCENT}20` : "rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={16} strokeWidth={2} color={accent ? ACCENT : "rgba(255,255,255,0.4)"} />
        </div>
      </div>
      <div>
        <p style={{ fontSize: "30px", fontWeight: 700, color: accent ? ACCENT : TEXT, lineHeight: 1 }}>
          {value}
        </p>
        {sub && (
          <p style={{ fontSize: "12px", color: MUTED, marginTop: "4px" }}>{sub}</p>
        )}
      </div>
    </div>
  );
}

function StatusBar({ completed, failed, pending, total }: {
  completed: number; failed: number; pending: number; total: number;
}) {
  if (total === 0) return null;
  const cPct = (completed / total) * 100;
  const fPct = (failed    / total) * 100;
  const pPct = (pending   / total) * 100;
  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", height: "6px", borderRadius: "999px", overflow: "hidden", gap: "2px" }}>
        <div style={{ width: `${cPct}%`, background: ACCENT, borderRadius: "999px" }} />
        <div style={{ width: `${fPct}%`, background: "#f87171", borderRadius: "999px" }} />
        <div style={{ width: `${pPct}%`, background: "rgba(255,255,255,0.15)", borderRadius: "999px" }} />
      </div>
      <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
        {[
          { label: "Complétés", count: completed, color: ACCENT },
          { label: "Échoués",   count: failed,    color: "#f87171" },
          { label: "En attente", count: pending,  color: "rgba(255,255,255,0.35)" },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: "12px", color: MUTED }}>{s.label}</span>
            <span style={{ fontSize: "12px", fontWeight: 600, color: TEXT }}>{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStats(await res.json());
      setLastRefresh(new Date());
    } catch (e) {
      setError("Impossible de charger les statistiques.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const fmt = (n: number) => n.toLocaleString("fr-FR");
  const usd = (n: number) => `$${n.toFixed(2)}`;

  return (
    <div style={{ background: DARK_BG, minHeight: "100%", color: TEXT }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: TEXT, marginBottom: "4px" }}>Dashboard</h1>
          <p style={{ fontSize: "13px", color: MUTED }}>
            Vue d&apos;ensemble en temps réel.
            {lastRefresh && (
              <span> Mis à jour à {lastRefresh.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
            )}
          </p>
        </div>
        <button
          onClick={load}
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
          borderRadius: "14px", padding: "14px 18px", marginBottom: "24px",
          fontSize: "14px", color: "#fca5a5",
        }}>
          {error}
        </div>
      )}

      {/* Today banner */}
      <div style={{
        background: `linear-gradient(135deg, #1a2a0f 0%, #161a2a 100%)`,
        border: `1px solid ${ACCENT}30`,
        borderRadius: "20px", padding: "20px 24px",
        display: "flex", flexWrap: "wrap", gap: "24px",
        marginBottom: "20px",
      }}>
        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: `${ACCENT}90`, marginBottom: "6px" }}>
            Aujourd&apos;hui
          </p>
          <p style={{ fontSize: "28px", fontWeight: 700, color: ACCENT, lineHeight: 1 }}>
            {loading ? "…" : fmt(stats?.today_orders ?? 0)}
            <span style={{ fontSize: "14px", fontWeight: 400, color: `${ACCENT}80`, marginLeft: "6px" }}>paiements</span>
          </p>
        </div>
        <div style={{ width: "1px", background: `${ACCENT}20`, alignSelf: "stretch" }} />
        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: `${ACCENT}90`, marginBottom: "6px" }}>
            Revenu du jour
          </p>
          <p style={{ fontSize: "28px", fontWeight: 700, color: ACCENT, lineHeight: 1 }}>
            {loading ? "…" : usd(stats?.today_revenue ?? 0)}
          </p>
        </div>
      </div>

      {/* Stat cards grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "14px",
        marginBottom: "24px",
      }}>
        <StatCard label="Total paiements"  value={loading ? "…" : fmt(stats?.total_orders ?? 0)}      icon={CreditCard}   />
        <StatCard label="Revenu total"      value={loading ? "…" : usd(stats?.total_revenue ?? 0)}     icon={TrendingUp}   accent />
        <StatCard label="Abonnés"           value={loading ? "…" : fmt(stats?.total_subscribers ?? 0)} icon={Users}        />
        <StatCard label="En attente"        value={loading ? "…" : fmt(stats?.pending_orders ?? 0)}    icon={Clock}        />
        <StatCard label="Complétés"         value={loading ? "…" : fmt(stats?.completed_orders ?? 0)}  icon={CheckCircle}  accent />
        <StatCard label="Échoués"           value={loading ? "…" : fmt(stats?.failed_orders ?? 0)}     icon={XCircle}      />
      </div>

      {/* Status breakdown */}
      <div style={{
        background: CARD_BG, border: `1px solid ${BORDER}`,
        borderRadius: "20px", padding: "22px 24px", marginBottom: "24px",
      }}>
        <p style={{ fontSize: "13px", fontWeight: 600, color: TEXT, marginBottom: "4px" }}>
          Répartition des statuts
        </p>
        <p style={{ fontSize: "12px", color: MUTED, marginBottom: "12px" }}>
          Sur {fmt(stats?.total_orders ?? 0)} paiements au total
        </p>
        {!loading && stats && (
          <StatusBar
            completed={stats.completed_orders}
            failed={stats.failed_orders}
            pending={stats.pending_orders}
            total={stats.total_orders}
          />
        )}
        {loading && <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "999px" }} />}
      </div>

      {/* Quick link to payments */}
      <a
        href="/admin/payments"
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: CARD_BG, border: `1px solid ${BORDER}`,
          borderRadius: "16px", padding: "16px 20px",
          textDecoration: "none", color: TEXT,
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 500 }}>Voir tous les paiements</span>
        <ArrowUpRight size={16} color={ACCENT} />
      </a>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
