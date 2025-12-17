import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/motionPresets";
import { Lock, Mail, User, ArrowRight, Shield, Flame } from "lucide-react";

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "signup" && !formData.name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!formData.email.trim()) {
      alert("Please enter your email");
      return;
    }
    if (!formData.password.trim()) {
      alert("Please enter your password");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Store auth data
    const authData = {
      name: formData.name || formData.email.split("@")[0],
      email: formData.email,
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
    };
    
    localStorage.setItem("vigil_auth", JSON.stringify(authData));
    
    // Redirect to onboarding or dashboard
    const hasOnboarding = localStorage.getItem("onboarding");
    if (hasOnboarding) {
      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
      <motion.div
        {...fadeInUp}
        className="glass-panel w-full max-w-md rounded-3xl border border-white/5 p-8 shadow-glow"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-glow shadow-neon">
            <Flame className="h-8 w-8 text-surface" />
          </div>
          <h1 className="text-3xl font-semibold text-white">
            {mode === "login" ? "Welcome Back" : "Join VIGIL"}
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            {mode === "login"
              ? "Sign in to access your vehicle insights"
              : "Create an account to get started"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-sm text-slate-300">
                <User className="h-4 w-4" /> Your Name
              </span>
              <input
                type="text"
                className="w-full rounded-xl bg-panel/80 px-4 py-3 text-white placeholder-slate-500 outline-none ring-1 ring-white/10 transition focus:ring-accent-400/60"
                placeholder="Pranav Nair"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1 flex items-center gap-2 text-sm text-slate-300">
              <Mail className="h-4 w-4" /> Email Address
            </span>
            <input
              type="email"
              className="w-full rounded-xl bg-panel/80 px-4 py-3 text-white placeholder-slate-500 outline-none ring-1 ring-white/10 transition focus:ring-accent-400/60"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="mb-1 flex items-center gap-2 text-sm text-slate-300">
              <Lock className="h-4 w-4" /> Password
            </span>
            <input
              type="password"
              className="w-full rounded-xl bg-panel/80 px-4 py-3 text-white placeholder-slate-500 outline-none ring-1 ring-white/10 transition focus:ring-accent-400/60"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </label>

          {mode === "login" && (
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-300">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <button type="button" className="text-accent-300 hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 to-glow px-4 py-3 font-semibold text-surface shadow-neon transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? (
              "Please wait..."
            ) : (
              <>
                {mode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-slate-400">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="ml-2 font-semibold text-accent-300 hover:underline"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Shield className="h-3 w-3 text-accent-300" />
          <span>Secured with 256-bit encryption</span>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
