import { useEffect } from "react";
import { useService } from "../hooks/useVehicleStore";
import ServiceSlotSelector from "../components/ServiceSlotSelector";
import InsightCard from "../components/InsightCard";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/motionPresets";
import { MapPin, CalendarClock } from "lucide-react";

function ServicePage() {
  const { serviceSlots, loadService, loading } = useService();

  useEffect(() => {
    loadService();
  }, [loadService]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-accent-200">Smart Service</p>
        <h1 className="text-3xl font-semibold text-white">Slots tuned to your risk</h1>
        <p className="text-sm text-slate-300">Optimized by urgency, travel time, and certification.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <motion.div {...fadeInUp} className="glass-panel rounded-3xl border border-white/5 p-5">
          <div className="mb-4 flex items-center gap-3 text-sm text-slate-200">
            <MapPin className="h-4 w-4 text-accent-200" /> Detected issue summary → nearest center
          </div>
          {loading ? (
            <p className="text-sm text-slate-300">Scanning trusted centers...</p>
          ) : (
            <ServiceSlotSelector slots={serviceSlots} />
          )}
        </motion.div>
        <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }} className="glass-panel rounded-3xl border border-white/5 p-5">
          <div className="flex items-center gap-3 text-sm text-slate-200">
            <CalendarClock className="h-4 w-4 text-warning" /> Slot optimization logic
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p>1. Rank by failure ETA × travel time</p>
            <p>2. Elevate OEM-certified and EV-ready labs</p>
            <p>3. Hold-back slots for urgent anomalies</p>
          </div>
        </motion.div>
      </div>
      <InsightCard title="Confidence meters" subtitle="Trust">
        <p className="text-sm text-slate-300">Transparent logic and explainability nurture trust before action.</p>
      </InsightCard>
    </div>
  );
}

export default ServicePage;
