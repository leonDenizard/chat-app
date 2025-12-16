import { useEffect, useRef, useState } from "react";

export default function UnreadBadge({ count }: { count: number }) {
  const prev = useRef(count);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (count > prev.current) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 350);
      return () => clearTimeout(t);
    }
    prev.current = count;
  }, [count]);

  if (count <= 0) return null;

  return (
    <span
      className={`
        absolute right-4 text-sm h-7 w-7 flex items-center justify-center font-semibold bg-violet-300 dark:bg-zinc-700 text-violet-500 dark:text-violet-500 rounded-full
        ${shake ? "animate-shake" : ""}
      `}
    >
      {count}
    </span>
  );
}
