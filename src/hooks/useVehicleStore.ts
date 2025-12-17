import { create } from "zustand";
import {
  ConversationTurn,
  HealthMetric,
  Prediction,
  ServiceSlot,
  TimelineItem,
} from "../types";
import {
  fetchAssistantResponse,
  fetchOemInsights,
  fetchServiceOptions,
  fetchServiceStatus,
  fetchVehicleHealth,
} from "../services/api";

interface VehicleState {
  loading: boolean;
  score: number;
  metrics: HealthMetric[];
  predictions: Prediction[];
  conversation: ConversationTurn[];
  serviceSlots: ServiceSlot[];
  serviceTimeline: TimelineItem[];
  oemInsights: Awaited<ReturnType<typeof fetchOemInsights>> | null;
  loadDashboard: () => Promise<void>;
  sendPrompt: (prompt: string) => Promise<void>;
  loadService: () => Promise<void>;
  loadServiceStatus: () => Promise<void>;
  loadOem: () => Promise<void>;
}

export const useVehicleStore = create<VehicleState>((set) => ({
  loading: false,
  score: 0,
  metrics: [],
  predictions: [],
  conversation: [
    {
      role: "assistant",
      text: "I monitor your vehicle quietly and speak up before issues grow. How can I help?",
      sentiment: "calm",
    },
  ],
  serviceSlots: [],
  serviceTimeline: [],
  oemInsights: null,
  loadDashboard: async () => {
    set({ loading: true });
    const data = await fetchVehicleHealth();
    set({
      loading: false,
      score: data.score,
      metrics: data.metrics,
      predictions: data.predictions,
    });
  },
  sendPrompt: async (prompt: string) => {
    if (!prompt.trim()) return;
    set((state) => ({
      conversation: [...state.conversation, { role: "user", text: prompt }],
    }));
    const reply = await fetchAssistantResponse(prompt);
    set((state) => ({ conversation: [...state.conversation, reply] }));
  },
  loadService: async () => {
    set({ loading: true });
    const serviceSlots = await fetchServiceOptions();
    set({ serviceSlots, loading: false });
  },
  loadServiceStatus: async () => {
    set({ loading: true });
    const serviceTimeline = await fetchServiceStatus();
    set({ serviceTimeline, loading: false });
  },
  loadOem: async () => {
    const oemInsights = await fetchOemInsights();
    set({ oemInsights });
  },
}));

export const useMetrics = () => {
  const { score, metrics, predictions, loadDashboard, loading } = useVehicleStore();
  return { score, metrics, predictions, loadDashboard, loading };
};

export const useAssistant = () => {
  const { conversation, sendPrompt } = useVehicleStore();
  return { conversation, sendPrompt };
};

export const useService = () => {
  const { serviceSlots, loadService, loading } = useVehicleStore();
  return { serviceSlots, loadService, loading };
};

export const useServiceStatus = () => {
  const { serviceTimeline, loadServiceStatus, loading } = useVehicleStore();
  return { serviceTimeline, loadServiceStatus, loading };
};

export const useOem = () => {
  const { oemInsights, loadOem } = useVehicleStore();
  return { oemInsights, loadOem };
};
