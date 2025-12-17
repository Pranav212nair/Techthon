import { clsx } from "clsx";

interface Props {
  confidence: number; // 0-1
}

function ConfidenceBadge({ confidence }: Props) {
  const pct = Math.round(confidence * 100);
  const tone = pct > 80 ? "bg-success/10 text-success" : pct > 60 ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger";
  return (
    <span className={clsx("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium", tone)}>
      <span className="h-2 w-2 rounded-full bg-current" />
      {pct}% confidence
    </span>
  );
}

export default ConfidenceBadge;
