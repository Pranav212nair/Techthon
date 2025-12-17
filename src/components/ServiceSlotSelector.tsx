import { MapPin, Navigation, ShieldCheck } from "lucide-react";
import { ServiceSlot } from "../types";

interface Props {
  slots: ServiceSlot[];
  onSelectSlot?: (center: string, time: string) => void;
}

function ServiceSlotSelector({ slots, onSelectSlot }: Props) {
  return (
    <div className="space-y-3">
      {slots.map((slot) => (
        <div key={slot.center} className="glass-panel rounded-2xl border border-white/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-accent-500/20 p-2 text-accent-200">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Nearby center</p>
                <h4 className="text-lg font-semibold text-white">{slot.center}</h4>
                <p className="text-sm text-slate-300">{slot.badge}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-200">
                  <span className="inline-flex items-center gap-1 rounded-full bg-panel px-2 py-1">
                    <Navigation className="h-3 w-3" /> {slot.etaMinutes} mins away
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-panel px-2 py-1">
                    <ShieldCheck className="h-3 w-3" /> {slot.rating} ★
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {slot.slots.map((time) => (
                <button
                  key={time}
                  className="rounded-full bg-gradient-to-r from-panel to-panel/60 px-3 py-1 text-xs text-white ring-1 ring-accent-500/30 transition hover:-translate-y-0.5 hover:bg-panel hover:ring-accent-200/60"
                  onClick={() => onSelectSlot?.(slot.center, time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ServiceSlotSelector;
