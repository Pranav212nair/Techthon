import {
  AssistantMemory,
  ConversationTurn,
  DriverProfile,
  HealthMetric,
  Prediction,
  ServiceSlot,
  TimelineItem,
  VehicleContext,
} from "../types";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getUserName(): string {
  try {
    const stored = localStorage.getItem("onboarding");
    if (stored) {
      const data = JSON.parse(stored);
      return data.name || "there";
    }
  } catch {
    // ignore
  }
  return "there";
}

function getVehicleContext(): VehicleContext {
  try {
    const stored = localStorage.getItem("onboarding");
    if (stored) {
      const data = JSON.parse(stored);
      return {
        model: `${data.vehicleMake || "Unknown"} ${data.vehicleModel || "Vehicle"}`,
        year: parseInt(data.vehicleYear) || new Date().getFullYear(),
        odoKm: parseInt(data.odometer) || 0,
        climate: (data.climate as "hot" | "cold" | "humid" | "mixed") || "mixed",
      };
    }
  } catch {
    // ignore
  }
  return {
    model: "Hero Xpulse 200",
    year: 2022,
    odoKm: 18420,
    climate: "hot",
  };
}

function getDriverProfile(): DriverProfile {
  try {
    const stored = localStorage.getItem("onboarding");
    if (stored) {
      const data = JSON.parse(stored);
      const lastServiceKm = parseInt(data.odometer) || 8200;
      return {
        name: data.name || "there",
        drivingStyle: (data.drivingStyle?.toLowerCase() as "calm" | "moderate" | "aggressive") || "moderate",
        avgDailyKm: 42,
        preferredTone: "friendly",
        lastServiceKm: Math.max(0, lastServiceKm - 10220),
      };
    }
  } catch {
    // ignore
  }
  return {
    name: "there",
    drivingStyle: "moderate",
    avgDailyKm: 42,
    preferredTone: "friendly",
    lastServiceKm: 8200,
  };
}

const driver: DriverProfile = getDriverProfile();
const vehicle: VehicleContext = getVehicleContext();

let memory: AssistantMemory = {
  trustLevel: 0.72,
};

export async function fetchVehicleHealth() {
  await wait(250);
  const metrics: HealthMetric[] = [
    {
      name: "Engine",
      score: 82,
      trend: "down",
      risk: "medium",
      description: "Ignition coil temperature trending above baseline",
    },
    {
      name: "Brakes",
      score: 90,
      trend: "steady",
      risk: "low",
      description: "Pad wear balanced across axles",
    },
    {
      name: "Battery",
      score: 68,
      trend: "down",
      risk: "high",
      description: "Cold-crank voltage dropping under load",
    },
    {
      name: "Tires",
      score: 77,
      trend: "up",
      risk: "medium",
      description: "Front-right pressure slightly below optimal",
    },
  ];

  const predictions: Prediction[] = [
    {
      id: "pred-1",
      component: "12V Battery",
      confidence: 0.87,
      etaKm: 900,
      etaDays: 14,
      action: "Schedule battery health test",
      severity: "high",
    },
    {
      id: "pred-2",
      component: "Front-right Tire",
      confidence: 0.64,
      etaKm: 450,
      etaDays: 7,
      action: "Rebalance and inflate",
      severity: "medium",
    },
  ];

  return { score: 86, metrics, predictions };
}

export async function fetchAssistantResponse(prompt: string): Promise<ConversationTurn> {
  await wait(350);
  const lower = prompt.toLowerCase();

  const intents = {
    booking: /book|schedule|appointment|slot|reserve/i.test(lower),
    explain: /why|explain|how|reason|what happened|details/i.test(lower),
    confirm: /yes|ok|sure|works|fine|go ahead/i.test(lower),
    urgent: /now|asap|emergency|urgent|immediately/i.test(lower),
    battery: /battery|12v|charge|power/i.test(lower),
    tire: /tire|tyre|pressure|wheel/i.test(lower),
    engine: /engine|heat|coil|temperature/i.test(lower),
    brake: /brake|stopping/i.test(lower),
    trust: /safe|serious|danger|risk/i.test(lower),
  };

  let sentiment: "calm" | "concern" | "urgent" = "calm";
  if (intents.urgent) sentiment = "urgent";
  else if (intents.explain || intents.trust) sentiment = "concern";

  let text = "";

  const timeMatch = lower.match(/(\d{1,2}:\d{2})/);
  const dateMatch = lower.match(/(\d{4}-\d{2}-\d{2})/);
  const keywordTomorrow = /tomorrow/.test(lower);
  const keywordToday = /today/.test(lower);
  const timeSelection = timeMatch ? timeMatch[0] : "14:15";
  const dateSelection = dateMatch ? dateMatch[0] : keywordTomorrow ? "tomorrow" : "today";

  if (intents.battery) memory.lastTopic = "battery";
  if (intents.tire) memory.lastTopic = "tire";
  if (intents.engine) memory.lastTopic = "engine";
  if (intents.booking) memory.lastTopic = "booking";

  if (intents.battery) {
    const userName = getUserName();
    const currentVehicle = getVehicleContext();
    const currentDriver = getDriverProfile();
    text = `
${userName}, I want to be transparent with you.

Your 12V battery voltage drops noticeably when the starter motor engages. 
This usually happens when internal resistance increases due to heat and age.

Based on:
• Your driving pattern (~${currentDriver.avgDailyKm} km/day)
• Local ${currentVehicle.climate} climate
• Battery age (~${currentVehicle.odoKm} km)
• ${currentVehicle.model} (${currentVehicle.year})

there’s an **87% chance** the battery may fail within **14 days or ~900 km**.

👉 This isn’t an emergency yet, but addressing it early avoids sudden no-start situations.
Would you like me to book a quick battery health check?
`.trim();
  }

  else if (intents.tire) {
    text = `
I checked your tire telemetry closely.

Your front-right tire is running **2 PSI below optimal** and shows slight imbalance.
This can cause:
• Faster tread wear
• Reduced braking efficiency
• Mild vibration at highway speeds

A simple **inflation + rebalance** within the next **7 days (≈450 km)** should fully resolve it.
It’s a quick 20-minute fix.
`.trim();
  }

  else if (intents.engine) {
    const currentDriver = getDriverProfile();
    text = `
Good news here.

Your ignition coil temperature is about **8°C above baseline**, which is still within safe limits.
Given your driving style (${currentDriver.drivingStyle}), this is likely due to prolonged city riding.

I’ll keep monitoring it silently.
No action needed right now 👍
`.trim();
  }

  else if (intents.explain) {
    text = `
Here’s how I work, in simple terms:

I don’t wait for parts to fail.
I watch **patterns** — voltage curves, pressure drift, thermal rise — and compare them with thousands of similar vehicles.

When trends start resembling past failures, I alert you *early*.
That’s how we prevent breakdowns instead of reacting to them.
`.trim();
  }

  else if (intents.booking && (intents.confirm || timeMatch || dateMatch || keywordTomorrow || keywordToday)) {
    memory.trustLevel += 0.05;
    
    // Store appointment
    const centerMatch = prompt.match(/Book ([^at]+) at/i);
    const center = centerMatch ? centerMatch[1].trim() : "Pulse AutoCare Downtown";
    const appointment = {
      id: Date.now().toString(),
      center,
      date: dateSelection,
      time: timeSelection,
      status: "confirmed" as const,
      createdAt: new Date().toISOString(),
    };
    
    try {
      const stored = localStorage.getItem("appointments");
      const appointments = stored ? JSON.parse(stored) : [];
      appointments.push(appointment);
      localStorage.setItem("appointments", JSON.stringify(appointments));
    } catch {
      console.warn("Failed to store appointment");
    }
    
    text = `
✓ All set!

Your service is confirmed for **${timeSelection} ${dateSelection}** at **${center}**.
I’ve already shared diagnostics with the technician, so no explanations needed from you.

I’ll remind you an hour before.
Drive safe till then 🚗
`.trim();
  }

  else if (intents.booking) {
    text = `
I’ve found the best options near you:

• **Pulse AutoCare Downtown** – 12 min away ⭐ 4.8  
  Slots: 09:30, 11:00, 14:15  

• **Neon Garage East** – 18 min away ⭐ 4.6  
  Slots: 10:10, 12:45  

Which time feels comfortable for you?
`.trim();
  }

  else if (intents.confirm && memory.lastTopic === "battery") {
    memory.trustLevel += 0.08;
    text = `
Good decision 👍

Early checks usually save both time and money.
I’ll go ahead and schedule the battery test.
Let me know if you prefer today or tomorrow.
`.trim();
  }

  else {
    const userName = getUserName();
    text = `
I'm here with you, ${userName}.

I can:
• Explain any vehicle issue
• Monitor things quietly in the background
• Book service only when it actually makes sense

What would you like to check right now?
`.trim();
  }

  return { role: "assistant", text, sentiment };
}

export async function fetchServiceOptions(): Promise<ServiceSlot[]> {
  await wait(220);
  return [
    {
      center: "Pulse AutoCare Downtown",
      etaMinutes: 12,
      rating: 4.8,
      badge: "OEM Certified",
      slots: ["09:30", "11:00", "14:15", "16:40"],
    },
    {
      center: "Neon Garage East",
      etaMinutes: 18,
      rating: 4.6,
      badge: "EV Specialist",
      slots: ["10:10", "12:45", "15:20"],
    },
    {
      center: "Astra Motors Lab",
      etaMinutes: 22,
      rating: 4.9,
      badge: "Diagnostics Lab",
      slots: ["08:50", "13:05", "17:00"],
    },
  ];
}

export async function fetchServiceStatus(): Promise<TimelineItem[]> {
  await wait(180);
  return [
    {
      label: "Vehicle received",
      status: "done",
      detail: "Telemetry synced, health baseline captured",
    },
    {
      label: "Diagnostics running",
      status: "active",
      detail: "Thermal + vibration analysis in progress",
    },
    {
      label: "Parts check",
      status: "pending",
      detail: "Sourcing OEM battery module options",
    },
    {
      label: "Ready for pickup",
      status: "pending",
      detail: "Waiting for your go/no-go",
    },
  ];
}

export async function fetchOemInsights() {
  await wait(200);
  return {
    topIssues: [
      { component: "Battery", count: 342, delta: 8 },
      { component: "Brake sensor", count: 188, delta: -3 },
      { component: "HVAC", count: 127, delta: 5 },
    ],
    geoHeat: [
      { region: "Pacific", incidents: 132 },
      { region: "Central", incidents: 88 },
      { region: "Atlantic", incidents: 164 },
    ],
    capa: [
      "Trigger firmware patch for battery thermal controller",
      "Update supplier QA on brake sensor batch 22G",
      "Refine HVAC moisture control thresholds",
    ],
  };
}
