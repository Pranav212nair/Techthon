import { useEffect, useState } from "react";

export interface OnboardingData {
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

export function useOnboarding() {
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("onboarding");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        console.warn("Failed to parse onboarding data");
      }
    }
    setLoading(false);
  }, []);

  const clearOnboarding = () => {
    localStorage.removeItem("onboarding");
    setData(null);
  };

  return { data, loading, clearOnboarding };
}
