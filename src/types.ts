export type VehicleSubsystem = "engine" | "brakes" | "battery" | "tires";

export interface HealthMetric {
  name: string;
  score: number;
  trend: "up" | "down" | "steady";
  risk: "low" | "medium" | "high";
  description: string;
}

export interface Prediction {
  id: string;
  component: string;
  confidence: number;
  etaKm: number;
  etaDays: number;
  action: string;
  severity: "low" | "medium" | "high";
}

export interface ConversationTurn {
  role: "user" | "assistant";
  text: string;
  sentiment?: "calm" | "concern" | "urgent";
}

export interface ServiceSlot {
  center: string;
  etaMinutes: number;
  rating: number;
  badge: string;
  slots: string[];
}

export interface TimelineItem {
  label: string;
  status: "pending" | "active" | "done";
  detail: string;
}

export type DriverProfile = {
  name: string;
  drivingStyle: "calm" | "moderate" | "aggressive";
  avgDailyKm: number;
  preferredTone: "friendly" | "professional";
  lastServiceKm: number;
};

export type VehicleContext = {
  model: string;
  year: number;
  odoKm: number;
  climate: "hot" | "cold" | "humid" | "mixed";
};

export type AssistantMemory = {
  lastTopic?: "battery" | "tire" | "engine" | "booking";
  lastRecommendation?: string;
  trustLevel: number;
};

export interface Appointment {
  id: string;
  center: string;
  date: string;
  time: string;
  status: "confirmed" | "completed" | "cancelled";
  createdAt: string;
}
