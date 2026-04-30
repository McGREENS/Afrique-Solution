"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { 
  MessageCircle, 
  Users, 
  Eye, 
  TrendingUp
} from "lucide-react";

interface Stats {
  totalMessages: number;
  totalVisits: number;
  uniqueCustomers: number;
  todayMessages: number;
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
      title: "WhatsApp Messages",
      value: stats?.totalMessages || 0,
      icon: MessageCircle,
      bgColor: "#b4f75f",
      iconColor: "#11111a",
      textColor: "#11111a",
    },
    {
      title: "Website Visits",
      value: stats?.totalVisits || 0,
      icon: Eye,
      bgColor: "#f3f3f3",
      iconColor: "#11111a",
      textColor: "#11111a",
    },
    {
      title: "Unique Customers",
      value: stats?.uniqueCustomers || 0,
      icon: Users,
      bgColor: "#fef3c7",
      iconColor: "#92400e",
      textColor: "#92400e",
    },
    {
      title: "Today's Messages",
      value: stats?.todayMessages || 0,
      icon: TrendingUp,
      bgColor: "#dbeafe",
      iconColor: "#1e40af",
      textColor: "#1e40af",
    },
  ];

  return (
    <AdminLayout>
      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 32px;
        }

        @media (min-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 40px;
          }
        }

        @media (min-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            margin-bottom: 48px;
          }
        }

        .stat-card {
          border-radius: 24px;
          border: 1px solid #11111a;
          box-shadow: 0 4px 0 #11111a;
          padding: 20px;
          min-height: 140px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        @media (min-width: 640px) {
          .stat-card {
            border-radius: 28px;
            padding: 24px;
            min-height: 160px;
          }
        }

        @media (min-width: 1024px) {
          .stat-card {
            border-radius: 34px;
          }
        }

        .stat-value {
          font-size: 32px;
          font-weight: 500;
          margin-bottom: 8px;
          line-height: 1;
        }

        @media (min-width: 640px) {
          .stat-value {
            font-size: 36px;
          }
        }

        @media (min-width: 1024px) {
          .stat-value {
            font-size: 40px;
          }
        }

        .stat-title {
          font-size: 13px;
          font-weight: 500;
          line-height: 1.3;
        }

        @media (min-width: 640px) {
          .stat-title {
            font-size: 14px;
          }
        }

        .section-header {
          display: inline-block;
          border-radius: 6px;
          background: #b4f75f;
          padding: 4px 8px;
          font-size: 22px;
          font-weight: 500;
          color: #11111a;
          margin-bottom: 24px;
        }

        @media (min-width: 640px) {
          .section-header {
            font-size: 26px;
            margin-bottom: 28px;
          }
        }

        @media (min-width: 1024px) {
          .section-header {
            font-size: 28px;
            margin-bottom: 32px;
          }
        }

        .info-card {
          background: white;
          border-radius: 24px;
          border: 1px solid #11111a;
          box-shadow: 0 4px 0 #11111a;
          padding: 32px 24px;
          text-align: center;
        }

        @media (min-width: 640px) {
          .info-card {
            border-radius: 28px;
            padding: 36px 32px;
          }
        }

        @media (min-width: 1024px) {
          .info-card {
            border-radius: 34px;
            padding: 40px;
          }
        }

        .info-icon {
          opacity: 0.3;
          margin: 0 auto 16px;
        }

        .info-title {
          font-size: 20px;
          font-weight: 600;
          color: #11111a;
          margin-bottom: 12px;
        }

        @media (min-width: 640px) {
          .info-title {
            font-size: 22px;
          }
        }

        @media (min-width: 1024px) {
          .info-title {
            font-size: 24px;
          }
        }

        .info-text {
          font-size: 15px;
          color: #343438;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.5;
        }

        @media (min-width: 640px) {
          .info-text {
            font-size: 16px;
          }
        }

        .section-spacing {
          margin-top: 32px;
        }

        @media (min-width: 640px) {
          .section-spacing {
            margin-top: 40px;
          }
        }

        @media (min-width: 1024px) {
          .section-spacing {
            margin-top: 48px;
          }
        }
      `}</style>

      {/* Stats Grid */}
      <section>
        <h2 className="section-header">Analytics Overview</h2>
        
        <div className="stats-grid">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="stat-card"
              style={{ background: card.bgColor }}
            >
              <div style={{ marginBottom: "12px" }}>
                <card.icon size={28} color={card.iconColor} strokeWidth={1.5} />
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

      {/* Info Section */}
      <section className="section-spacing">
        <div className="info-card">
          <MessageCircle size={48} color="#11111a" className="info-icon" />
          <h3 className="info-title">
            Real-Time Analytics
          </h3>
          <p className="info-text">
            Track your WhatsApp bot engagement and website traffic in real-time. All metrics are automatically updated as customers interact with your services.
          </p>
        </div>
      </section>
    </AdminLayout>
  );
}
