import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  return (
    <span
  className={`
    relative inline-block
    select-none
    text-zinc-900 dark:text-zinc-400
    ${className}
  `}
>
  {/* brilho */}
  {!disabled && (
    <span
      aria-hidden
      className="absolute inset-0 bg-clip-text text-transparent animate-shine pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(
            120deg,
            rgba(255,255,255,0) 40%,
            rgba(255,255,255,1) 50%,
            rgba(255,255,255,0) 60%
          )
        `,
        backgroundSize: "200% 100%",
        animationDuration: `${speed}s`,
        WebkitBackgroundClip: "text",
      }}
    >
      {text}
    </span>
  )}

  {/* texto base */}
  <span>{text}</span>
</span>
  );
};

export default ShinyText;
