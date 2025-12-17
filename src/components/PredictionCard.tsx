import { AlertTriangle, Clock, Gauge } from "lucide-react";
import { Prediction } from "../types";
import ConfidenceBadge from "./ConfidenceBadge";

interface Props {
  prediction: Prediction;
}

const severityTone: Record<Prediction["severity"], string> = {
  high: "border-danger/40 bg-danger/5",
  medium: "border-warning/40 bg-warning/5",
  low: "border-success/30 bg-success/5",
};

function PredictionCard({ prediction }: Props) {
  return (
    <div className={`rounded-2xl border px-4 py-3 shadow-glow ${severityTone[prediction.severity]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="mt-1 rounded-full bg-panel p-2 text-danger">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-300">Upcoming risk</p>
            <h4 className="text-lg font-semibold text-white">{prediction.component}</h4>
            <p className="text-sm text-slate-300">{prediction.action}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-200">
              <span className="inline-flex items-center gap-1 rounded-full bg-panel px-2 py-1">
                <Clock className="h-3 w-3" /> {prediction.etaKm} km / {prediction.etaDays} days
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-panel px-2 py-1">
                <Gauge className="h-3 w-3" /> Severity: {prediction.severity}
              </span>
              <ConfidenceBadge confidence={prediction.confidence} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictionCard;
