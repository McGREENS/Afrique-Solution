"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [checking,  setChecking]  = useState(true); // checking existing session
  const [error,     setError]     = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);

  const usernameRef = useRef<HTMLInputElement>(null);

  // Redirect immediately if already authenticated
  useEffect(() => {
    fetch("/api/admin/auth")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) {
          router.replace("/admin/dashboard");
        } else {
          setChecking(false);
          usernameRef.current?.focus();
        }
      })
      .catch(() => {
        setChecking(false);
        usernameRef.current?.focus();
      });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setAttemptsLeft(null);

    if (!username.trim()) {
      setError("Veuillez entrer votre nom d'utilisateur.");
      return;
    }
    if (!password) {
      setError("Veuillez entrer votre mot de passe.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.replace("/admin/dashboard");
        return;
      }

      if (res.status === 429) {
        setError("Trop de tentatives échouées. Réessayez dans 15 minutes.");
      } else if (res.status === 401) {
        setError(data.error ?? "Identifiants incorrects.");
        if (typeof data.attemptsLeft === "number") {
          setAttemptsLeft(data.attemptsLeft);
        }
        setPassword("");
      } else {
        setError("Une erreur est survenue. Réessayez.");
      }
    } catch {
      setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  // ── Loading / session check ──
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1220]">
        <Loader2 size={28} className="animate-spin text-[#b4f75f]" />
      </div>
    );
  }

  // ── Login form ──
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f1220] px-4">

      {/* Card */}
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <span className="text-[24px] leading-none text-[#b4f75f]">✦</span>
            <span className="text-[22px] font-medium tracking-tight text-white">
              Afrique Solution
            </span>
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] font-medium uppercase tracking-widest text-white/50">
            Admin Portal
          </span>
        </div>

        {/* Form card */}
        <div className="rounded-[28px] border border-white/10 bg-[#161a2a] p-8">
          <h1 className="mb-1 text-[22px] font-semibold text-white">
            Connexion
          </h1>
          <p className="mb-8 text-[14px] text-white/45">
            Accès réservé aux administrateurs.
          </p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Username */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="text-[13px] font-medium uppercase tracking-widest text-white/50"
              >
                Utilisateur
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <User size={16} strokeWidth={2} />
                </span>
                <input
                  ref={usernameRef}
                  id="username"
                  type="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(null); }}
                  disabled={loading}
                  placeholder="admin"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-[15px] text-white placeholder-white/20 outline-none transition focus:border-[#b4f75f]/60 focus:ring-2 focus:ring-[#b4f75f]/20 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-[13px] font-medium uppercase tracking-widest text-white/50"
              >
                Mot de passe
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <Lock size={16} strokeWidth={2} />
                </span>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  disabled={loading}
                  placeholder="••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-12 text-[15px] text-white placeholder-white/20 outline-none transition focus:border-[#b4f75f]/60 focus:ring-2 focus:ring-[#b4f75f]/20 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-white/30 transition hover:text-white/60"
                  aria-label={showPass ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <AlertCircle size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-red-400" />
                <div>
                  <p className="text-[14px] text-red-300">{error}</p>
                  {attemptsLeft !== null && attemptsLeft > 0 && (
                    <p className="mt-0.5 text-[12px] text-red-400/70">
                      {attemptsLeft} tentative{attemptsLeft > 1 ? "s" : ""} restante{attemptsLeft > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#b4f75f] text-[15px] font-semibold text-[#0f1220] transition hover:bg-[#c6ff6e] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Connexion…
                </>
              ) : (
                "Se connecter"
              )}
            </button>

          </form>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-[12px] text-white/20">
          © {new Date().getFullYear()} Afri Sol – La Divinité LTD
        </p>
      </div>
    </div>
  );
}
