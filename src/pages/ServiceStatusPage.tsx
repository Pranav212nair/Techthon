import { useEffect } from "react";
import { useServiceStatus } from "../hooks/useVehicleStore";
import StatusTimeline from "../components/StatusTimeline";
import InsightCard from "../components/InsightCard";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/motionPresets";
import { ClipboardCheck } from "lucide-react";

function ServiceStatusPage() {
  const { serviceTimeline, loadServiceStatus, loading } = useServiceStatus();

  useEffect(() => {
    loadServiceStatus();
  }, [loadServiceStatus]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-accent-200">Service Execution</p>
        <h1 className="text-3xl font-semibold text-white">Live repair timeline</h1>
        <p className="text-sm text-slate-300">Cost transparency, validation, and post-fix learning.</p>
      </div>
      <motion.div {...fadeInUp} className="glass-panel rounded-3xl border border-white/5 p-5">
        {loading ? <p className="text-sm text-slate-300">Syncing with service center...</p> : <StatusTimeline items={serviceTimeline} />}
      </motion.div>
      <InsightCard title="Feedback loop" subtitle="Accuracy validation">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
          <ClipboardCheck className="h-4 w-4 text-accent-200" />
          <span>Did the prediction match? Share a note for continuous learning.</span>
        </div>
      </InsightCard>
    </div>
  );
}

export default ServiceStatusPage;
