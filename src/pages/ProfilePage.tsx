import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/motionPresets";
import { User, Mail, Shield, Edit2, Save, X, LogOut, Car } from "lucide-react";

interface AuthData {
  name: string;
  email: string;
  password: string;
}

function ProfilePage() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    try {
      const auth = localStorage.getItem("vigil_auth");
      if (auth) {
        const data = JSON.parse(auth);
        setAuthData(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          currentPassword: "",
          newPassword: "",
        });
      } else {
        navigate("/login");
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const handleSave = () => {
    if (!authData) return;

    // Validate current password if changing password
    if (formData.newPassword && formData.currentPassword !== authData.password) {
      alert("Current password is incorrect");
      return;
    }

    const updated = {
      ...authData,
      name: formData.name,
      email: formData.email,
      password: formData.newPassword || authData.password,
    };

    localStorage.setItem("vigil_auth", JSON.stringify(updated));
    setAuthData(updated);
    setEditing(false);
    setFormData({ ...formData, currentPassword: "", newPassword: "" });
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    if (authData) {
      setFormData({
        name: authData.name,
        email: authData.email,
        currentPassword: "",
        newPassword: "",
      });
    }
    setEditing(false);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("vigil_auth");
      localStorage.removeItem("onboarding");
      localStorage.removeItem("appointments");
      navigate("/login");
    }
  };

  const getStats = () => {
    try {
      const onboarding = localStorage.getItem("onboarding");
      const appointments = localStorage.getItem("appointments");
      
      const onboardingData = onboarding ? JSON.parse(onboarding) : null;
      const appointmentsData = appointments ? JSON.parse(appointments) : [];

      return {
        vehicle: onboardingData?.vehicleMake && onboardingData?.vehicleModel
          ? `${onboardingData.vehicleMake} ${onboardingData.vehicleModel}`
          : "Not registered",
        vehicleType: onboardingData?.vehicleType || "—",
        odometer: onboardingData?.odometer ? `${parseInt(onboardingData.odometer).toLocaleString()} km` : "—",
        role: onboardingData?.role || "—",
        totalBookings: appointmentsData.length,
        activeBookings: appointmentsData.filter((a: any) => a.status === "confirmed").length,
      };
    } catch {
      return {
        vehicle: "Not registered",
        vehicleType: "—",
        odometer: "—",
        role: "—",
        totalBookings: 0,
        activeBookings: 0,
      };
    }
  };

  const stats = getStats();

  if (!authData) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-accent-200">Your Account</p>
        <h1 className="text-3xl font-semibold text-white">Profile Settings</h1>
      </div>

      {/* Profile Info Card */}
      <motion.div
        {...fadeInUp}
        className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Personal Information</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 rounded-full bg-accent-500/20 px-4 py-2 text-sm text-accent-200 ring-1 ring-accent-500/30 transition hover:bg-accent-500/30"
            >
              <Edit2 className="h-4 w-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-accent-300/50 hover:text-white"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-surface shadow-neon transition hover:bg-accent-400"
              >
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-accent-500/20 p-3">
              <User className="h-6 w-6 text-accent-200" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400">Full Name</p>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-panel/80 px-3 py-2 text-white focus:outline focus:outline-accent-400"
                />
              ) : (
                <p className="mt-1 text-lg font-medium text-white">{authData.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-full bg-accent-500/20 p-3">
              <Mail className="h-6 w-6 text-accent-200" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400">Email Address</p>
              {editing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-panel/80 px-3 py-2 text-white focus:outline focus:outline-accent-400"
                />
              ) : (
                <p className="mt-1 text-lg font-medium text-white">{authData.email}</p>
              )}
            </div>
          </div>

          {editing && (
            <>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-accent-500/20 p-3">
                  <Shield className="h-6 w-6 text-accent-200" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400">Current Password</p>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    placeholder="Enter current password to change it"
                    className="mt-1 w-full rounded-xl bg-panel/80 px-3 py-2 text-white placeholder-slate-500 focus:outline focus:outline-accent-400"
                  />
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-accent-500/20 p-3">
                  <Shield className="h-6 w-6 text-accent-200" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400">New Password</p>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="Leave blank to keep current password"
                    className="mt-1 w-full rounded-xl bg-panel/80 px-3 py-2 text-white placeholder-slate-500 focus:outline focus:outline-accent-400"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Account Stats */}
      <motion.div
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.1 }}
        className="glass-panel rounded-3xl border border-white/5 p-6 shadow-glow"
      >
        <h2 className="mb-4 text-xl font-semibold text-white">Account Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-panel/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
              <Car className="h-4 w-4" /> Registered Vehicle
            </div>
            <p className="text-lg font-semibold text-white">{stats.vehicle}</p>
            <p className="text-xs text-slate-400">{stats.vehicleType}</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-panel/70 p-4">
            <div className="mb-2 text-sm text-slate-400">Current Odometer</div>
            <p className="text-lg font-semibold text-white">{stats.odometer}</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-panel/70 p-4">
            <div className="mb-2 text-sm text-slate-400">User Role</div>
            <p className="text-lg font-semibold text-white">{stats.role}</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-panel/70 p-4">
            <div className="mb-2 text-sm text-slate-400">Total Bookings</div>
            <p className="text-lg font-semibold text-white">{stats.totalBookings}</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-panel/70 p-4">
            <div className="mb-2 text-sm text-slate-400">Active Bookings</div>
            <p className="text-lg font-semibold text-accent-200">{stats.activeBookings}</p>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.15 }}
        className="glass-panel rounded-3xl border border-danger/30 bg-danger/5 p-6 shadow-glow"
      >
        <h2 className="mb-4 text-xl font-semibold text-white">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white">Log Out</p>
            <p className="text-sm text-slate-400">Sign out of your VIGIL account</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-danger/30 bg-danger/10 px-4 py-2 text-sm font-medium text-danger transition hover:bg-danger/20"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ProfilePage;
