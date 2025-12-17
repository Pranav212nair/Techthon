interface Props {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ButtonAction({ label, onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-full bg-panel px-4 py-2 text-slate-200 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:ring-accent-300/60 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
}
