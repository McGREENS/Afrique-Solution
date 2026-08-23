export default function SettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>Paramètres</h1>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Configuration du portail admin.</p>
      </div>
      <div style={{ background: "#161a2a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "40px", textAlign: "center" }}>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)" }}>Les paramètres seront configurables ici.</p>
      </div>
    </div>
  );
}
