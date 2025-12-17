import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/motionPresets";
import { useOnboarding } from "../hooks/useOnboarding";
import { Car, Calendar, Gauge, MapPin, Edit2, Save, AlertTriangle, CheckCircle, Clock, Wrench } from "lucide-react";

function VehicleProfilePage() {
  const { data: onboardingData } = useOnboarding();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    odometer: "",
    climate: "",
    vehicle: "",
  });

  useEffect(() => {
    if (onboardingData) {
      setFormData({
        vehicleType: onboardingData.vehicleType || "Car",
        vehicleMake: onboardingData.vehicleMake || "",
        vehicleModel: onboardingData.vehicleModel || "",
        vehicleYear: onboardingData.vehicleYear || "",
        odometer: onboardingData.odometer || "",
        climate: onboardingData.climate || "",
        vehicle: onboardingData.vehicle || "",
      });
    }
  }, [onboardingData]);

  const handleSave = () => {
    if (!onboardingData) return;
    const updated = { ...onboardingData, ...formData };
    localStorage.setItem("onboarding", JSON.stringify(updated));
    setEditing(false);
    alert("Vehicle profile updated!");
    window.location.reload();
  };

  // Service intervals by vehicle type
  const getServiceIntervals = (vehicleType: string) => {
    switch (vehicleType) {
      case "Bike":
        return {
          general: 4000,
          oil: 3500,
          brakes: 5000,
          chain: 600,
          major: 22000,
        };
      case "Car":
        return {
          general: 11000,
          oil: 10000,
          brakes: 20000,
          battery: 12,
          major: 50000,
        };
      case "SUV":
        return {
          general: 10000,
          oil: 10000,
          brakes: 20000,
          suspension: 20000,
          major: 60000,
        };
      case "Truck":
        return {
          general: 17500,
          oil: 15000,
          brakes: 12500,
          clutch: 30000,
          major: 100000,
        };
      case "Electric":
        return {
          inspection: 12500,
          battery: 12,
          brakes: 20000,
          cooling: 20000,
          major: 80000,
        };
      default:
        return {
          general: 11000,
          oil: 10000,
          brakes: 20000,
          major: 50000,
        };
    }
  };

  // Calculate next service predictions
  const calculateNextService = () => {
    const currentOdo = parseInt(onboardingData?.odometer || "0");
    const vehicleType = onboardingData?.vehicleType || "Car";
    const intervals = getServiceIntervals(vehicleType);
    
    // Adjust daily average based on vehicle type
    const avgDailyKm = vehicleType === "Bike" ? 30 : vehicleType === "Truck" ? 80 : 42;

    // Calculate all service types
    const services = [];

    if (vehicleType === "Electric") {
      // EV-specific services
      const inspectionInterval = intervals.inspection as number;
      const lastInspection = Math.floor(currentOdo / inspectionInterval) * inspectionInterval;
      const nextInspection = lastInspection + inspectionInterval;
      const kmUntilInspection = nextInspection - currentOdo;
      services.push({
        type: "General Inspection",
        nextKm: nextInspection,
        kmRemaining: kmUntilInspection,
        daysRemaining: Math.ceil(kmUntilInspection / avgDailyKm),
        isOverdue: kmUntilInspection < 0,
        isNear: kmUntilInspection < (inspectionInterval * 0.1) && kmUntilInspection >= 0,
      });

      const brakesInterval = intervals.brakes as number;
      const lastBrakes = Math.floor(currentOdo / brakesInterval) * brakesInterval;
      const nextBrakes = lastBrakes + brakesInterval;
      const kmUntilBrakes = nextBrakes - currentOdo;
      services.push({
        type: "Brake Check (Regen Wear)",
        nextKm: nextBrakes,
        kmRemaining: kmUntilBrakes,
        daysRemaining: Math.ceil(kmUntilBrakes / avgDailyKm),
        isOverdue: kmUntilBrakes < 0,
        isNear: kmUntilBrakes < (brakesInterval * 0.1) && kmUntilBrakes >= 0,
      });

      const coolingInterval = intervals.cooling as number;
      const lastCooling = Math.floor(currentOdo / coolingInterval) * coolingInterval;
      const nextCooling = lastCooling + coolingInterval;
      const kmUntilCooling = nextCooling - currentOdo;
      services.push({
        type: "Cooling System Check",
        nextKm: nextCooling,
        kmRemaining: kmUntilCooling,
        daysRemaining: Math.ceil(kmUntilCooling / avgDailyKm),
        isOverdue: kmUntilCooling < 0,
        isNear: kmUntilCooling < (coolingInterval * 0.1) && kmUntilCooling >= 0,
      });
    } else if (vehicleType === "Bike") {
      // Bike-specific services
      const generalInterval = intervals.general as number;
      const lastGeneral = Math.floor(currentOdo / generalInterval) * generalInterval;
      const nextGeneral = lastGeneral + generalInterval;
      const kmUntilGeneral = nextGeneral - currentOdo;
      services.push({
        type: "General Service",
        nextKm: nextGeneral,
        kmRemaining: kmUntilGeneral,
        daysRemaining: Math.ceil(kmUntilGeneral / avgDailyKm),
        isOverdue: kmUntilGeneral < 0,
        isNear: kmUntilGeneral < (generalInterval * 0.1) && kmUntilGeneral >= 0,
      });

      const oilInterval = intervals.oil as number;
      const lastOil = Math.floor(currentOdo / oilInterval) * oilInterval;
      const nextOil = lastOil + oilInterval;
      const kmUntilOil = nextOil - currentOdo;
      services.push({
        type: "Engine Oil Change",
        nextKm: nextOil,
        kmRemaining: kmUntilOil,
        daysRemaining: Math.ceil(kmUntilOil / avgDailyKm),
        isOverdue: kmUntilOil < 0,
        isNear: kmUntilOil < (oilInterval * 0.1) && kmUntilOil >= 0,
      });

      const chainInterval = intervals.chain as number;
      const lastChain = Math.floor(currentOdo / chainInterval) * chainInterval;
      const nextChain = lastChain + chainInterval;
      const kmUntilChain = nextChain - currentOdo;
      services.push({
        type: "Chain Lubrication",
        nextKm: nextChain,
        kmRemaining: kmUntilChain,
        daysRemaining: Math.ceil(kmUntilChain / avgDailyKm),
        isOverdue: kmUntilChain < 0,
        isNear: kmUntilChain < (chainInterval * 0.15) && kmUntilChain >= 0,
      });
    } else {
      // Car/SUV/Truck services
      const generalInterval = intervals.general as number;
      const lastGeneral = Math.floor(currentOdo / generalInterval) * generalInterval;
      const nextGeneral = lastGeneral + generalInterval;
      const kmUntilGeneral = nextGeneral - currentOdo;
      services.push({
        type: "General Service",
        nextKm: nextGeneral,
        kmRemaining: kmUntilGeneral,
        daysRemaining: Math.ceil(kmUntilGeneral / avgDailyKm),
        isOverdue: kmUntilGeneral < 0,
        isNear: kmUntilGeneral < (generalInterval * 0.1) && kmUntilGeneral >= 0,
      });

      const oilInterval = intervals.oil as number;
      const lastOil = Math.floor(currentOdo / oilInterval) * oilInterval;
      const nextOil = lastOil + oilInterval;
      const kmUntilOil = nextOil - currentOdo;
      services.push({
        type: "Engine Oil & Filter",
        nextKm: nextOil,
        kmRemaining: kmUntilOil,
        daysRemaining: Math.ceil(kmUntilOil / avgDailyKm),
        isOverdue: kmUntilOil < 0,
        isNear: kmUntilOil < (oilInterval * 0.1) && kmUntilOil >= 0,
      });

      const brakesInterval = intervals.brakes as number;
      const lastBrakes = Math.floor(currentOdo / brakesInterval) * brakesInterval;
      const nextBrakes = lastBrakes + brakesInterval;
      const kmUntilBrakes = nextBrakes - currentOdo;
      services.push({
        type: vehicleType === "Truck" ? "Brake System Check" : "Brake Inspection",
        nextKm: nextBrakes,
        kmRemaining: kmUntilBrakes,
        daysRemaining: Math.ceil(kmUntilBrakes / avgDailyKm),
        isOverdue: kmUntilBrakes < 0,
        isNear: kmUntilBrakes < (brakesInterval * 0.1) && kmUntilBrakes >= 0,
      });

      if (vehicleType === "SUV" && intervals.suspension) {
        const suspensionInterval = intervals.suspension as number;
        const lastSuspension = Math.floor(currentOdo / suspensionInterval) * suspensionInterval;
        const nextSuspension = lastSuspension + suspensionInterval;
        const kmUntilSuspension = nextSuspension - currentOdo;
        services.push({
          type: "Suspension & Alignment",
          nextKm: nextSuspension,
          kmRemaining: kmUntilSuspension,
          daysRemaining: Math.ceil(kmUntilSuspension / avgDailyKm),
          isOverdue: kmUntilSuspension < 0,
          isNear: kmUntilSuspension < (suspensionInterval * 0.1) && kmUntilSuspension >= 0,
        });
      }

      if (vehicleType === "Truck" && intervals.clutch) {
        const clutchInterval = intervals.clutch as number;
        const lastClutch = Math.floor(currentOdo / clutchInterval) * clutchInterval;
        const nextClutch = lastClutch + clutchInterval;
        const kmUntilClutch = nextClutch - currentOdo;
        services.push({
          type: "Clutch Inspection",
          nextKm: nextClutch,
          kmRemaining: kmUntilClutch,
          daysRemaining: Math.ceil(kmUntilClutch / avgDailyKm),
          isOverdue: kmUntilClutch < 0,
          isNear: kmUntilClutch < (clutchInterval * 0.1) && kmUntilClutch >= 0,
        });
      }
    }

    // Sort by kmRemaining (closest first)
    services.sort((a, b) => a.kmRemaining - b.kmRemaining);

    return {
      services,
      nextService: services[0],
    };
  };

  // Predict upcoming issues based on current data
  const getPredictedIssues = () => {
    const currentOdo = parseInt(onboardingData?.odometer || "0");
    const climate = onboardingData?.climate || "mixed";
    const vehicleAge = new Date().getFullYear() - parseInt(onboardingData?.vehicleYear || "2020");
    const vehicleType = onboardingData?.vehicleType || "Car";

    const issues = [];

    // Battery (higher risk in hot climate, old vehicles) - EVs don't have 12V issues as much
    if (vehicleType !== "Electric" && (climate === "hot" || climate === "humid" || vehicleAge > 3)) {
      issues.push({
        component: "12V Battery",
        risk: climate === "hot" ? "high" : "medium",
        etaKm: vehicleType === "Bike" ? 600 : 900,
        etaDays: vehicleType === "Bike" ? 10 : 14,
        action: "Schedule battery health test",
      });
    }

    // Tires (based on mileage and vehicle type)
    const tireThreshold = vehicleType === "Bike" ? 10000 : vehicleType === "Truck" ? 25000 : 15000;
    if (currentOdo > tireThreshold) {
      issues.push({
        component: vehicleType === "Bike" ? "Front Tire" : "Front-right Tire",
        risk: "medium",
        etaKm: vehicleType === "Bike" ? 300 : vehicleType === "Truck" ? 800 : 450,
        etaDays: vehicleType === "Bike" ? 5 : vehicleType === "Truck" ? 10 : 7,
        action: vehicleType === "Bike" ? "Check tread and pressure" : "Rebalance and inflate",
      });
    }

    // Engine/Motor (older vehicles in hot climate) - EVs don't have this issue
    if (vehicleType !== "Electric" && (climate === "hot" || climate === "humid") && vehicleAge > 2) {
      issues.push({
        component: vehicleType === "Bike" ? "Engine Temperature" : "Engine Coil",
        risk: vehicleType === "Bike" ? "medium" : "low",
        etaKm: vehicleType === "Bike" ? 800 : 1500,
        etaDays: vehicleType === "Bike" ? 12 : 21,
        action: vehicleType === "Bike" ? "Check coolant and oil" : "Monitor thermal patterns",
      });
    }

    // Electric-specific issues
    if (vehicleType === "Electric") {
      issues.push({
        component: "Battery Pack Health",
        risk: "low",
        etaKm: 3000,
        etaDays: 45,
        action: "Monitor charging efficiency and range",
      });
    }

    // Truck-specific issues
    if (vehicleType === "Truck") {
      issues.push({
        component: "Brake Pads (Heavy Load)",
        risk: "medium",
        etaKm: 1200,
        etaDays: 15,
        action: "Inspect brake wear due to load stress",
      });
    }

    return issues;
  };

  const serviceInfo = onboardingData ? calculateNextService() : null;
  const predictedIssues = onboardingData ? getPredictedIssues() : [];

  if (!onboardingData) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 py-8">
        <motion.div
          {...fadeInUp}
          className="glass-panel rounded-3xl border border-white/5 p-10 text-center shadow-glow"
        >
          <Car className="mx-auto mb-4 h-12 w-12 text-slate-400" />
          <p className="text-lg text-slate-200">No vehicle registered yet</p>
          <p className="mt-2 text-sm text-slate-400">
            Complete onboarding to connect your vehicle.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-accent-200">Your Vehicle</p>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-white">
            {onboardingData.vehicleMake} {onboardingData.vehicleModel}
          </h1>
          <button
            onClick={() => (editing ? handleSave() : setEditing(true))}
            className="inline-flex items-center gap-2 rounded-full bg-accent-500/20 px-4 py-2 text-sm text-accent-200 ring-1 ring-accent-500/30 transition hover:bg-accent-500/30"
          >
            {editing ? (
              <>
                <Save className="h-4 w-4" /> Save Changes
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4" /> Edit Profile
              </>
            )}
          </button>
        </div>
        <p className="text-sm text-slate-300">
          Manage your vehicle details for accurate predictions
        </p>
      </div>

      <motion.div
        {...fadeInUp}
        className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow"
      >
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                <Car className="h-4 w-4" /> Vehicle Type
              </label>
              {editing ? (
                <select
                  className="w-full rounded-xl bg-panel/80 px-4 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-accent-400/60"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                >
                  <option value="Car">Car</option>
                  <option value="Bike">Bike / Motorcycle</option>
                  <option value="SUV">SUV</option>
                  <option value="Truck">Truck / Commercial</option>
                  <option value="Electric">Electric Vehicle</option>
                </select>
              ) : (
                <p className="text-lg font-semibold text-white">{onboardingData.vehicleType || "Car"}</p>
              )}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                <Car className="h-4 w-4" /> Make
              </label>
              {editing ? (
                <select
                  className="w-full rounded-xl bg-panel/80 px-4 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-accent-400/60"
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
              ) : (
                <p className="text-lg font-semibold text-white">{onboardingData.vehicleMake}</p>
              )}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                <Car className="h-4 w-4" /> Model
              </label>
              {editing ? (
                <input
                  className="w-full rounded-xl bg-panel/80 px-4 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-accent-400/60"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                />
              ) : (
                <p className="text-lg font-semibold text-white">{onboardingData.vehicleModel}</p>
              )}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                <Calendar className="h-4 w-4" /> Year
              </label>
              {editing ? (
                <input
                  type="number"
                  className="w-full rounded-xl bg-panel/80 px-4 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-accent-400/60"
                  value={formData.vehicleYear}
                  onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                />
              ) : (
                <p className="text-lg font-semibold text-white">{onboardingData.vehicleYear}</p>
              )}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                <Gauge className="h-4 w-4" /> Odometer (km)
              </label>
              {editing ? (
                <input
                  type="number"
                  className="w-full rounded-xl bg-panel/80 px-4 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-accent-400/60"
                  value={formData.odometer}
                  onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                />
              ) : (
                <p className="text-lg font-semibold text-white">
                  {parseInt(onboardingData.odometer || "0").toLocaleString()} km
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="h-4 w-4" /> Climate
              </label>
              {editing ? (
                <select
                  className="w-full rounded-xl bg-panel/80 px-4 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-accent-400/60"
                  value={formData.climate}
                  onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
                >
                  <option value="hot">Hot & Dry</option>
                  <option value="cold">Cold & Snowy</option>
                  <option value="humid">Hot & Humid</option>
                  <option value="mixed">Mixed / Temperate</option>
                </select>
              ) : (
                <p className="text-lg font-semibold capitalize text-white">
                  {onboardingData.climate}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                VIN (Optional)
              </label>
              {editing ? (
                <input
                  className="w-full rounded-xl bg-panel/80 px-4 py-2 text-white placeholder-slate-500 outline-none ring-1 ring-white/10 focus:ring-accent-400/60"
                  placeholder="17-digit VIN"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                />
              ) : (
                <p className="text-lg font-mono text-slate-300">
                  {onboardingData.vehicle || "—"}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-accent-500/20 bg-accent-500/5 p-4">
            <p className="text-sm text-slate-300">
              <strong className="text-accent-200">Why this matters:</strong> VIGIL uses your
              vehicle details (age, mileage, climate) to fine-tune failure predictions and
              maintenance schedules. More accurate data = better early warnings.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Next Service Schedule */}
      {serviceInfo && (
        <motion.div
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.1 }}
          className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Service Schedule</h2>
            <Link
              to="/service"
              className="inline-flex items-center gap-2 rounded-full bg-accent-500/20 px-4 py-2 text-sm text-accent-200 ring-1 ring-accent-500/30 transition hover:bg-accent-500/30"
            >
              <Wrench className="h-4 w-4" /> Book Service
            </Link>
          </div>

          {/* Next Urgent Service */}
          {serviceInfo.nextService && (
            <div className="mb-4 rounded-2xl border border-accent-500/30 bg-accent-500/10 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-accent-200">Next Service Due</p>
              <p className="mb-2 text-lg font-semibold text-white">{serviceInfo.nextService.type}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-400">At Odometer</p>
                  <p className="text-xl font-semibold text-white">
                    {serviceInfo.nextService.nextKm.toLocaleString()} km
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Remaining</p>
                  <p className={`text-xl font-semibold ${
                    serviceInfo.nextService.isOverdue
                      ? "text-danger"
                      : serviceInfo.nextService.isNear
                      ? "text-warning"
                      : "text-white"
                  }`}>
                    {serviceInfo.nextService.isOverdue
                      ? "Overdue!"
                      : `${serviceInfo.nextService.kmRemaining.toLocaleString()} km`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Est. Days</p>
                  <p className={`text-xl font-semibold ${
                    serviceInfo.nextService.isOverdue
                      ? "text-danger"
                      : serviceInfo.nextService.isNear
                      ? "text-warning"
                      : "text-white"
                  }`}>
                    {serviceInfo.nextService.isOverdue
                      ? "Now"
                      : `~${serviceInfo.nextService.daysRemaining} days`}
                  </p>
                </div>
              </div>
              {(serviceInfo.nextService.isOverdue || serviceInfo.nextService.isNear) && (
                <div className="mt-3 rounded-lg border border-warning/30 bg-warning/10 p-3">
                  <p className="flex items-center gap-2 text-xs text-warning">
                    <AlertTriangle className="h-3 w-3" />
                    {serviceInfo.nextService.isOverdue
                      ? "This service is overdue. Book immediately to prevent potential damage."
                      : "This service is approaching. Book ahead to secure your slot."}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* All Upcoming Services */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">All Upcoming Services</p>
            <div className="space-y-2">
              {serviceInfo.services.map((service: any, idx: number) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-3 ${
                    service.isOverdue
                      ? "border-danger/30 bg-danger/5"
                      : service.isNear
                      ? "border-warning/30 bg-warning/5"
                      : "border-white/5 bg-panel/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-white">{service.type}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        Due at {service.nextKm.toLocaleString()} km
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        service.isOverdue
                          ? "text-danger"
                          : service.isNear
                          ? "text-warning"
                          : "text-slate-300"
                      }`}>
                        {service.isOverdue
                          ? "Overdue"
                          : `${service.kmRemaining.toLocaleString()} km`}
                      </p>
                      <p className="text-xs text-slate-400">
                        {service.isOverdue ? "Book now" : `~${service.daysRemaining} days`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Predicted Issues */}
      {predictedIssues.length > 0 && (
        <motion.div
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.15 }}
          className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Predictive Alerts</h2>
            <Link
              to="/dashboard"
              className="text-sm text-accent-300 hover:underline"
            >
              View Full Report →
            </Link>
          </div>

          <div className="space-y-3">
            {predictedIssues.map((issue, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border p-4 ${
                  issue.risk === "high"
                    ? "border-danger/30 bg-danger/5"
                    : issue.risk === "medium"
                    ? "border-warning/30 bg-warning/5"
                    : "border-accent-500/20 bg-accent-500/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-semibold text-white">{issue.component}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          issue.risk === "high"
                            ? "bg-danger/20 text-danger"
                            : issue.risk === "medium"
                            ? "bg-warning/20 text-warning"
                            : "bg-accent-500/20 text-accent-200"
                        }`}
                      >
                        {issue.risk} risk
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{issue.action}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                      <span>ETA: {issue.etaKm} km / {issue.etaDays} days</span>
                    </div>
                  </div>
                  {issue.risk === "high" && (
                    <AlertTriangle className="h-5 w-5 text-danger" />
                  )}
                  {issue.risk === "medium" && (
                    <Clock className="h-5 w-5 text-warning" />
                  )}
                  {issue.risk === "low" && (
                    <CheckCircle className="h-5 w-5 text-accent-300" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default VehicleProfilePage;
