import Link from "next/link";

export function Logo({
  size = 1,
  light = false,
  showTag = false,
}: {
  size?: number;
  light?: boolean;
  showTag?: boolean;
}) {
  const s = 44 * size;
  const strokeColor = light ? "#fbf9f5" : "#1c1915";
  const veinColor = light ? "#1c2018" : "#fbf9f5";

  return (
    <Link href="/" className="flex items-center" style={{ gap: 14 * size }}>
      <svg
        width={s}
        height={s}
        viewBox="0 0 44 44"
        className="shrink-0"
        aria-label="Пропочву"
      >
        {/* Arch — буква П */}
        <path
          d="M7 37 L 7 10 L 37 10 L 37 37"
          stroke={strokeColor}
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="square"
        />
        {/* Leaf inside the arch */}
        <path
          d="M22 16 C 29 19, 30 26, 22 33 C 15 26, 15 19, 22 16 Z"
          fill="#5a6b3a"
        />
        <path d="M22 16 L 22 33" stroke={veinColor} strokeWidth="0.9" />
      </svg>
      <div className="leading-none">
        <div
          className="font-serif font-medium"
          style={{
            fontSize: 26 * size,
            letterSpacing: "-0.025em",
            color: strokeColor,
          }}
        >
          Пропочву
        </div>
        {showTag && (
          <div
            className="font-sans font-normal"
            style={{
              fontSize: 10 * size,
              letterSpacing: "0.04em",
              color: light ? "rgba(255,255,255,0.55)" : "#8a8275",
              marginTop: 5,
            }}
          >
            маркетплейс для&nbsp;растений
          </div>
        )}
      </div>
    </Link>
  );
}
