import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import AssistantPage from "./pages/AssistantPage";
import ServicePage from "./pages/ServicePage";
import ServiceStatusPage from "./pages/ServiceStatusPage";
import OemPage from "./pages/OemPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import VehicleProfilePage from "./pages/VehicleProfilePage";
import ProfilePage from "./pages/ProfilePage";
import ServiceHistoryPage from "./pages/ServiceHistoryPage";
import NotificationsPage from "./pages/NotificationsPage";
import AnalyticsPage from "./pages/AnalyticsPage";

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-surface text-slate-50 wave-bg">
        <div className="fixed inset-0 pointer-events-none opacity-50 bg-mesh" aria-hidden />
        <Navbar />
        <main className="relative z-10 px-4 pb-16 pt-6 sm:px-8 lg:px-12">
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/service/status" element={<ServiceStatusPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/vehicle" element={<VehicleProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<ServiceHistoryPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/oem" element={<OemPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
