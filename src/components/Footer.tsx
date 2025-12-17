function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-400 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
        <p>VIGIL – Empathy-driven automotive health.</p>
        <div className="flex flex-wrap gap-3 text-slate-300">
          <span>Live simulation</span>
          <span>Predict → Converse → Act</span>
          <span>EY Techathon 6.0</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
