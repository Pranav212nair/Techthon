import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/motionPresets";
import { Appointment } from "../types";
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from "lucide-react";

function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("appointments");
      if (stored) {
        const parsed = JSON.parse(stored);
        setAppointments(parsed.reverse()); // most recent first
      }
    } catch {
      console.warn("Failed to load appointments");
    }
  }, []);

  const cancelAppointment = (id: string) => {
    try {
      const updated = appointments.map((a) =>
        a.id === id ? { ...a, status: "cancelled" as const } : a
      );
      setAppointments(updated);
      localStorage.setItem("appointments", JSON.stringify(updated));
    } catch {
      console.warn("Failed to cancel appointment");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-accent-200">My Bookings</p>
        <h1 className="text-3xl font-semibold text-white">Service Appointments</h1>
        <p className="text-sm text-slate-300">
          Your scheduled and past service visits tracked here.
        </p>
      </div>

      {appointments.length === 0 ? (
        <motion.div
          {...fadeInUp}
          className="glass-panel rounded-3xl border border-white/5 p-10 text-center shadow-glow"
        >
          <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-400" />
          <p className="text-lg text-slate-200">No appointments yet</p>
          <p className="mt-2 text-sm text-slate-400">
            Visit the Assistant page to book your first service slot.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <motion.div
              key={appt.id}
              {...fadeInUp}
              className="glass-panel rounded-2xl border border-white/5 p-5 shadow-glow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-full p-3 ${
                      appt.status === "confirmed"
                        ? "bg-accent-500/20 text-accent-200"
                        : appt.status === "completed"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {appt.status === "confirmed" ? (
                      <Clock className="h-5 w-5" />
                    ) : appt.status === "completed" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{appt.center}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          appt.status === "confirmed"
                            ? "bg-accent-500/20 text-accent-200"
                            : appt.status === "completed"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" /> {appt.date}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4" /> {appt.time}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      Booked on {new Date(appt.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {appt.status === "confirmed" && (
                  <button
                    onClick={() => cancelAppointment(appt.id)}
                    className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-300 ring-1 ring-red-500/30 transition hover:bg-red-500/20"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;
