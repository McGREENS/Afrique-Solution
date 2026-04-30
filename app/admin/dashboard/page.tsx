"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { 
  ShoppingCart, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle
} from "lucide-react";

interface Stats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  failedOrders: number;
  totalUsers: number;
}

interface Order {
  id: string;
  user_id: string;
  phone: string;
  product_id: string;
  status: string;
  decoder_number: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
          <div style={{ fontSize: "20px", fontWeight: 500, color: "#11111a" }}>Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      bgColor: "#f3f3f3",
      iconColor: "#11111a",
      textColor: "#11111a",
    },
    {
      title: "Completed",
      value: stats?.completedOrders || 0,
      icon: CheckCircle,
      bgColor: "#181b2b",
      iconColor: "#b4f75f",
      textColor: "#ffffff",
    },
    {
      title: "Pending",
      value: stats?.pendingOrders || 0,
      icon: Clock,
      bgColor: "#fef3c7",
      iconColor: "#92400e",
      textColor: "#92400e",
    },
    {
      title: "Failed",
      value: stats?.failedOrders || 0,
      icon: XCircle,
      bgColor: "#fee2e2",
      iconColor: "#991b1b",
      textColor: "#991b1b",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      bgColor: "#f3f3f3",
      iconColor: "#11111a",
      textColor: "#11111a",
    },
  ];

  return (
    <AdminLayout>
      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-bottom: 48px;
        }

        @media (min-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        .stat-card {
          border-radius: 34px;
          border: 1px solid #11111a;
          box-shadow: 0 4px 0 #11111a;
          padding: 24px;
          min-height: 160px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .stat-value {
          font-size: 40px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .stat-title {
          font-size: 14px;
          font-weight: 500;
        }

        .section-header {
          display: inline-block;
          border-radius: 6px;
          background: #b4f75f;
          padding: 4px 8px;
          font-size: 28px;
          font-weight: 500;
          color: #11111a;
          margin-bottom: 32px;
        }

        .orders-card {
          background: white;
          border-radius: 34px;
          border: 1px solid #11111a;
          box-shadow: 0 4px 0 #11111a;
          overflow: hidden;
        }

        .empty-state {
          text-align: center;
          padding: 80px 24px;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }

        .orders-table thead {
          background: #f3f3f3;
        }

        .orders-table th {
          text-align: left;
          padding: 16px 24px;
          font-size: 14px;
          font-weight: 600;
          color: #11111a;
          border-bottom: 1px solid #11111a;
        }

        .orders-table td {
          padding: 16px 24px;
          font-size: 14px;
          border-bottom: 1px solid #e5e5e5;
        }

        .orders-table tbody tr:last-child td {
          border-bottom: none;
        }

        .orders-table tbody tr:hover {
          background: #f9f9f9;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid;
        }

        .status-paid {
          background: #b4f75f;
          color: #11111a;
          border-color: #11111a;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
          border-color: #92400e;
        }

        .status-failed {
          background: #fee2e2;
          color: #991b1b;
          border-color: #991b1b;
        }
      `}</style>

      {/* Stats Grid */}
      <section>
        <h2 className="section-header">Overview</h2>
        
        <div className="stats-grid">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="stat-card"
              style={{ background: card.bgColor }}
            >
              <div style={{ marginBottom: "16px" }}>
                <card.icon size={32} color={card.iconColor} strokeWidth={1.5} />
              </div>
              <div>
                <div className="stat-value" style={{ color: card.textColor }}>
                  {card.value}
                </div>
                <div className="stat-title" style={{ color: card.textColor }}>
                  {card.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Orders */}
      <section>
        <h2 className="section-header">Recent Orders</h2>

        <div className="orders-card">
          {recentOrders.length === 0 ? (
            <div className="empty-state">
              <ShoppingCart size={48} color="#11111a" style={{ opacity: 0.3, margin: "0 auto 16px" }} />
              <p style={{ fontSize: "18px", color: "#343438", margin: 0 }}>No orders yet</p>
              <p style={{ fontSize: "14px", color: "#343438", marginTop: "8px" }}>
                Orders will appear here once customers start placing them
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Phone</th>
                    <th>Product</th>
                    <th>Decoder</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontFamily: "monospace", color: "#11111a" }}>
                        {order.id.slice(0, 8)}...
                      </td>
                      <td style={{ fontWeight: 500, color: "#11111a" }}>
                        {order.phone || order.user_id}
                      </td>
                      <td style={{ color: "#343438" }}>{order.product_id}</td>
                      <td style={{ fontFamily: "monospace", color: "#343438" }}>
                        {order.decoder_number || "-"}
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${
                            order.status === "paid"
                              ? "paid"
                              : order.status === "pending"
                              ? "pending"
                              : "failed"
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ color: "#343438" }}>
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}
