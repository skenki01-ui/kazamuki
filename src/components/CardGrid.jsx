import { tarotCards } from "../data/tarotCards";
import "./CardGrid.css";

const cardStyles = [
  { x: -8, y: 0, r: -5 },
  { x: -2, y: -5, r: 3 },
  { x: 4, y: 2, r: -2 },
  { x: 8, y: -3, r: 4 },
  { x: 2, y: 5, r: -1 },

  { x: -5, y: 3, r: 2 },
  { x: 1, y: -4, r: -4 },
  { x: 6, y: 1, r: 2 },
  { x: -4, y: 4, r: -3 },
  { x: 5, y: -2, r: 3 },

  { x: -7, y: 2, r: 4 },
  { x: 0, y: -2, r: -2 },
  { x: 7, y: 4, r: 5 },
  { x: -2, y: -4, r: -1 },
  { x: 4, y: 2, r: 2 },

  { x: -5, y: 1, r: -2 },
  { x: 1, y: 5, r: 4 },
  { x: 8, y: -1, r: -4 },
  { x: -3, y: 2, r: 3 },
  { x: 5, y: 3, r: -2 },

  { x: -2, y: 2, r: 2 },
  { x: 3, y: -2, r: -3 },
];

export default function CardGrid({ phase = "show" }) {
  const isBack = phase === "flip";

  return (
    <div className={`card-grid ${phase}`}>
      {tarotCards.map((card, index) => {
        const style = cardStyles[index] || { x: 0, y: 0, r: 0 };

        return (
          <div
            key={card.id}
            className={`tarot-mini-card ${isBack ? "is-back" : ""}`}
            style={{
              "--x": `${style.x}px`,
              "--y": `${style.y}px`,
              "--r": `${style.r}deg`,
              "--float-speed": `${2 + (index % 5) * 0.3}s`,
              "--spin-speed": `${1.4 + (index % 4) * 0.15}s`,
              "--delay": `${index * 0.035}s`,
            }}
          >
            {isBack ? (
              <div className="card-back-mark">🍃</div>
            ) : (
              <>
                <div className="card-symbol">{card.symbol}</div>
                <div className="card-name">{card.shortName}</div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}