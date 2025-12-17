import { TimelineItem } from "../types";

interface Props {
  items: TimelineItem[];
}

const statusToColor: Record<TimelineItem["status"], string> = {
  done: "bg-success/10 text-success border-success/30",
  active: "bg-accent-500/10 text-accent-200 border-accent-400/40",
  pending: "bg-panel/60 text-slate-300 border-white/5",
};

function StatusTimeline({ items }: Props) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.label}
          className={`glass-panel relative overflow-hidden rounded-2xl border px-4 py-3 ${statusToColor[item.status]}`}
        >
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-current" />
            <div className="flex flex-col">
              <p className="font-semibold text-white">{item.label}</p>
              <p className="text-sm text-slate-300">{item.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatusTimeline;
