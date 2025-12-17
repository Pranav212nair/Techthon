import { useEffect } from "react";
import { useOem } from "../hooks/useVehicleStore";
import OEMAnalyticsCharts from "../components/OEMAnalyticsCharts";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/motionPresets";
import { Wrench } from "lucide-react";

function OemPage() {
  const { oemInsights, loadOem } = useOem();

  useEffect(() => {
    loadOem();
  }, [loadOem]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-accent-200">Manufacturing Intelligence</p>
        <h1 className="text-3xl font-semibold text-white">Heatmaps and CAPA</h1>
        <p className="text-sm text-slate-300">Clusters from the field sent back to quality and design teams.</p>
      </div>
      {!oemInsights && <p className="text-sm text-slate-300">Loading insights...</p>}
      {oemInsights && (
        <motion.div {...fadeInUp} className="space-y-4">
          <OEMAnalyticsCharts insights={oemInsights} />
          <div className="glass-panel flex items-center gap-3 rounded-2xl border border-white/5 p-4 text-sm text-slate-200">
            <Wrench className="h-4 w-4 text-accent-200" />
            <span>OEM-ready export: anonymized signals + RCA context.</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default OemPage;
