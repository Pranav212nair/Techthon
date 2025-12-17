import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/motionPresets";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Activity, DollarSign, Wrench } from "lucide-react";

interface HealthDataPoint {
  date: string;
  health: number;
  battery: number;
  engine: number;
}

interface ServiceCostData {
  month: string;
  cost: number;
}

function AnalyticsPage() {
  const [healthData, setHealthData] = useState<HealthDataPoint[]>([]);
  const [costData, setCostData] = useState<ServiceCostData[]>([]);
  const [mileageData, setMileageData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock trend data
    const generateHealthData = () => {
      const data: HealthDataPoint[] = [];
      const today = new Date();
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          health: 75 + Math.random() * 20 - i * 0.2,
          battery: 70 + Math.random() * 25 - i * 0.3,
          engine: 80 + Math.random() * 15 - i * 0.1,
        });
      }
      
      return data;
    };

    const generateCostData = () => {
      const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months.map((month) => ({
        month,
        cost: Math.floor(2000 + Math.random() * 8000),
      }));
    };

    const generateMileageData = () => {
      const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months.map((month, idx) => ({
        month,
        mileage: 15000 + idx * 800 + Math.random() * 400,
      }));
    };

    setHealthData(generateHealthData());
    setCostData(generateCostData());
    setMileageData(generateMileageData());
  }, []);

  const totalCost = costData.reduce((sum, item) => sum + item.cost, 0);
  const avgCost = costData.length > 0 ? totalCost / costData.length : 0;
  const currentHealth = healthData.length > 0 ? healthData[healthData.length - 1].health : 0;
  const healthTrend = healthData.length > 1
    ? healthData[healthData.length - 1].health - healthData[0].health
    : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-white/10 bg-surface/95 p-3 shadow-lg backdrop-blur">
          <p className="mb-2 text-sm font-medium text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}
              {entry.name === "cost" ? " ₹" : entry.name.includes("ealth") || entry.name.includes("attery") || entry.name.includes("ngine") ? "" : " km"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-accent-200">Insights</p>
        <h1 className="text-3xl font-semibold text-white">Analytics & Trends</h1>
        <p className="text-sm text-slate-300">
          Comprehensive view of your vehicle's health, costs, and maintenance patterns over time
        </p>
      </div>

      {/* Summary Cards */}
      <motion.div {...fadeInUp} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel rounded-2xl border border-white/5 p-4 shadow-glow">
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
            <Activity className="h-4 w-4" /> Current Health
          </div>
          <p className="text-3xl font-bold text-white">{currentHealth.toFixed(0)}%</p>
          <div className={`mt-1 flex items-center gap-1 text-xs ${healthTrend >= 0 ? "text-green-400" : "text-danger"}`}>
            <TrendingUp className={`h-3 w-3 ${healthTrend < 0 ? "rotate-180" : ""}`} />
            {Math.abs(healthTrend).toFixed(1)}% vs. 30d ago
          </div>
        </div>

        <div className="glass-panel rounded-2xl border border-white/5 p-4 shadow-glow">
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
            <DollarSign className="h-4 w-4" /> Total Spent (6m)
          </div>
          <p className="text-3xl font-bold text-white">₹{totalCost.toLocaleString()}</p>
          <p className="mt-1 text-xs text-slate-400">Across {costData.length} months</p>
        </div>

        <div className="glass-panel rounded-2xl border border-white/5 p-4 shadow-glow">
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
            <DollarSign className="h-4 w-4" /> Avg Monthly Cost
          </div>
          <p className="text-3xl font-bold text-white">₹{Math.round(avgCost).toLocaleString()}</p>
          <p className="mt-1 text-xs text-slate-400">Last 6 months</p>
        </div>

        <div className="glass-panel rounded-2xl border border-white/5 p-4 shadow-glow">
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
            <Wrench className="h-4 w-4" /> Services Completed
          </div>
          <p className="text-3xl font-bold text-white">8</p>
          <p className="mt-1 text-xs text-slate-400">This year</p>
        </div>
      </motion.div>

      {/* Health Score Trend */}
      <motion.div
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.05 }}
        className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow"
      >
        <h2 className="mb-4 text-xl font-semibold text-white">Health Score Trend (30 Days)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={healthData}>
              <defs>
                <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEngine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "#e2e8f0" }} />
              <Area
                type="monotone"
                dataKey="health"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHealth)"
                name="Overall Health"
              />
              <Area
                type="monotone"
                dataKey="battery"
                stroke="#22c55e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBattery)"
                name="Battery"
              />
              <Area
                type="monotone"
                dataKey="engine"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEngine)"
                name="Engine"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Cost & Mileage Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Service Cost Trend */}
        <motion.div
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.1 }}
          className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow"
        >
          <h2 className="mb-4 text-xl font-semibold text-white">Service Costs (6 Months)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cost" fill="#6366f1" radius={[8, 8, 0, 0]} name="Cost (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Mileage Progression */}
        <motion.div
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.15 }}
          className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow"
        >
          <h2 className="mb-4 text-xl font-semibold text-white">Mileage Progression</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mileageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={["dataMin - 500", "dataMax + 500"]} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="mileage"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: "#22c55e", r: 4 }}
                  name="Odometer (km)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.2 }}
        className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow"
      >
        <h2 className="mb-4 text-xl font-semibold text-white">AI Insights</h2>
        <div className="space-y-3">
          <div className="rounded-2xl border border-accent-500/20 bg-accent-500/5 p-4">
            <p className="text-sm text-accent-200">
              <strong>Predictive Analysis:</strong> Your battery health has been declining steadily over the past month.
              Consider scheduling a battery diagnostic test within the next 2 weeks.
            </p>
          </div>
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-sm text-green-400">
              <strong>Cost Optimization:</strong> Your average monthly maintenance cost is 12% below the typical range for
              your vehicle type. Good job keeping up with preventive maintenance!
            </p>
          </div>
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
            <p className="text-sm text-blue-400">
              <strong>Usage Pattern:</strong> You're averaging 42 km/day. Based on this, your next service will be due in
              approximately 18 days.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AnalyticsPage;
