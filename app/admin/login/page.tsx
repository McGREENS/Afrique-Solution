"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background: "#f3f3f3" }}>
      <style jsx>{`
        .login-container {
          background: white;
          border-radius: 34px;
          border: 1px solid #11111a;
          box-shadow: 0 4px 0 #11111a;
          width: 100%;
          max-width: 420px;
          padding: 50px 40px;
        }
        
        .logo {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .logo h1 {
          font-size: 32px;
          font-weight: 600;
          color: #11111a;
          margin-bottom: 8px;
        }
        
        .logo p {
          font-size: 16px;
          color: #343438;
        }
        
        .form-group {
          margin-bottom: 24px;
        }
        
        .form-group label {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: #11111a;
          margin-bottom: 8px;
        }
        
        .form-group input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #11111a;
          border-radius: 16px;
          font-size: 15px;
          transition: all 0.3s;
          outline: none;
          background: #fafafa;
          color: #11111a;
        }
        
        .form-group input:focus {
          border-color: #b4f75f;
          box-shadow: 0 0 0 3px rgba(180, 247, 95, 0.2);
          background: white;
        }
        
        .password-wrapper {
          position: relative;
        }
        
        .toggle-password {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #11111a;
          font-size: 20px;
        }
        
        .login-button {
          width: 100%;
          padding: 16px;
          background: #b4f75f;
          color: #11111a;
          border: 2px solid #11111a;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 3px 0 #11111a;
        }
        
        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 0 #11111a;
        }
        
        .login-button:active {
          transform: translateY(1px);
          box-shadow: 0 2px 0 #11111a;
        }
        
        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid #11111a;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          margin-right: 8px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .error-message {
          background: #fee;
          color: #c33;
          padding: 12px;
          border-radius: 12px;
          font-size: 14px;
          margin-bottom: 20px;
          border: 1px solid #fcc;
        }
      `}</style>

      <div className="login-container">
        <div className="logo">
          <h1>Admin Portal</h1>
          <p>Afrique Solution</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              autoComplete="email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"}
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                autoComplete="current-password"
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
