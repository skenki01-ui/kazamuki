const themes = [
  {
    id: "free",
    icon: "🍃",
    title: "おまかせ",
    text: "今日の風向きを見る",
  },
  {
    id: "love",
    icon: "💕",
    title: "恋愛",
    text: "恋の流れを見る",
  },
  {
    id: "work",
    icon: "💼",
    title: "仕事",
    text: "仕事の流れを見る",
  },
  {
    id: "relation",
    icon: "🤝",
    title: "人間関係",
    text: "人との縁を見る",
  },
  {
    id: "money",
    icon: "💰",
    title: "お金",
    text: "金運を見る",
  },
  {
    id: "self",
    icon: "🌱",
    title: "自分自身",
    text: "心の流れを見る",
  },
];

export default function Theme({ onBack, onSelect }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#111b33 0%,#07111f 100%)",
        color: "#f8f4e6",
        padding: 24,
      }}
    >
      <button
        onClick={onBack}
        style={{
          marginBottom: 20,
          background: "transparent",
          color: "#f8f4e6",
          border: "1px solid rgba(255,255,255,.2)",
          borderRadius: 999,
          padding: "10px 16px",
          cursor: "pointer",
        }}
      >
        ← 戻る
      </button>

      <div
        style={{
          maxWidth: 420,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            lineHeight: 1.6,
            marginBottom: 30,
          }}
        >
          今日は何について
          <br />
          カードを引きますか？
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onSelect(theme)}
              style={{
                border: "1px solid rgba(255,255,255,.15)",
                borderRadius: 18,
                background: "rgba(255,255,255,.05)",
                color: "#f8f4e6",
                padding: 20,
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 34 }}>
                {theme.icon}
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                {theme.title}
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  opacity: .7,
                  lineHeight: 1.6,
                }}
              >
                {theme.text}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}