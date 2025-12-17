import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

function InsightCard({ title, subtitle, children }: Props) {
  return (
    <div className="glass-panel rounded-2xl border border-white/5 p-4 shadow-glow">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-accent-200">{subtitle}</p>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      {children}
    </div>
  );
}

export default InsightCard;
