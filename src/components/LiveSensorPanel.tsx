import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Battery, Thermometer, Gauge as GaugeIcon, Zap } from "lucide-react";

interface Sensor {
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  optimal: [number, number];
  icon: React.ReactNode;
  color: string;
}

function LiveSensorPanel() {
  const [sensors, setSensors] = useState<Sensor[]>([
    {
      name: "Battery Voltage",
      value: 12.6,
      unit: "V",
      min: 11,
      max: 14,
      optimal: [12.4, 12.8],
      icon: <Battery className="h-5 w-5" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Coolant Temp",
      value: 88,
      unit: "°C",
      min: 70,
      max: 110,
      optimal: [85, 95],
      icon: <Thermometer className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Tire Pressure",
      value: 32,
      unit: "PSI",
      min: 28,
      max: 36,
      optimal: [30, 34],
      icon: <GaugeIcon className="h-5 w-5" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Engine Load",
      value: 42,
      unit: "%",
      min: 0,
      max: 100,
      optimal: [30, 60],
      icon: <Zap className="h-5 w-5" />,
      color: "from-orange-500 to-red-500",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) => {
          // Simulate realistic fluctuations
          let newValue = sensor.value;
          const range = sensor.max - sensor.min;
          const variation = range * 0.02; // 2% variation

          if (sensor.name === "Battery Voltage") {
            newValue += (Math.random() - 0.5) * 0.1;
          } else if (sensor.name === "Coolant Temp") {
            newValue += (Math.random() - 0.5) * 2;
          } else if (sensor.name === "Tire Pressure") {
            newValue += (Math.random() - 0.5) * 0.5;
          } else if (sensor.name === "Engine Load") {
            newValue += (Math.random() - 0.5) * 8;
          }

          // Clamp values
          newValue = Math.max(sensor.min, Math.min(sensor.max, newValue));

          return { ...sensor, value: newValue };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatus = (sensor: Sensor) => {
    if (sensor.value >= sensor.optimal[0] && sensor.value <= sensor.optimal[1]) {
      return { label: "Optimal", color: "text-green-400" };
    } else if (sensor.value < sensor.min + (sensor.max - sensor.min) * 0.2) {
      return { label: "Low", color: "text-warning" };
    } else if (sensor.value > sensor.max - (sensor.max - sensor.min) * 0.2) {
      return { label: "High", color: "text-danger" };
    }
    return { label: "Normal", color: "text-slate-300" };
  };

  const getGaugePercentage = (sensor: Sensor) => {
    return ((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Live Telemetry</h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
          </span>
          <span className="text-xs text-green-400">Live</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sensors.map((sensor, idx) => {
          const status = getStatus(sensor);
          const percentage = getGaugePercentage(sensor);

          return (
            <motion.div
              key={sensor.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="rounded-2xl border border-white/5 bg-panel/70 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`rounded-lg bg-gradient-to-br ${sensor.color} p-2 text-white`}>
                    {sensor.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{sensor.name}</p>
                    <p className={`text-xs ${status.color}`}>{status.label}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    {sensor.value.toFixed(sensor.name === "Battery Voltage" ? 1 : 0)}
                  </p>
                  <p className="text-xs text-slate-400">{sensor.unit}</p>
                </div>
              </div>

              {/* Progress Bar Gauge */}
              <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className={`h-full bg-gradient-to-r ${sensor.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                {/* Optimal Range Indicator */}
                <div
                  className="absolute top-0 h-full border-l-2 border-r-2 border-white/30"
                  style={{
                    left: `${((sensor.optimal[0] - sensor.min) / (sensor.max - sensor.min)) * 100}%`,
                    right: `${100 - ((sensor.optimal[1] - sensor.min) / (sensor.max - sensor.min)) * 100}%`,
                  }}
                />
              </div>

              {/* Min/Max Labels */}
              <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                <span>{sensor.min}{sensor.unit}</span>
                <span>{sensor.max}{sensor.unit}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-accent-500/20 bg-accent-500/5 p-3">
        <p className="text-xs text-slate-300">
          <strong className="text-accent-200">Real-time Monitoring:</strong> Sensors update every 2
          seconds. Values are simulated for demo purposes. In production, these would connect to actual
          OBD-II or vehicle telemetry APIs.
        </p>
      </div>
    </motion.div>
  );
}

export default LiveSensorPanel;
