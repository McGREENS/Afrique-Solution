"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { 
  Plus,
  Trash2,
  Edit,
  Users as UsersIcon
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingUser 
        ? `/api/admin/users?id=${editingUser.id}` 
        : "/api/admin/users";
      
      const res = await fetch(url, {
        method: editingUser ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({ email: "", name: "", password: "" });
        setShowForm(false);
        setEditingUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to save user:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      password: ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin user?")) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ email: "", name: "", password: "" });
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
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }

        @media (min-width: 640px) {
          .header {
            margin-bottom: 32px;
            gap: 16px;
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
        }

        @media (min-width: 640px) {
          .section-header {
            font-size: 26px;
          }
        }

        @media (min-width: 1024px) {
          .section-header {
            font-size: 28px;
          }
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border: 2px solid #11111a;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 3px 0 #11111a;
          width: 100%;
          justify-content: center;
        }

        @media (min-width: 640px) {
          .btn {
            gap: 8px;
            padding: 12px 20px;
            font-size: 15px;
            width: auto;
          }
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 0 #11111a;
        }

        .btn:active {
          transform: translateY(1px);
          box-shadow: 0 2px 0 #11111a;
        }

        .btn-primary {
          background: #b4f75f;
          color: #11111a;
        }

        .btn-secondary {
          background: white;
          color: #11111a;
        }

        .stats-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #11111a;
          box-shadow: 0 3px 0 #11111a;
          padding: 20px;
          margin-bottom: 24px;
        }

        @media (min-width: 640px) {
          .stats-card {
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 32px;
          }
        }

        .stat-value {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 4px;
          color: #11111a;
        }

        @media (min-width: 640px) {
          .stat-value {
            font-size: 32px;
          }
        }

        .stat-label {
          font-size: 13px;
          color: #343438;
        }

        @media (min-width: 640px) {
          .stat-label {
            font-size: 14px;
          }
        }

        .form-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .form-container {
          background: white;
          border-radius: 20px;
          border: 2px solid #11111a;
          box-shadow: 0 6px 0 #11111a;
          padding: 20px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        @media (min-width: 640px) {
          .form-container {
            border-radius: 24px;
            box-shadow: 0 8px 0 #11111a;
            padding: 32px;
          }
        }

        .form-title {
          font-size: 20px;
          font-weight: 600;
          color: #11111a;
          margin-bottom: 20px;
        }

        @media (min-width: 640px) {
          .form-title {
            font-size: 24px;
            margin-bottom: 24px;
          }
        }

        .form-group {
          margin-bottom: 16px;
        }

        @media (min-width: 640px) {
          .form-group {
            margin-bottom: 20px;
          }
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #11111a;
          margin-bottom: 6px;
        }

        @media (min-width: 640px) {
          .form-label {
            font-size: 14px;
            margin-bottom: 8px;
          }
        }

        .form-input {
          width: 100%;
          padding: 10px 14px;
          border: 2px solid #11111a;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
        }

        @media (min-width: 640px) {
          .form-input {
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 15px;
          }
        }

        .form-input:focus {
          border-color: #b4f75f;
          box-shadow: 0 0 0 3px rgba(180, 247, 95, 0.2);
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        @media (min-width: 640px) {
          .form-actions {
            gap: 12px;
            margin-top: 24px;
          }
        }

        .table-wrapper {
          background: white;
          border-radius: 16px;
          border: 1px solid #11111a;
          box-shadow: 0 4px 0 #11111a;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        @media (min-width: 640px) {
          .table-wrapper {
            border-radius: 20px;
          }
        }

        @media (min-width: 1024px) {
          .table-wrapper {
            border-radius: 24px;
          }
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }

        .table thead {
          background: #f3f3f3;
        }

        .table th {
          text-align: left;
          padding: 12px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #11111a;
          border-bottom: 1px solid #11111a;
          white-space: nowrap;
        }

        @media (min-width: 640px) {
          .table th {
            padding: 14px 18px;
            font-size: 14px;
          }
        }

        @media (min-width: 1024px) {
          .table th {
            padding: 16px 20px;
          }
        }

        .table td {
          padding: 12px 14px;
          font-size: 13px;
          border-bottom: 1px solid #e5e5e5;
        }

        @media (min-width: 640px) {
          .table td {
            padding: 14px 18px;
            font-size: 14px;
          }
        }

        @media (min-width: 1024px) {
          .table td {
            padding: 16px 20px;
          }
        }

        .table tbody tr:last-child td {
          border-bottom: none;
        }

        .table tbody tr:hover {
          background: #f9f9f9;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          display: inline-flex;
          align-items: center;
          margin-right: 6px;
          min-width: 32px;
          min-height: 32px;
          justify-content: center;
        }

        @media (min-width: 640px) {
          .action-btn {
            padding: 4px;
            margin-right: 8px;
            min-width: auto;
            min-height: auto;
          }
        }

        .action-btn:hover {
          opacity: 0.7;
        }

        .edit-btn {
          color: #11111a;
        }

        .delete-btn {
          color: #ef4444;
        }

        .empty-state {
          text-align: center;
          padding: 40px 16px;
          color: #343438;
        }

        @media (min-width: 640px) {
          .empty-state {
            padding: 60px 20px;
          }
        }

        .empty-state-title {
          font-size: 16px;
          margin-bottom: 8px;
        }

        @media (min-width: 640px) {
          .empty-state-title {
            font-size: 18px;
          }
        }

        .empty-state-text {
          font-size: 13px;
        }

        @media (min-width: 640px) {
          .empty-state-text {
            font-size: 14px;
          }
        }
      `}</style>

      <div className="header">
        <h2 className="section-header">Admin Users</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          Add Admin
        </button>
      </div>

      {/* Stats */}
      <div className="stats-card">
        <div className="stat-value">{users.length}</div>
        <div className="stat-label">Total Admin Users</div>
      </div>

      {/* Users Table */}
      <div className="table-wrapper">
        {users.length === 0 ? (
          <div className="empty-state">
            <UsersIcon size={48} color="#11111a" style={{ opacity: 0.3, margin: "0 auto 16px" }} />
            <p className="empty-state-title">No admin users yet</p>
            <p className="empty-state-text">
              Click "Add Admin" to create your first admin user
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 500 }}>{user.name}</td>
                  <td style={{ color: "#343438" }}>{user.email}</td>
                  <td style={{ color: "#343438" }}>
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(user)}
                      title="Edit user"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(user.id)}
                      title="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit User Form Modal */}
      {showForm && (
        <div className="form-modal" onClick={handleCancel}>
          <div className="form-container" onClick={(e) => e.stopPropagation()}>
            <h3 className="form-title">{editingUser ? "Edit Admin" : "Add Admin"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Password {editingUser && "(leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ flex: 1 }}
                >
                  {submitting ? "Saving..." : editingUser ? "Update" : "Add Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
