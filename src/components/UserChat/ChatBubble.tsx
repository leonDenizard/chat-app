import { motion } from "framer-motion";

interface ChatBubbleProps {
  message: string;
  isMe: boolean;
  showAvatar: boolean;
  avatar?: string | null;
  translated?: string;
}

export default function ChatBubble({
  // message,
  isMe,
  showAvatar,
  avatar,
  translated
}: ChatBubbleProps) {
  const bubbleVariants = {
    hidden: {
      opacity: 0,
      y: 12,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      layout
      initial="hidden"
      animate="visible"
      variants={bubbleVariants}
      transition={{
        duration: 0.18,
        ease: "easeOut",
      }}
      className={`flex gap-2 my-1 ${isMe ? "justify-end" : "justify-start"}`}
    >
      {/* Avatar esquerda */}
      {!isMe && showAvatar && (
        <img
          src={avatar || "/av1.png"}
          alt=""
          className="w-8 h-8 rounded-md shrink-0 mt-1"
        />
      )}

      {!isMe && !showAvatar && <div className="w-8 shrink-0" />}

      {/* Bubble */}
      {/* <div
        className={`relative p-2 max-w-[80%] lg:max-w-[40%] xl:max-w-[35%] break-all ${
          isMe
            ? "bg-violet-500 text-white rounded px-3"
            : "bg-zinc-700 text-white rounded px-3"
        } ${showAvatar ? (isMe ? "bubble-right" : "bubble-left") : ""}`}
      >
        {message}
      </div> */}

      <div
        className={`relative p-2 max-w-[80%] lg:max-w-[40%] xl:max-w-[35%] break-all ${
          isMe
            ? "bg-violet-500 text-white rounded px-3"
            : "bg-zinc-700 text-white rounded px-3"
        } ${showAvatar ? (isMe ? "bubble-right" : "bubble-left") : ""}`}
      >
        {translated}
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
