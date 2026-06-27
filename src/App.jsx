import { useState } from "react";
import Home from "./pages/Home.jsx";
import Theme from "./pages/Theme.jsx";
import CardAnimation from "./components/CardAnimation.jsx";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [restartKey, setRestartKey] = useState(0);

  function goHome() {
    setScreen("home");
    setSelectedTheme(null);
    setRestartKey((prev) => prev + 1);
  }

  function goTheme() {
    setScreen("theme");
  }

  function startReading(theme) {
    setSelectedTheme(theme);
    setScreen("reading");
    setRestartKey((prev) => prev + 1);
  }

  function handleComplete() {
    // 結果表示は CardAnimation.jsx の中で完結
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background:
          "radial-gradient(circle at top,#fff6d8 0%,#ead08c 48%,#d3a94f 100%)",
      }}
    >
      {screen === "home" && <Home onStart={goTheme} />}

      {screen === "theme" && (
        <Theme onBack={goHome} onSelect={startReading} />
      )}

      {screen === "reading" && (
        <CardAnimation
          key={restartKey}
          theme={selectedTheme}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}