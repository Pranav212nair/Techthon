interface Props {
  score: number;
  label?: string;
  size?: number;
}

function HealthMeter({ score, label = "Health", size = 180 }: Props) {
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const gradientId = `grad-${label}`;

  return (
    <div className="glass-panel relative flex flex-col items-center justify-center rounded-3xl p-6 text-center">
      <svg width={size} height={size} className="drop-shadow-neon">
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#4ff3c0" />
            <stop offset="60%" stopColor="#40a0ff" />
            <stop offset="100%" stopColor="#6b9fff" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-white text-4xl font-bold"
        >
          {score}
        </text>
      </svg>
      <div className="mt-4 text-slate-300">
        <p className="text-lg font-semibold text-white">{label}</p>
        <p className="text-sm text-slate-400">Higher is better – updated live</p>
      </div>
    </div>
  );
}

export default HealthMeter;
