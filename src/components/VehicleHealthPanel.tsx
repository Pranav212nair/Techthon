import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { HealthMetric } from "../types";
import ConfidenceBadge from "./ConfidenceBadge";

interface Props {
  metrics: HealthMetric[];
}

const trendIcon = (trend: HealthMetric["trend"]) => {
  if (trend === "up") return <ArrowUpRight className="h-4 w-4 text-success" />;
  if (trend === "down") return <ArrowDownRight className="h-4 w-4 text-warning" />;
  return <ArrowRight className="h-4 w-4 text-slate-300" />;
};

const riskColors: Record<HealthMetric["risk"], string> = {
  low: "text-success",
  medium: "text-warning",
  high: "text-danger",
};

function VehicleHealthPanel({ metrics }: Props) {
  return (
    <div className="card-grid">
      {metrics.map((metric) => (
        <div key={metric.name} className="glass-panel rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">{metric.name}</p>
              <p className="text-3xl font-bold text-white">{metric.score}</p>
            </div>
            <div className="flex items-center gap-2">
              {trendIcon(metric.trend)}
              <span className={`text-sm font-medium ${riskColors[metric.risk]}`}>{metric.risk}</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-300">{metric.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">Live telemetry</span>
            <ConfidenceBadge confidence={metric.risk === "high" ? 0.88 : 0.72} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default VehicleHealthPanel;
