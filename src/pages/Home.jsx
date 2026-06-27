const messages = [
  "今日はどんな風が吹いているでしょう。",
  "静かな時間に、一枚だけめくってみませんか。",
  "答えではなく、小さなきっかけを探してみましょう。",
  "今の風向きを、そっと見てみましょう。",
  "焦らず、今日という一日を感じてみましょう。",
];

const message = messages[Math.floor(Math.random() * messages.length)];

export default function Home({ onStart }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#111b33 0%,#07111f 100%)",
        color: "#f8f4e6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
        <div style={{ fontSize: 54, marginBottom: 16 }}>🍃</div>

        <h1 style={{ fontSize: 42, margin: 0, letterSpacing: "0.2em" }}>
          かざむき
        </h1>

        <p style={{ marginTop: 20, lineHeight: 1.8, opacity: 0.9 }}>
          今の風向きを、
          <br />
          そっと見てみる。
        </p>

        <div
          style={{
            marginTop: 36,
            padding: 20,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,.15)",
            background: "rgba(255,255,255,.05)",
            lineHeight: 1.8,
          }}
        >
          {message}
        </div>

        <button
          onClick={onStart}
          style={{
            marginTop: 36,
            width: "100%",
            padding: "18px 20px",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            fontWeight: "bold",
            background: "#d4af37",
            color: "#111827",
          }}
        >
          カードを引く
        </button>

        <p style={{ marginTop: 24, fontSize: 12, opacity: 0.6, lineHeight: 1.8 }}>
          このカードは未来を決めるものではありません。
          <br />
          今日という一日を見つめるための、小さなヒントです。
        </p>
      </div>
    </div>
  );
}