import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/motionPresets";
import { Car, UserCheck, Gauge, MoveRight, ArrowLeft } from "lucide-react";

const steps = ["Role", "Vehicle", "Preferences"] as const;

type Step = (typeof steps)[number];

interface OnboardingData {
  name: string;
  email: string;
  role: string;
  vehicle: string;
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  odometer: string;
  climate: string;
  drivingStyle: string;
}

function OnboardingPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState<Step>("Role");
  
  // Pre-fill from auth if available
  const getInitialData = () => {
    try {
      const auth = localStorage.getItem("vigil_auth");
      if (auth) {
        const authData = JSON.parse(auth);
        return {
          name: authData.name || "",
          email: authData.email || "",
          role: "Vehicle Owner",
          vehicle: "",
          vehicleType: "Car",
          vehicleMake: "",
          vehicleModel: "",
          vehicleYear: new Date().getFullYear().toString(),
          odometer: "",
          climate: "mixed",
          drivingStyle: "Balanced",
        };
      }
    } catch {
      // ignore
    }
    return {
      name: "",
      email: "",
      role: "Vehicle Owner",
      vehicle: "",
      vehicleType: "Car",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: new Date().getFullYear().toString(),
      odometer: "",
      climate: "mixed",
      drivingStyle: "Balanced",
    };
  };
  
  const [formData, setFormData] = useState<OnboardingData>(getInitialData());

  const goNext = () => {
    if (current === "Vehicle" && !formData.vehicleMake.trim()) {
      alert("Please enter your vehicle make");
      return;
    }
    if (current === "Vehicle" && !formData.vehicleModel.trim()) {
      alert("Please enter your vehicle model");
      return;
    }
    if (current === "Vehicle" && !formData.odometer.trim()) {
      alert("Please enter current odometer reading");
      return;
    }

    const idx = steps.indexOf(current);
    if (idx < steps.length - 1) {
      setCurrent(steps[idx + 1]);
    } else {
      // Get auth name if available
      try {
        const auth = localStorage.getItem("vigil_auth");
        if (auth) {
          const authData = JSON.parse(auth);
          formData.name = authData.name || formData.name;
          formData.email = authData.email || formData.email;
        }
      } catch {
        // ignore
      }
      
      // Complete onboarding - redirect to dashboard
      localStorage.setItem("onboarding", JSON.stringify(formData));
      navigate("/dashboard");
    }
  };

  const goBack = () => {
    const idx = steps.indexOf(current);
    if (idx > 0) {
      setCurrent(steps[idx - 1]);
    }
  };

  return (
    <div className="mx-auto max-w-5xl py-10">
      <motion.div {...fadeInUp} className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
          {steps.map((step) => (
            <span
              key={step}
              className={`rounded-full px-3 py-1 ${
                step === current
                  ? "bg-accent-500 text-surface shadow-neon"
                  : "bg-panel text-slate-300"
              }`}
            >
              {step}
            </span>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-200">Onboarding</p>
            <h2 className="text-3xl font-semibold text-white">
              {current === "Role" && "Tell us your role"}
              {current === "Vehicle" && "Connect your vehicle"}
              {current === "Preferences" && "Tune your experience"}
            </h2>
            <p className="text-sm text-slate-300">
              {current === "Role" &&
                "Select how you engage with vehicle health—as an owner, fleet ops, service, or OEM."}
              {current === "Vehicle" &&
                "Enter your VIN or mock telematics feed ID. VIGIL pulls live signals from here."}
              {current === "Preferences" &&
                "Choose your alerts sensitivity and preferred contact method. You can adjust anytime."}
            </p>

            {/* ROLE STEP */}
            {current === "Role" && (
              <div className="space-y-3 text-sm text-slate-200">
                <label className="block">
                  <span className="text-slate-400">Your Role</span>
                  <select
                    className="mt-1 w-full rounded-xl bg-panel/80 px-3 py-2 text-white focus:outline focus:outline-accent-400"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option>Vehicle Owner</option>
                    <option>Fleet Manager</option>
                    <option>Service Center</option>
                    <option>OEM Quality</option>
                  </select>
                </label>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-accent-300" /> Unlocks tailored features
                </div>
              </div>
            )}

            {/* VEHICLE STEP */}
            {current === "Vehicle" && (
              <div className="space-y-3 text-sm text-slate-200">
                <label className="block">
                  <span className="text-slate-400">Vehicle Type</span>
                  <select
                    className="mt-1 w-full rounded-xl bg-panel/80 px-3 py-2 text-white focus:outline focus:outline-accent-400"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  >
                    <option value="Car">Car</option>
                    <option value="Bike">Bike / Motorcycle</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck / Commercial</option>
                    <option value="Electric">Electric Vehicle</option>
                  </select>
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-slate-400">Make</span>
                    <select
                      className="mt-1 w-full rounded-xl bg-panel/80 px-3 py-2 text-white focus:outline focus:outline-accent-400"
                      value={formData.vehicleMake}
                      onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                    >
                      <option value="">Select Make</option>
                      <option value="Audi">Audi</option>
                      <option value="BMW">BMW</option>
                      <option value="Ford">Ford</option>
                      <option value="Hero">Hero</option>
                      <option value="Honda">Honda</option>
                      <option value="Hyundai">Hyundai</option>
                      <option value="Mahindra">Mahindra</option>
                      <option value="Maruti Suzuki">Maruti Suzuki</option>
                      <option value="Mercedes-Benz">Mercedes-Benz</option>
                      <option value="Nissan">Nissan</option>
                      <option value="Renault">Renault</option>
                      <option value="Royal Enfield">Royal Enfield</option>
                      <option value="Tata">Tata</option>
                      <option value="Toyota">Toyota</option>
                      <option value="Volkswagen">Volkswagen</option>
                      <option value="Yamaha">Yamaha</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-slate-400">Model</span>
                    <input
                      className="mt-1 w-full rounded-xl bg-panel/80 px-3 py-2 text-white placeholder-slate-500 focus:outline focus:outline-accent-400"
                      placeholder="Xpulse 200, City, FZ"
                      value={formData.vehicleModel}
                      onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                    />
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-slate-400">Year</span>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-xl bg-panel/80 px-3 py-2 text-white placeholder-slate-500 focus:outline focus:outline-accent-400"
                      placeholder="2022"
                      min="2000"
                      max={new Date().getFullYear()}
                      value={formData.vehicleYear}
                      onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    <span className="text-slate-400">Odometer (km)</span>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-xl bg-panel/80 px-3 py-2 text-white placeholder-slate-500 focus:outline focus:outline-accent-400"
                      placeholder="18420"
                      min="0"
                      value={formData.odometer}
                      onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-slate-400">Primary Climate</span>
                  <select
                    className="mt-1 w-full rounded-xl bg-panel/80 px-3 py-2 text-white focus:outline focus:outline-accent-400"
                    value={formData.climate}
                    onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
                  >
                    <option value="hot">Hot & Dry</option>
                    <option value="cold">Cold & Snowy</option>
                    <option value="humid">Hot & Humid</option>
                    <option value="mixed">Mixed / Temperate</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-slate-400">VIN (Optional)</span>
                  <input
                    className="mt-1 w-full rounded-xl bg-panel/80 px-3 py-2 text-white placeholder-slate-500 focus:outline focus:outline-accent-400"
                    placeholder="17-digit VIN for OBD telemetry"
                    value={formData.vehicle}
                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  />
                </label>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-accent-300" /> This helps personalize predictions
                </div>
              </div>
            )}

            {/* PREFERENCES STEP */}
            {current === "Preferences" && (
              <div className="space-y-3 text-sm text-slate-200">
                <label className="block">
                  <span className="text-slate-400">Driving Style</span>
                  <select
                    className="mt-1 w-full rounded-xl bg-panel/80 px-3 py-2 text-white focus:outline focus:outline-accent-400"
                    value={formData.drivingStyle}
                    onChange={(e) => setFormData({ ...formData, drivingStyle: e.target.value })}
                  >
                    <option>Conservative</option>
                    <option>Balanced</option>
                    <option>Aggressive</option>
                  </select>
                </label>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-accent-300" /> Tailors prediction thresholds
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {current !== "Role" && (
                <button
                  onClick={goBack}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-slate-300 transition hover:border-accent-300/50 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              )}
              <button
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-500 to-glow px-5 py-3 font-semibold text-surface shadow-neon hover:-translate-y-0.5 transition"
              >
                {current === "Preferences" ? "Complete Setup" : "Continue"} <MoveRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid gap-3">
            {["Vehicle Owner", "Fleet Manager", "Service Center"].map((role, idx) => (
              <div
                key={role}
                className={`glass-panel flex items-center gap-4 rounded-2xl border p-4 transition ${
                  formData.role === role ? "border-accent-400/60 bg-accent-500/10" : "border-white/5"
                }`}
                onClick={() => {
                  if (current === "Role") setFormData({ ...formData, role });
                }}
                style={{ cursor: current === "Role" ? "pointer" : "default" }}
              >
                <div className="rounded-full bg-panel p-2 text-accent-200">
                  {idx === 0 ? (
                    <Gauge className="h-5 w-5" />
                  ) : idx === 1 ? (
                    <UserCheck className="h-5 w-5" />
                  ) : (
                    <Car className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{role}</p>
                  <p className="text-white">
                    {idx === 0
                      ? "Personalized nudges and empathy-driven assistant."
                      : idx === 1
                      ? "Fleet risk rollups and prioritized triage."
                      : "Service orchestration with transparent timelines."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default OnboardingPage;
