import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import ShinyText from "../ui/ShinyText";

interface ChatBubbleProps {
  message: string;
  isMe: boolean;
  showAvatar: boolean;
  avatar?: string | null;
  translated?: string;
  isTranslateEnabled?: boolean;
  isTranslating?: boolean;
}

export default function ChatBubble({
  message,
  isMe,
  showAvatar,
  avatar,
  translated,
  isTranslateEnabled,
  isTranslating,
}: ChatBubbleProps) {
  const bubbleVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  const showTranslation = isTranslateEnabled && translated;
  const localIsTranslating = isTranslateEnabled && !translated && isTranslating;

  return (
    <motion.div
      layout
      initial="hidden"
      animate="visible"
      variants={bubbleVariants}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`flex gap-2 my-1 ${isMe ? "justify-end" : "justify-start"}`}
    >
      {/* Avatar esquerda */}
      {!isMe && showAvatar && (
        <img
          width={32}
          height={32}
          src={avatar || "/av1.png"}
          alt=""
          className="w-8 h-8 rounded-md shrink-0 mt-1 bg-zinc-700 animate-pulse"
          loading="lazy"
          decoding="async"
        />
      )}

      {!isMe && !showAvatar && <div className="w-8 shrink-0" />}

      <div
        className={`flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}
      >
        {/* Bubble */}
        <div
          className={`
            relative p-2 break-all rounded px-3
            max-w-[90%] md:max-w-full
            ${isMe ? "bg-violet-500 text-white" : "bg-zinc-700 text-white"}
            ${showAvatar ? (isMe ? "bubble-right" : "bubble-left") : ""}
          `}
        >
          {showTranslation ? translated : message}
        </div>

        {localIsTranslating && (
          <div
            className={`
              flex items-center gap-2 text-xs italic opacity-70 select-none
              ${isMe ? "self-end text-right" : "self-start text-left"}
            `}
          >
            <ShinyText
              text="Calm your heart, we are translating..."
              disabled={false}
              speed={3}
              className="leading-none"
            />
            <Languages size={14} className="opacity-70 shrink-0" />
          </div>
        )}
      </div>

      {/* Avatar direita */}
      {isMe && showAvatar && (
        <img
          src={avatar || "/av1.png"}
          alt=""
          className="w-8 h-8 rounded-md shrink-0 mt-1"
        />
      )}

      {isMe && !showAvatar && <div className="w-8 shrink-0" />}
    </motion.div>
  );
}
