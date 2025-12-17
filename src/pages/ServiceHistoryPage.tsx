import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/motionPresets";
import { History, Wrench, Calendar, DollarSign, CheckCircle, Clock } from "lucide-react";

interface ServiceRecord {
  id: string;
  date: string;
  type: string;
  center: string;
  cost: number;
  mileage: number;
  description: string;
  status: "completed" | "pending";
}

function ServiceHistoryPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);

  useEffect(() => {
    // Load service history from localStorage
    try {
      const history = localStorage.getItem("service_history");
      if (history) {
        setServices(JSON.parse(history));
      } else {
        // Initialize with mock data
        const mockData: ServiceRecord[] = [
          {
            id: "srv-001",
            date: "2024-11-15",
            type: "General Service",
            center: "AutoCare Hub",
            cost: 4500,
            mileage: 18000,
            description: "Oil change, filter replacement, brake inspection",
            status: "completed",
          },
          {
            id: "srv-002",
            date: "2024-08-22",
            type: "Tire Replacement",
            center: "Wheel Masters",
            cost: 12000,
            mileage: 14200,
            description: "Replaced all four tires, wheel alignment",
            status: "completed",
          },
          {
            id: "srv-003",
            date: "2024-05-10",
            type: "AC Service",
            center: "CoolTech Service",
            cost: 3200,
            mileage: 11500,
            description: "AC gas refill, filter cleaning, compressor check",
            status: "completed",
          },
        ];
        setServices(mockData);
        localStorage.setItem("service_history", JSON.stringify(mockData));
      }
    } catch {
      setServices([]);
    }
  }, []);

  const totalSpent = services.reduce((sum, service) => sum + service.cost, 0);
  const completedServices = services.filter((s) => s.status === "completed").length;
  const avgCost = services.length > 0 ? totalSpent / services.length : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-accent-200">Maintenance</p>
        <h1 className="text-3xl font-semibold text-white">Service History</h1>
        <p className="text-sm text-slate-300">
          Complete log of all maintenance and repairs performed on your vehicle
        </p>
      </div>

      {/* Summary Stats */}
      <motion.div
        {...fadeInUp}
        className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow"
      >
        <h2 className="mb-4 text-xl font-semibold text-white">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-panel/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
              <CheckCircle className="h-4 w-4" /> Completed Services
            </div>
            <p className="text-2xl font-semibold text-white">{completedServices}</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-panel/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
              <DollarSign className="h-4 w-4" /> Total Spent
            </div>
            <p className="text-2xl font-semibold text-white">₹{totalSpent.toLocaleString()}</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-panel/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
              <DollarSign className="h-4 w-4" /> Avg. Cost
            </div>
            <p className="text-2xl font-semibold text-white">₹{Math.round(avgCost).toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Service Records */}
      <motion.div
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.1 }}
        className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Service Records</h2>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <History className="h-4 w-4" /> {services.length} total records
          </div>
        </div>

        {services.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-panel/70 p-8 text-center">
            <Wrench className="mx-auto mb-3 h-12 w-12 text-slate-400" />
            <p className="text-lg text-slate-200">No service history yet</p>
            <p className="mt-2 text-sm text-slate-400">
              Your completed services will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {services
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="rounded-2xl border border-white/5 bg-panel/70 p-4 transition hover:border-accent-500/30"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="rounded-lg bg-accent-500/20 p-2">
                          <Wrench className="h-5 w-5 text-accent-200" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{service.type}</h3>
                          <p className="text-sm text-slate-400">{service.center}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300">{service.description}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(service.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        <span>{service.mileage.toLocaleString()} km</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                          ₹{service.cost.toLocaleString()}
                        </p>
                        <div
                          className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                            service.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-warning/20 text-warning"
                          }`}
                        >
                          {service.status === "completed" ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {service.status === "completed" ? "Completed" : "Pending"}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </motion.div>

      {/* Export Options */}
      <motion.div
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.15 }}
        className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow"
      >
        <h2 className="mb-3 text-xl font-semibold text-white">Export & Share</h2>
        <p className="mb-4 text-sm text-slate-300">
          Download your complete service history for insurance claims or resale documentation
        </p>
        <button
          onClick={() => alert("Export feature coming soon!")}
          className="inline-flex items-center gap-2 rounded-full bg-accent-500/20 px-4 py-2 text-sm text-accent-200 ring-1 ring-accent-500/30 transition hover:bg-accent-500/30"
        >
          <History className="h-4 w-4" /> Export as PDF
        </button>
      </motion.div>
    </div>
  );
}

export default ServiceHistoryPage;
