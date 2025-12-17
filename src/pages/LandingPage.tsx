import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeInUp } from "../animations/motionPresets";
import AIWaveform from "../components/AIWaveform";
import { Sparkles, ShieldCheck, MoveRight } from "lucide-react";

const stats = [
  { label: "Breakdowns prevented", value: "-37%" },
  { label: "Service time saved", value: "2.4h" },
  { label: "Confidence in AI", value: "87%" },
];

function LandingPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 py-10">
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <motion.p {...fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-accent-500/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent-100">
            <Sparkles className="h-3 w-3" /> Empathy-first maintenance
          </motion.p>
          <motion.h1
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.1 }}
            className="font-display text-4xl leading-tight text-white sm:text-5xl"
          >
            Your vehicle whispers before it breaks.
          </motion.h1>
          <motion.p
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
            className="text-lg text-slate-300"
          >
            VIGIL fuses predictive AI, voice-first guidance, and human-grade reassurance. Data → Insight →
            Conversation → Action.
          </motion.p>
          <motion.div
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              to="/login"
              className="rounded-full bg-gradient-to-r from-accent-500 to-glow px-5 py-3 font-semibold text-surface shadow-neon transition hover:-translate-y-0.5"
            >
              Get Started
            </Link>
            <Link
              to="/dashboard"
              className="rounded-full border border-white/10 px-5 py-3 text-slate-200 transition hover:-translate-y-0.5 hover:border-accent-300/50 hover:text-white"
            >
              See live health
            </Link>
          </motion.div>
          <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.4 }} className="grid grid-cols-3 gap-3 text-sm text-slate-200">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/5 bg-panel/70 p-3 text-center">
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div
          className="glass-panel relative overflow-hidden rounded-3xl border border-white/5 p-6 shadow-neon"
        >
          <div className="absolute inset-0 gradient-ring" aria-hidden />
          <div className="relative">
            <p className="text-sm text-slate-300">Live vehicle sentiment</p>
            <AIWaveform mood="concern" className="mt-3" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-panel/70 p-4">
                <p className="text-xs text-slate-400">Prediction</p>
                <p className="text-lg font-semibold text-white">Tire imbalance in 900 km</p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-warning/10 px-3 py-1 text-xs text-warning">
                  <ShieldCheck className="h-3 w-3" /> 87% confidence
                </div>
              </div>
              <div className="rounded-2xl bg-panel/70 p-4">
                <p className="text-xs text-slate-400">Action</p>
                <p className="text-lg font-semibold text-white">Pre-book adaptive slot</p>
                <div className="mt-3 inline-flex items-center gap-2 text-sm text-accent-200">
                  Follow the assistant <MoveRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        {["Predict", "Converse", "Act"].map((stage, idx) => (
          <motion.div
            key={stage}
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.2 * idx }}
            className="glass-panel rounded-2xl border border-white/5 p-4"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-accent-200">{stage}</p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              {stage === "Predict"
                ? "Signal intelligence from telematics"
                : stage === "Converse"
                ? "Voice empathy that explains and reassures"
                : "Book service, validate fix, learn again"}
            </h3>
            <p className="mt-3 text-sm text-slate-300">
              {stage === "Predict"
                ? "Thermal, vibration, and usage signals blend into early warnings."
                : stage === "Converse"
                ? "Assistant speaks calmly with visualized waveforms and sentiment."
                : "Smart scheduling pairs urgency with trusted centers."}
            </p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}

export default LandingPage;
