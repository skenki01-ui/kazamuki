import { useEffect, useMemo, useRef, useState } from "react";
import { tarotCards } from "../data/tarotCards.js";

const PHASES = [
  "spread",
  "wind",
  "spin",
  "reverse",
  "collect",
  "stack",
  "shuffle",
  "roulette",
  "select",
  "result",
];

const AUTO_DURATIONS = {
  spread: 1800,
  wind: 1200,
  spin: 1600,
  reverse: 1100,
  collect: 1200,
  stack: 900,
  shuffle: 1800,
};

const HISOHISO_URL = "https://hisohiso.vercel.app/chat/free";

const windTitles = {
  spread: "22枚のカードを広げています",
  wind: "風向きが変わります…",
  spin: "風がカードの向きを決めています…",
  reverse: "すべてのカードが裏を向きます",
  collect: "風が中央へ集めています",
  stack: "山札が整いました",
  shuffle: "風が山札を混ぜています…",
  roulette: "風を止めてください",
  select: "一枚が残ります",
  result: "今日の風向き",
};

const windMessages = {
  spread: "占い師が机に並べたように、カードが静かに広がります。",
  wind: "今はまだ、どの一枚になるか分かりません。",
  spin: "正位置か逆位置か。風だけが知っています。",
  reverse: "表情を隠したカードたちが、静かに待っています。",
  collect: "一枚へ向かって、流れが集まっていきます。",
  stack: "カードは山札になり、風を待っています。",
  shuffle: "パラパラと、今日の流れが混ざります。",
  roulette: "画面をタップすると、風がゆっくり止まります。",
  select: "選ばれた一枚だけが残ります。",
  result: "風が今日の一枚を選びました。",
};

const windNames = [
  "追い風",
  "穏やかな風",
  "風待ち",
  "向かい風",
  "横風",
  "静かな風",
];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function buildResult(card, theme, isReversed) {
  const direction = isReversed ? "reversed" : "upright";
  const themeId = theme?.id || "free";

  const themeMessages =
    card.messages?.[themeId]?.[direction] ||
    card.messages?.free?.[direction] ||
    [];

  const message =
    pickRandom(themeMessages) || {
      title: "風が静かに告げています",
      body:
        "今日の風は、急がず今の流れを感じてみてもいいと告げています。",
      hint: "小さな違和感を無視せず、静かに整えてみてください。",
    };

  return {
    wind: pickRandom(windNames),
    cardId: card.id,
    cardName: card.nameJa,
    shortName: card.shortName,
    symbol: card.symbol,
    orientation: isReversed ? "逆位置" : "正位置",
    isReversed,
    theme:
      theme || {
        id: "free",
        title: "おまかせ",
        icon: "🍃",
      },
    title: message.title,
    body: message.body,
    hint: message.hint,
    createdAt: new Date().toISOString(),
  };
}

export default function CardAnimation({ theme, onComplete }) {
  const [phase, setPhase] = useState("spread");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [result, setResult] = useState(null);
  const [isStopping, setIsStopping] = useState(false);
  const completedRef = useRef(false);

  const isResult = phase === "result" && result;

  const cards = useMemo(() => {
    return tarotCards.map((card, index) => {
      const angle = -118 + index * (236 / (tarotCards.length - 1));
      const row = index % 2 === 0 ? -1 : 1;
      const randomTilt = ((index * 17) % 11) - 5;

      return {
        ...card,
        index,
        spreadX: Math.cos((angle * Math.PI) / 180) * 126,
        spreadY: Math.sin((angle * Math.PI) / 180) * 66 + row * 8,
        spreadRotate: angle / 7 + randomTilt,
        rouletteAngle: index * (360 / tarotCards.length),
      };
    });
  }, []);

  useEffect(() => {
    if (phase === "roulette" || phase === "select" || phase === "result") {
      return;
    }

    const timer = window.setTimeout(() => {
      const currentIndex = PHASES.indexOf(phase);
      setPhase(PHASES[currentIndex + 1]);
    }, AUTO_DURATIONS[phase]);

    return () => {
      window.clearTimeout(timer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "roulette" || isStopping) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 70);

    return () => {
      window.clearInterval(interval);
    };
  }, [phase, isStopping, cards.length]);

  function stopWind() {
    if (phase !== "roulette" || isStopping) {
      return;
    }

    setIsStopping(true);

    const chosenIndex = Math.floor(Math.random() * cards.length);
    const chosenCard = cards[chosenIndex];
    const reversed = Math.random() < 0.5;
    const finalResult = buildResult(chosenCard, theme, reversed);

    let count = 0;

    const slowInterval = window.setInterval(() => {
      count += 1;

      setActiveIndex((prev) => {
        if (count > 18) {
          window.clearInterval(slowInterval);
          setSelectedIndex(chosenIndex);
          setResult(finalResult);
          setPhase("select");

          window.setTimeout(() => {
            setPhase("result");
          }, 1200);

          window.setTimeout(() => {
            if (!completedRef.current) {
              completedRef.current = true;

              localStorage.setItem(
                "kazamuki_latest_result",
                JSON.stringify(finalResult)
              );

              if (onComplete) {
                onComplete(finalResult);
              }
            }
          }, 2400);

          return chosenIndex;
        }

        return (prev + 1) % cards.length;
      });
    }, 90 + count * 18);
  }

  function openHisohiso() {
    if (!result) return;

    const text = `かざむきの結果

テーマ：${result.theme?.title || "おまかせ"}
今日の風向き：${result.wind}
カード：${result.cardName}（${result.orientation}）

${result.title}

${result.body}

ヒント：
${result.hint}`;

    window.location.href = `${HISOHISO_URL}?from=kazamuki&intro=${encodeURIComponent(
      text
    )}`;
  }

  function getCardStyle(card) {
    const isSelected = selectedIndex === card.index;
    const isActive = activeIndex === card.index;

    if (phase === "spread") {
      return {
        transform: `translate(-50%, -50%) translate(${card.spreadX}px, ${card.spreadY}px) rotate(${card.spreadRotate}deg)`,
        zIndex: card.index,
      };
    }

    if (phase === "wind") {
      return {
        transform: `translate(-50%, -50%) translate(${
          card.spreadX + Math.sin(card.index) * 12
        }px, ${card.spreadY + Math.cos(card.index) * 8}px) rotate(${
          card.spreadRotate + 12
        }deg)`,
        zIndex: card.index,
      };
    }

    if (phase === "spin") {
      return {
        transform: `translate(-50%, -50%) translate(${
          card.spreadX * 0.92
        }px, ${card.spreadY * 0.92}px) rotate(${
          card.spreadRotate + 720
        }deg)`,
        zIndex: card.index,
      };
    }

    if (phase === "reverse") {
      return {
        transform: `translate(-50%, -50%) translate(${
          card.spreadX * 0.82
        }px, ${card.spreadY * 0.82}px) rotateY(180deg) rotate(${
          card.spreadRotate
        }deg)`,
        zIndex: card.index,
      };
    }

    if (phase === "collect") {
      return {
        transform: `translate(-50%, -50%) translate(${
          card.spreadX * 0.18
        }px, ${card.spreadY * 0.18}px) rotateY(180deg) rotate(${
          card.index * 2
        }deg)`,
        transitionDelay: `${card.index * 18}ms`,
        zIndex: card.index,
      };
    }

    if (phase === "stack") {
      return {
        transform: `translate(-50%, -50%) translate(${card.index % 3}px, ${
          (card.index - 11) * 0.7
        }px) rotateY(180deg) rotate(${(card.index - 11) * 0.6}deg)`,
        zIndex: card.index,
      };
    }

    if (phase === "shuffle") {
      const side = card.index % 2 === 0 ? -1 : 1;

      return {
        transform: `translate(-50%, -50%) translate(${side * 30}px, ${
          (card.index - 11) * 1.1
        }px) rotateY(180deg) rotate(${side * 8}deg)`,
        zIndex: card.index,
      };
    }

    if (phase === "roulette") {
      const radius = 92;
      const angle = card.rouletteAngle + activeIndex * 11;
      const x = Math.cos((angle * Math.PI) / 180) * radius;
      const y = Math.sin((angle * Math.PI) / 180) * radius;

      return {
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotateY(180deg) rotate(${
          angle + 90
        }deg) scale(${isActive ? 1.04 : 0.76})`,
        opacity: isActive ? 1 : 0.45,
        zIndex: isActive ? 80 : card.index,
      };
    }

    if (phase === "select") {
      return {
        transform: isSelected
          ? "translate(-50%, -50%) translateY(-8px) scale(1.14)"
          : `translate(-50%, -50%) translate(${
              (card.index - activeIndex) * 8
            }px, 58px) rotateY(180deg) scale(0.66)`,
        opacity: isSelected ? 1 : 0,
        zIndex: isSelected ? 100 : card.index,
      };
    }

    return {
      transform: isSelected
        ? "translate(-50%, -50%) translateY(-2px) scale(1.08)"
        : "translate(-50%, -50%) scale(0.6)",
      opacity: isSelected ? 1 : 0,
      zIndex: isSelected ? 100 : card.index,
    };
  }

  return (
    <section
      onClick={stopWind}
      style={{
        position: "relative",
        minHeight: "100vh",
        height: "100vh",
        padding: isResult ? "12px 16px 14px" : "18px 16px 16px",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: 430,
          margin: "0 auto",
          textAlign: "center",
          display: isResult ? "none" : "block",
        }}
      >
        <div style={{ fontSize: 26, lineHeight: 1 }}>🍃</div>

        <p
          style={{
            margin: "6px 0 0",
            fontSize: 11,
            color: "rgba(248,244,230,.72)",
          }}
        >
          {theme?.icon || "🍃"} {theme?.title || "おまかせ"}
        </p>

        <h2
          style={{
            margin: "8px 0 0",
            fontSize: 18,
            fontWeight: 400,
            lineHeight: 1.45,
            letterSpacing: ".07em",
          }}
        >
          {windTitles[phase]}
        </h2>

        <p
          style={{
            marginTop: 8,
            fontSize: 11,
            lineHeight: 1.6,
            color: "rgba(248,244,230,.62)",
          }}
        >
          {windMessages[phase]}
        </p>
      </div>

      <div
        style={{
          position: "relative",
          width: "min(100%, 430px)",
           height: isResult ? 116 : 332,

          margin: isResult ? "0 auto 6px" : "6px auto 0",

        }}

      >

        {cards.map((card) => {

          const showFront =

            phase === "spread" ||

            phase === "wind" ||

            phase === "spin" ||

            (phase === "result" && selectedIndex === card.index);

          const isSelectedResult =

            phase === "result" && selectedIndex === card.index;

          const shouldReverseCard =

            isSelectedResult && result?.isReversed;

          return (

            <div

              key={card.id}

              style={{

                position: "absolute",

                left: "50%",

                top: "50%",

                width: isSelectedResult ? 64 : 42,

                height: isSelectedResult ? 96 : 66,

                borderRadius: 12,

                transition:

                  "transform 920ms cubic-bezier(.18,.9,.24,1), opacity 720ms ease",

                ...getCardStyle(card),

              }}

            >

              <div

                style={{

                  width: "100%",

                  height: "100%",

                  borderRadius: 12,

                  display: "grid",

                  placeItems: "center",

                  textAlign: "center",

                  padding: isSelectedResult ? 7 : 5,

                  background: showFront

                    ? "radial-gradient(circle at top,#fff8d9 0%,#e7c77d 64%,#9a6b32 100%)"

                    : "linear-gradient(145deg,#24385d 0%,#13213d 58%,#090f1d 100%)",

                  border: showFront

                    ? "1px solid rgba(255,244,204,.45)"

                    : "1px solid rgba(248,244,230,.26)",

                  color: showFront ? "#2b2114" : "#f8f4e6",

                  boxShadow:

                    "0 10px 22px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.48)",

                  transform: shouldReverseCard

                    ? "rotate(180deg)"

                    : "rotate(0deg)",

                  transition: "transform 600ms ease",

                }}

              >

                {showFront ? (

                  <div>

                    <span

                      style={{

                        display: "block",

                        fontSize: isSelectedResult ? 22 : 15,

                      }}

                    >

                      {card.symbol}

                    </span>

                    <strong

                      style={{

                        display: "block",

                        fontSize: isSelectedResult ? 12 : 9,

                        lineHeight: 1.25,

                        letterSpacing: ".04em",

                      }}

                    >

                      {card.shortName}

                    </strong>

                  </div>

                ) : (

                  <span style={{ fontSize: 15 }}>🍃</span>

                )}

              </div>

            </div>

          );

        })}

      </div>

      {phase === "roulette" && (

        <div

          style={{

            position: "relative",

            zIndex: 6,

            width: "fit-content",

            margin: "-4px auto 0",

            padding: "10px 18px",

            borderRadius: 999,

            background: "rgba(248,244,230,.08)",

            border: "1px solid rgba(248,244,230,.18)",

            color: "rgba(248,244,230,.86)",

            fontSize: 12,

            letterSpacing: ".08em",

          }}

        >

          タップして、風を止める

        </div>

      )}

      {isResult && (

        <div

          style={{

            position: "relative",

            zIndex: 8,

            maxWidth: 430,

            height: "calc(100vh - 138px)",

            margin: "0 auto",

            padding: "11px 14px 13px",

            borderRadius: 22,

            background: "rgba(248,244,230,.9)",

            border: "1px solid rgba(128,92,40,.18)",

            textAlign: "center",

            color: "#2b2114",

            boxShadow: "0 18px 42px rgba(46,31,12,.16)",

            display: "flex",

            flexDirection: "column",

            justifyContent: "space-between",

          }}

        >

          <div>

            <p

              style={{

                margin: 0,

                fontSize: 10,

                letterSpacing: ".14em",

                color: "rgba(43,33,20,.58)",

              }}

            >

              🍃 今日の風向き

            </p>

            <h2

              style={{

                margin: "4px 0 2px",

                fontSize: 23,

                fontWeight: 400,

                letterSpacing: ".12em",

              }}

            >

              {result.wind}

            </h2>

            <p

              style={{

                margin: 0,

                fontSize: 12,

                color: "rgba(43,33,20,.66)",

              }}

            >

              {result.cardName}（{result.orientation}）

            </p>

          </div>

          <div>

            <h3

              style={{

                margin: "6px 0",

                fontSize: 18,

                fontWeight: 400,

                lineHeight: 1.42,

                letterSpacing: ".05em",

              }}

            >

              {result.title}

            </h3>

            <p

              style={{

                margin: 0,

                fontSize: 12,

                lineHeight: 1.55,

                color: "rgba(43,33,20,.76)",

              }}

            >

              {result.body}

            </p>

          </div>

          <div

            style={{

              padding: "8px 10px",

              borderRadius: 16,

              background: "rgba(255,255,255,.48)",

              border: "1px solid rgba(128,92,40,.12)",

            }}

          >

            <p

              style={{

                margin: "0 0 3px",

                fontSize: 10,

                letterSpacing: ".12em",

                color: "rgba(43,33,20,.54)",

              }}

            >

              風からのヒント

            </p>

            <p

              style={{

                margin: 0,

                fontSize: 12,

                lineHeight: 1.48,

                color: "rgba(43,33,20,.78)",

              }}

            >

              {result.hint}

            </p>

          </div>

          <button

            type="button"

            onClick={openHisohiso}

            style={{

              width: "100%",

              border: 0,

              borderRadius: 999,

              padding: "11px 14px",

              background: "linear-gradient(135deg,#7b3630,#b65648)",

              color: "#fff8df",

              fontSize: 13,

              letterSpacing: ".08em",

              cursor: "pointer",

              boxShadow: "0 12px 24px rgba(123,54,48,.22)",

            }}

          >

            このカードについて相談する

          </button>

        </div>

      )}

    </section>

  );

}         