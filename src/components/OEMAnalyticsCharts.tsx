import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

interface OemInsights {
  topIssues: { component: string; count: number; delta: number }[];
  geoHeat: { region: string; incidents: number }[];
  capa: string[];
}

interface Props {
  insights: OemInsights;
}

function OEMAnalyticsCharts({ insights }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="glass-panel rounded-2xl border border-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-slate-400">Top issues</p>
          <span className="text-xs text-accent-200">Live clusters</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={insights.topIssues} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2a3d" />
            <XAxis dataKey="component" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "#0b0f1a", border: "1px solid #1f2937" }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Bar dataKey="count" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#40a0ff" />
                <stop offset="100%" stopColor="#4ff3c0" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="glass-panel rounded-2xl border border-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-slate-400">Geo breakdown</p>
          <span className="text-xs text-accent-200">Incidents</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={insights.geoHeat} margin={{ left: -15 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ff3c0" stopOpacity={0.8} />
                <stop offset="90%" stopColor="#0b0f1a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2a3d" />
            <XAxis dataKey="region" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "#0b0f1a", border: "1px solid #1f2937" }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Area type="monotone" dataKey="incidents" stroke="#40a0ff" fill="url(#areaGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="glass-panel rounded-2xl border border-white/5 p-4 lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-slate-400">CAPA actions</p>
          <span className="text-xs text-accent-200">Suggested</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {insights.capa.map((item, idx) => (
            <div key={item} className="rounded-xl border border-white/5 bg-panel/70 p-3 text-sm text-white">
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-accent-300" /> Step {idx + 1}
              </div>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OEMAnalyticsCharts;
