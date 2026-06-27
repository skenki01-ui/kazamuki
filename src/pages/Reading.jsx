import CardAnimation from "../components/CardAnimation.jsx";

export default function Reading({ theme, onBack, onComplete }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #26385f 0%, #111b33 42%, #07111f 100%)",
        color: "#f8f4e6",
        overflow: "hidden",
      }}
    >
      <button
        onClick={onBack}
        style={{
          position: "fixed",
          top: 18,
          left: 18,
          zIndex: 20,
          background: "rgba(255,255,255,.06)",
          color: "#f8f4e6",
          border: "1px solid rgba(255,255,255,.22)",
          borderRadius: 999,
          padding: "10px 16px",
          cursor: "pointer",
        }}
      >
        ← 戻る
      </button>

      <CardAnimation theme={theme} onComplete={onComplete} />
    </div>
  );
}