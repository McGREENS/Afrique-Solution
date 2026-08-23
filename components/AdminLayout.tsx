"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",    href: "/admin/dashboard" },
  { icon: CreditCard,      label: "Paiements",    href: "/admin/payments"  },
  { icon: Users,           label: "Utilisateurs", href: "/admin/users"     },
  { icon: Settings,        label: "Paramètres",   href: "/admin/settings"  },
] as const;

const SIDEBAR_W      = 260;
const SIDEBAR_W_COLL = 72;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  const [checking,   setChecking]   = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed,  setCollapsed]  = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    // Skip auth check on the login page itself
    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }

    fetch("/api/admin/auth")
      .then((r) => {
        if (!r.ok) router.replace("/admin/login");
        else setChecking(false);
      })
      .catch(() => router.replace("/admin/login"));
  }, [pathname, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } finally {
      router.replace("/admin/login");
    }
  }, [router]);

  // ── While verifying session ──────────────────────────────────────────────────
  if (checking && pathname !== "/admin/login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1220]">
        <Loader2 size={28} className="animate-spin text-[#b4f75f]" />
      </div>
    );
  }

  // Login page renders without the shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const sidebarWidth = collapsed ? SIDEBAR_W_COLL : SIDEBAR_W;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0d1018", color: "#fff" }}>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            zIndex: 40, display: "none",
          }}
          className="lg-hide"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          position:        "fixed",
          top:             0,
          left:            0,
          bottom:          0,
          width:           `${sidebarWidth}px`,
          background:      "#11111a",
          borderRight:     "1px solid rgba(255,255,255,0.07)",
          display:         "flex",
          flexDirection:   "column",
          zIndex:          50,
          transition:      "width 200ms ease, transform 200ms ease",
          overflowX:       "hidden",
        }}
        className={`admin-sidebar${mobileOpen ? " sidebar-open" : ""}`}
      >
        {/* Logo */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding:        collapsed ? "20px 0" : "20px 20px 20px 24px",
          borderBottom:   "1px solid rgba(255,255,255,0.07)",
          minHeight:      "70px",
          gap:            "8px",
        }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
              <span style={{ color: "#b4f75f", fontSize: "20px", flexShrink: 0 }}>✦</span>
              <span style={{ fontSize: "15px", fontWeight: 600, whiteSpace: "nowrap", color: "#fff" }}>
                Afrique Solution
              </span>
            </div>
          )}
          {collapsed && (
            <span style={{ color: "#b4f75f", fontSize: "22px" }}>✦</span>
          )}
          {/* Collapse toggle — desktop only */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            style={{
              background:   "rgba(255,255,255,0.05)",
              border:       "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              padding:      "4px",
              cursor:       "pointer",
              color:        "rgba(255,255,255,0.4)",
              display:      "flex",
              flexShrink:   0,
            }}
            className="collapse-btn"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Section label */}
        {!collapsed && (
          <p style={{
            fontSize:       "10px",
            fontWeight:     600,
            letterSpacing:  "0.12em",
            textTransform:  "uppercase",
            color:          "rgba(255,255,255,0.25)",
            padding:        "20px 24px 8px",
          }}>
            Navigation
          </p>
        )}

        {/* Nav items */}
        <nav style={{ flex: 1, padding: collapsed ? "16px 0" : "0 12px", overflow: "hidden" }}>
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const active = pathname.startsWith(href);
            return (
              <a
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  gap:            "12px",
                  padding:        collapsed ? "10px 0" : "10px 14px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius:   "12px",
                  marginBottom:   "4px",
                  fontSize:       "14px",
                  fontWeight:     active ? 600 : 400,
                  color:          active ? "#0f1220" : "rgba(255,255,255,0.55)",
                  background:     active ? "#b4f75f" : "transparent",
                  textDecoration: "none",
                  transition:     "background 150ms, color 150ms",
                  whiteSpace:     "nowrap",
                  overflow:       "hidden",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} style={{ flexShrink: 0 }} />
                {!collapsed && label}
              </a>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{
          padding:      collapsed ? "16px 0" : "16px 12px",
          borderTop:    "1px solid rgba(255,255,255,0.07)",
        }}>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title={collapsed ? "Déconnexion" : undefined}
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            "12px",
              justifyContent: collapsed ? "center" : "flex-start",
              width:          "100%",
              padding:        collapsed ? "10px 0" : "10px 14px",
              borderRadius:   "12px",
              border:         "none",
              background:     "transparent",
              color:          "rgba(255,255,255,0.4)",
              fontSize:       "14px",
              cursor:         loggingOut ? "not-allowed" : "pointer",
              opacity:        loggingOut ? 0.5 : 1,
              whiteSpace:     "nowrap",
              overflow:       "hidden",
              transition:     "background 150ms, color 150ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)";
              (e.currentTarget as HTMLElement).style.color      = "rgb(252,165,165)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color      = "rgba(255,255,255,0.4)";
            }}
          >
            {loggingOut
              ? <Loader2 size={18} className="animate-spin" style={{ flexShrink: 0 }} />
              : <LogOut   size={18} strokeWidth={1.8}        style={{ flexShrink: 0 }} />
            }
            {!collapsed && (loggingOut ? "Déconnexion…" : "Déconnexion")}
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}
        className="admin-main"
      >
        {/* Top bar */}
        <header style={{
          height:           "64px",
          borderBottom:     "1px solid rgba(255,255,255,0.07)",
          background:       "#11111a",
          display:          "flex",
          alignItems:       "center",
          padding:          "0 24px",
          gap:              "16px",
          position:         "sticky",
          top:              0,
          zIndex:           30,
        }}>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="mobile-menu-btn"
            style={{
              background:   "rgba(255,255,255,0.05)",
              border:       "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding:      "7px",
              cursor:       "pointer",
              color:        "rgba(255,255,255,0.6)",
              display:      "none",
            }}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Page title */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px", fontWeight: 600, color: "#fff" }}>
              {NAV_ITEMS.find((n) => pathname.startsWith(n.href))?.label ?? "Admin"}
            </span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Admin badge */}
          <div style={{
            display:      "flex",
            alignItems:   "center",
            gap:          "8px",
            background:   "rgba(255,255,255,0.05)",
            border:       "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding:      "6px 12px",
          }}>
            <div style={{
              width:        "28px",
              height:       "28px",
              borderRadius: "50%",
              background:   "#b4f75f",
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              fontSize:     "12px",
              fontWeight:   700,
              color:        "#0f1220",
            }}>
              A
            </div>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
              Admin
            </span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "28px 28px", overflowY: "auto" }}>
          {children}
        </main>
      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        /* Desktop: sidebar always visible, push main content */
        @media (min-width: 1024px) {
          .admin-sidebar {
            transform: translateX(0) !important;
          }
          .admin-main {
            margin-left: ${sidebarWidth}px;
            transition: margin-left 200ms ease;
          }
          .mobile-menu-btn { display: none !important; }
          .collapse-btn    { display: flex !important; }
        }
        /* Mobile: sidebar off-canvas, hamburger visible */
        @media (max-width: 1023px) {
          .admin-sidebar {
            width: ${SIDEBAR_W}px !important;
            transform: translateX(-100%);
          }
          .admin-sidebar.sidebar-open {
            transform: translateX(0);
          }
          .admin-main    { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
          .collapse-btn    { display: none !important; }
          .lg-hide         { display: block !important; }
        }
      `}</style>
    </div>
  );
}
