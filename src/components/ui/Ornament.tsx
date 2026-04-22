export function Ornament({
  variant = "divider",
  color = "var(--color-accent)",
  className,
}: {
  variant?: "divider" | "corner" | "sprig";
  color?: string;
  className?: string;
}) {
  if (variant === "divider")
    return (
      <svg
        width="120"
        height="12"
        viewBox="0 0 120 12"
        className={className}
        aria-hidden
      >
        <line x1="0" y1="6" x2="48" y2="6" stroke={color} strokeWidth="0.8" />
        <circle cx="60" cy="6" r="3" fill="none" stroke={color} strokeWidth="0.8" />
        <circle cx="60" cy="6" r="1" fill={color} />
        <line x1="72" y1="6" x2="120" y2="6" stroke={color} strokeWidth="0.8" />
      </svg>
    );

  if (variant === "corner")
    return (
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        className={className}
        aria-hidden
      >
        <path
          d="M40 10 Q 50 40, 40 70 Q 30 40, 40 10 Z"
          fill={color}
          opacity="0.2"
        />
        <path
          d="M10 40 Q 40 50, 70 40 Q 40 30, 10 40 Z"
          fill={color}
          opacity="0.2"
        />
      </svg>
    );

  // sprig
  return (
    <svg
      width="50"
      height="120"
      viewBox="0 0 50 120"
      className={className}
      aria-hidden
    >
      <path d="M25 110 Q 25 80, 25 40" stroke={color} strokeWidth="1" fill="none" />
      <ellipse cx="15" cy="80" rx="8" ry="3" fill={color} opacity="0.7" transform="rotate(-30 15 80)" />
      <ellipse cx="35" cy="65" rx="8" ry="3" fill={color} opacity="0.7" transform="rotate(30 35 65)" />
      <ellipse cx="18" cy="50" rx="7" ry="2.5" fill={color} opacity="0.7" transform="rotate(-25 18 50)" />
      <ellipse cx="30" cy="35" rx="6" ry="2" fill={color} opacity="0.7" transform="rotate(35 30 35)" />
      <circle cx="25" cy="25" r="3" fill={color} />
    </svg>
  );
}
