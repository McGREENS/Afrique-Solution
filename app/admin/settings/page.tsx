"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { User, Lock, Save } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/admin/current-user");
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched user:", data);
        setCurrentUser(data.user);
        setProfileData({
          name: data.user.name || "",
          email: data.user.email || ""
        });
      } else {
        console.error("Failed to fetch user:", res.status);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`/api/admin/users?id=${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        fetchCurrentUser();
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to update profile" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setSavingPassword(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      setSavingPassword(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to change password" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setSavingPassword(false);
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

  return (
    <AdminLayout>
      <style jsx>{`
        .header {
          margin-bottom: 24px;
        }

        @media (min-width: 640px) {
          .header {
            margin-bottom: 32px;
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

        .settings-grid {
          display: grid;
          gap: 20px;
          max-width: 800px;
        }

        @media (min-width: 640px) {
          .settings-grid {
            gap: 24px;
          }
        }

        .settings-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #11111a;
          box-shadow: 0 4px 0 #11111a;
          padding: 20px;
        }

        @media (min-width: 640px) {
          .settings-card {
            border-radius: 20px;
            padding: 28px;
          }
        }

        @media (min-width: 1024px) {
          .settings-card {
            border-radius: 24px;
            padding: 32px;
          }
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e5e5;
        }

        @media (min-width: 640px) {
          .card-header {
            gap: 12px;
            margin-bottom: 24px;
            padding-bottom: 20px;
          }
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #11111a;
        }

        @media (min-width: 640px) {
          .card-title {
            font-size: 20px;
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

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 16px;
          border: 2px solid #11111a;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 3px 0 #11111a;
          background: #b4f75f;
          color: #11111a;
          width: 100%;
        }

        @media (min-width: 640px) {
          .btn {
            gap: 8px;
            padding: 12px 20px;
            font-size: 15px;
            width: auto;
          }
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 0 #11111a;
        }

        .btn:active:not(:disabled) {
          transform: translateY(1px);
          box-shadow: 0 2px 0 #11111a;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .message {
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 16px;
        }

        @media (min-width: 640px) {
          .message {
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 14px;
            margin-bottom: 20px;
          }
        }

        .message.success {
          background: #d4f4dd;
          color: #0f5132;
          border: 1px solid #a3cfbb;
        }

        .message.error {
          background: #fee;
          color: #c33;
          border: 1px solid #fcc;
        }
      `}</style>

      <div className="header">
        <h2 className="section-header">Settings</h2>
      </div>

      {message.text && (
        <div className={`message ${message.type}`} style={{ maxWidth: "800px", marginBottom: "20px" }}>
          {message.text}
        </div>
      )}

      <div className="settings-grid">
        {/* Profile Settings */}
        <div className="settings-card">
          <div className="card-header">
            <User size={22} color="#11111a" />
            <h3 className="card-title">Profile Information</h3>
          </div>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn" disabled={savingProfile}>
              <Save size={18} />
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Password Settings */}
        <div className="settings-card">
          <div className="card-header">
            <Lock size={22} color="#11111a" />
            <h3 className="card-title">Change Password</h3>
          </div>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn" disabled={savingPassword}>
              <Lock size={18} />
              {savingPassword ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
