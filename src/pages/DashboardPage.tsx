import { useEffect } from "react";
import { useMetrics } from "../hooks/useVehicleStore";
import { useOnboarding } from "../hooks/useOnboarding";
import HealthMeter from "../components/HealthMeter";
import VehicleHealthPanel from "../components/VehicleHealthPanel";
import PredictionCard from "../components/PredictionCard";
import InsightCard from "../components/InsightCard";
import LiveSensorPanel from "../components/LiveSensorPanel";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/motionPresets";
import { Activity, Zap, AlertCircle } from "lucide-react";

function DashboardPage() {
  const { score, metrics, predictions, loadDashboard, loading } = useMetrics();
  const { data: onboardingData } = useOnboarding();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-8">
      {!onboardingData && (
        <motion.div
          {...fadeInUp}
          className="glass-panel flex items-center gap-4 rounded-2xl border border-warning/30 bg-warning/5 p-4 shadow-glow"
        >
          <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
          <div>
            <p className="font-semibold text-white">Vehicle not connected</p>
            <p className="text-sm text-slate-300">
              Complete onboarding first to see live vehicle health and predictions.
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent-200">Vehicle Health</p>
          <h1 className="text-3xl font-semibold text-white">
            {onboardingData ? `${onboardingData.vehicle} – Live posture` : "Live predictive posture"}
          </h1>
          <p className="text-sm text-slate-300">
            {onboardingData && (
              <>
                Role: <span className="text-accent-200">{onboardingData.role}</span> | Driving:{" "}
                <span className="text-accent-200">{onboardingData.drivingStyle}</span>
              </>
            )}
            {onboardingData && " | "}Signals blend into empathy-first guidance.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <span className="inline-flex items-center gap-2 rounded-full bg-panel px-3 py-1">
            <Activity className="h-4 w-4 text-glow" /> telematics stream
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-panel px-3 py-1">
            <Zap className="h-4 w-4 text-warning" /> inference ready
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <motion.div {...fadeInUp} className="glass-panel rounded-3xl border border-white/5 p-4">
          <HealthMeter score={score} label={"Health score"} />
        </motion.div>
        <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }} className="glass-panel rounded-3xl border border-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-200">Prediction timeline</p>
          <div className="mt-3 space-y-3">
            {predictions.map((prediction) => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
          </div>
        </motion.div>
      </div>

      <LiveSensorPanel />

      <InsightCard title="Subsystems" subtitle="Live status">
        {loading && <p className="text-sm text-slate-300">Calibrating telemetry...</p>}
        {!loading && <VehicleHealthPanel metrics={metrics} />}
      </InsightCard>
    </div>
  );
}

export default DashboardPage;
