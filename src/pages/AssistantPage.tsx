import { useEffect, useMemo, useState } from "react";
import { useAssistant, useService } from "../hooks/useVehicleStore";
import VoiceConversationPanel from "../components/VoiceConversationPanel";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/motionPresets";
import { ButtonAction } from "../components/shared/ButtonAction";
import ServiceSlotSelector from "../components/ServiceSlotSelector";

function AssistantPage() {
  const { conversation, sendPrompt } = useAssistant();
  const { serviceSlots, loadService, loading: serviceLoading } = useService();
  const [sending, setSending] = useState(false);
  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [selectedDate, setSelectedDate] = useState(todayIso);

  const handleQuickAction = async (text: string) => {
    setSending(true);
    await sendPrompt(text);
    setSending(false);
  };

  const handleSlotSelect = async (center: string, time: string) => {
    setSending(true);
    await sendPrompt(`Book ${center} at ${time} on ${selectedDate}`);
    setSending(false);
  };

  useEffect(() => {
    loadService();
  }, [loadService]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-accent-200">AI Companion</p>
        <h1 className="text-3xl font-semibold text-white">Voice-first empathy</h1>
        <p className="text-sm text-slate-300">Waveform shows sentiment. Ask for a booking, an explanation, or a quiet mode.</p>
      </div>
      <motion.div {...fadeInUp} className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow">
        <VoiceConversationPanel conversation={conversation} onSend={sendPrompt} />
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <ButtonAction label="Book service" onClick={() => handleQuickAction("Book the recommended slot this week")} disabled={sending} />
          <ButtonAction label="Explain more" onClick={() => handleQuickAction("Explain why battery is flagged")} disabled={sending} />
          <ButtonAction label="Ignore for now" onClick={() => handleQuickAction("Mute non-critical alerts for 24h")} disabled={sending} />
        </div>
      </motion.div>
      <motion.div
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.05 }}
        className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow"
      >
        <div className="mb-3 flex items-center justify-between text-sm text-slate-200">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent-200">Pick a time</p>
            <p className="text-sm text-slate-300">Tap a slot and I will book it instantly.</p>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-200">
            <span className="text-slate-300">Date</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-md bg-panel px-2 py-1 text-slate-100 outline-none ring-1 ring-white/10 focus:ring-accent-400/60"
            />
          </label>
        </div>
        {serviceLoading ? (
          <p className="text-sm text-slate-300">Loading nearby slots...</p>
        ) : (
          <ServiceSlotSelector slots={serviceSlots} onSelectSlot={handleSlotSelect} />
        )}
      </motion.div>
    </div>
  );
}

export default AssistantPage;
