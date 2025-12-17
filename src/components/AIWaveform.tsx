import { motion } from "framer-motion";
import { clsx } from "clsx";

interface Props {
  mood?: "calm" | "concern" | "urgent";
  className?: string;
}

const bars = Array.from({ length: 28 });

const moodToColor: Record<NonNullable<Props["mood"]>, string> = {
  calm: "from-accent-400 to-glow",
  concern: "from-warning to-accent-400",
  urgent: "from-danger to-warning",
};

function AIWaveform({ mood = "calm", className }: Props) {
  return (
    <div
      className={clsx(
        "relative flex h-24 items-center justify-center overflow-hidden rounded-2xl bg-panel/70 px-4",
        "border border-white/5 shadow-glow",
        className
      )}
    >
      <div className="absolute inset-0 opacity-60 blur-xl">
        <div
          className={clsx(
            "absolute inset-0 bg-gradient-to-r",
            moodToColor[mood] ?? "from-accent-500 to-glow"
          )}
        />
      </div>
      <div className="relative flex h-full w-full items-center gap-0.5">
        {bars.map((_, idx) => (
          <motion.span
            key={idx}
            className="w-[3px] rounded-full bg-white/80"
            animate={{
              height: ["20%", `${40 + Math.random() * 60}%`, `${30 + Math.random() * 50}%`],
              opacity: [0.7, 1, 0.85],
            }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
              repeat: Infinity,
              delay: idx * 0.02,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default AIWaveform;
