"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { 
  CheckCircle, 
  Clock, 
  XCircle,
  Search,
  Download
} from "lucide-react";

interface Payment {
  id: string;
  user_id: string;
  product_id: string;
  status: string;
  decoder_number: string;
  payment_method: string;
  created_at: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/admin/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments);
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.decoder_number?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || payment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: payments.length,
    completed: payments.filter((p) => p.status === "COMPLETED").length,
    pending: payments.filter((p) => p.status === "SUBMITTED" || p.status === "ACCEPTED").length,
    failed: payments.filter((p) => p.status === "FAILED").length,
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

  return (
    <AdminLayout>
      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #11111a;
          box-shadow: 0 3px 0 #11111a;
          padding: 20px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #343438;
        }

        .filters {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 250px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 2px solid #11111a;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
        }

        .search-input:focus {
          border-color: #b4f75f;
          box-shadow: 0 0 0 3px rgba(180, 247, 95, 0.2);
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #11111a;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
        }

        .filter-btn {
          padding: 12px 20px;
          border: 2px solid #11111a;
          border-radius: 12px;
          background: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          background: #f3f3f3;
        }

        .filter-btn.active {
          background: #b4f75f;
          color: #11111a;
        }

        .payments-table {
          background: white;
          border-radius: 24px;
          border: 1px solid #11111a;
          box-shadow: 0 4px 0 #11111a;
          overflow: hidden;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table thead {
          background: #f3f3f3;
        }

        .table th {
          text-align: left;
          padding: 16px 20px;
          font-size: 14px;
          font-weight: 600;
          color: #11111a;
          border-bottom: 1px solid #11111a;
        }

        .table td {
          padding: 16px 20px;
          font-size: 14px;
          border-bottom: 1px solid #e5e5e5;
        }

        .table tbody tr:last-child td {
          border-bottom: none;
        }

        .table tbody tr:hover {
          background: #f9f9f9;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
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

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #343438;
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
      `}</style>

      <h2 className="section-header">Payments</h2>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: "#11111a" }}>{stats.total}</div>
          <div className="stat-label">Total Payments</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: "#10b981" }}>{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: "#f59e0b" }}>{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: "#ef4444" }}>{stats.failed}</div>
          <div className="stat-label">Failed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Order ID, Phone, or Decoder..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterStatus === "COMPLETED" ? "active" : ""}`}
            onClick={() => setFilterStatus("COMPLETED")}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${filterStatus === "SUBMITTED" ? "active" : ""}`}
            onClick={() => setFilterStatus("SUBMITTED")}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filterStatus === "FAILED" ? "active" : ""}`}
            onClick={() => setFilterStatus("FAILED")}
          >
            Failed
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="payments-table">
        {filteredPayments.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: "18px", marginBottom: "8px" }}>No payments found</p>
            <p style={{ fontSize: "14px" }}>
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Payments will appear here once customers complete transactions"}
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Phone</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td style={{ fontFamily: "monospace", fontSize: "13px" }}>
                    {payment.id.slice(0, 8)}...
                  </td>
                  <td style={{ fontWeight: 500 }}>{payment.user_id}</td>
                  <td style={{ color: "#343438" }}>{payment.product_id}</td>
                  <td style={{ fontFamily: "monospace", fontSize: "13px" }}>
                    {payment.amount} {payment.currency}
                  </td>
                  <td style={{ color: "#343438" }}>
                    {payment.payment_method || "Mobile Money"}
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${
                        payment.status === "COMPLETED"
                          ? "paid"
                          : payment.status === "SUBMITTED" || payment.status === "ACCEPTED"
                          ? "pending"
                          : "failed"
                      }`}
                    >
                      {payment.status === "COMPLETED" && <CheckCircle size={14} />}
                      {(payment.status === "SUBMITTED" || payment.status === "ACCEPTED") && <Clock size={14} />}
                      {payment.status === "FAILED" && <XCircle size={14} />}
                      {payment.status}
                    </span>
                  </td>
                  <td style={{ color: "#343438" }}>
                    {new Date(payment.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
