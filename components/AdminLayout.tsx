"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  CreditCard,
  QrCode,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const res = await fetch("/api/admin/auth");
    if (!res.ok) {
      router.push("/admin/login");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      icon: CreditCard,
      label: "Payments",
      href: "/admin/payments",
    },
    {
      icon: QrCode,
      label: "WhatsApp QR",
      href: "/admin/whatsapp-qr",
    },
  ];

  return (
    <>
      <style jsx global>{`
        .admin-layout {
          min-height: 100vh;
          background: #f3f3f3;
          display: flex;
        }

        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          background: #11111a;
          z-index: 50;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .admin-sidebar.open {
          transform: translateX(0);
        }

        .admin-sidebar-logo {
          padding: 32px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        .admin-sidebar-logo h2 {
          font-size: 24px;
          font-weight: 600;
          color: white;
          margin: 0;
        }

        .admin-sidebar-logo p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin: 8px 0 0 0;
        }

        .admin-sidebar-nav {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
        }

        .admin-sidebar-nav::-webkit-scrollbar {
          width: 6px;
        }

        .admin-sidebar-nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .admin-sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .admin-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          margin-bottom: 8px;
          border-radius: 16px;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
          color: rgba(255, 255, 255, 0.8);
        }

        .admin-menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .admin-menu-item.active {
          background: #b4f75f;
          color: #11111a;
          box-shadow: 0 3px 0 rgba(180, 247, 95, 0.3);
        }

        .admin-sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        .admin-logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          width: 100%;
          border: none;
          border-radius: 16px;
          font-size: 15px;
          font-weight: 500;
          background: transparent;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-logout-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .admin-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 40;
          display: none;
        }

        .admin-overlay.show {
          display: block;
        }

        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .admin-header {
          background: white;
          border-bottom: 1px solid #11111a;
          box-shadow: 0 2px 0 #11111a;
          flex-shrink: 0;
        }

        .admin-header-content {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border: 1px solid #11111a;
          border-radius: 12px;
          background: #f3f3f3;
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-menu-toggle:hover {
          background: #e5e5e5;
        }

        .admin-content {
          flex: 1;
          padding: 40px 24px;
          overflow-y: auto;
        }

        @media (min-width: 1024px) {
          .admin-sidebar {
            position: sticky;
            top: 0;
            transform: translateX(0);
            height: 100vh;
          }

          .admin-menu-toggle {
            display: none;
          }

          .admin-overlay {
            display: none !important;
          }

          .admin-content {
            padding: 40px 48px;
          }
        }
      `}</style>

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="admin-sidebar-logo">
            <h2>Afrique Solution</h2>
            <p>Admin Panel</p>
          </div>

          <nav className="admin-sidebar-nav">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-menu-item ${
                  pathname === item.href ? "active" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={22} strokeWidth={2} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <button onClick={handleLogout} className="admin-logout-btn">
              <LogOut size={22} strokeWidth={2} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        <div
          className={`admin-overlay ${sidebarOpen ? "show" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="admin-main">
          <header className="admin-header">
            <div className="admin-header-content">
              <button
                className="admin-menu-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div>
                <h1 style={{ fontSize: "28px", fontWeight: 500, color: "#11111a", margin: 0 }}>
                  Admin <span style={{ display: "inline-block", borderRadius: "6px", background: "#b4f75f", padding: "4px 8px" }}>Dashboard</span>
                </h1>
                <p style={{ fontSize: "14px", color: "#343438", margin: "4px 0 0 0" }}>
                  Afrique Solution
                </p>
              </div>
            </div>
          </header>

          <main className="admin-content">{children}</main>
        </div>
      </div>
    </>
  );
}
