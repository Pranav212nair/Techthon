import { Link, NavLink, useLocation } from "react-router-dom";
import { Flame, Waves, Bot, LogOut } from "lucide-react";
import { useOnboarding } from "../hooks/useOnboarding";

const links = [
  { to: "/", label: "Vision" },
  { to: "/dashboard", label: "Health" },
  { to: "/assistant", label: "Assistant" },
  { to: "/analytics", label: "Analytics" },
  { to: "/service", label: "Service" },
  { to: "/appointments", label: "Bookings" },
  { to: "/vehicle", label: "Vehicle" },
  { to: "/history", label: "History" },
];

function Navbar() {
  const location = useLocation();
  const { data: onboardingData, clearOnboarding } = useOnboarding();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-surface/70 border-b border-white/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-xl text-white">
          <Flame className="h-5 w-5 text-accent-300" /> VIGIL
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          {links.map((link) => {
            const isActive =
              link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`transition-all hover:text-white ${
                  isActive
                    ? "text-white underline decoration-accent-300 decoration-2 underline-offset-8"
                    : "text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <Link
            to="/assistant"
            className="hidden items-center gap-2 rounded-full border border-accent-500/40 bg-panel px-4 py-2 text-slate-200 shadow-neon transition hover:-translate-y-0.5 hover:border-accent-300/70 hover:text-white md:flex"
          >
            <Waves className="h-4 w-4 text-accent-200" /> Voice
          </Link>
          {onboardingData ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="hidden flex-col items-end text-xs transition hover:opacity-80 sm:flex"
              >
                <span className="font-semibold text-white">{onboardingData.email}</span>
                <span className="text-slate-400">{onboardingData.role}</span>
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-full bg-panel px-3 py-2 text-slate-300 transition hover:bg-accent-500/20 hover:text-accent-200"
                title="Profile"
              >
                <Bot className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-500 to-glow px-4 py-2 text-surface font-semibold shadow-neon transition hover:-translate-y-0.5"
            >
              <Bot className="h-4 w-4" /> Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
