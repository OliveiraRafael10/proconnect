import { useEffect, useState } from "react";
import { useLoading } from "../../context/LoadingContext";

function TechyBackdrop() {
  return (
    <>
      <div className="absolute -inset-32 bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.35),_transparent_55%)] animate-loading-pulse" />
      <div
        className="absolute -inset-24 bg-[radial-gradient(circle_at_bottom,_rgba(14,165,233,0.25),_transparent_60%)] animate-loading-pulse"
        style={{ animationDelay: "180ms" }}
      />
    </>
  );
}

function LoadingOrbit() {
  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <span className="absolute inset-0 rounded-full border border-white/10" />
      <span className="absolute inset-2 rounded-full border border-white/5" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent">
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 border-l-blue-500 animate-spin-slow" />
        <div className="absolute inset-4 rounded-full border border-white/20" />
        <div className="absolute inset-6 rounded-full border border-transparent border-b-cyan-400 animate-spin-reverse" />
      </div>
      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-sky-400/60 via-cyan-300/70 to-blue-500/60 backdrop-blur-sm shadow-[0_0_30px_rgba(14,165,233,0.5)] animate-ping-soft" />
    </div>
  );
}

function LoadingMessage({ title, message }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center text-white">
      <h2 className="text-lg font-semibold uppercase tracking-[0.35em] text-white/80">{title}</h2>
      <p className="max-w-xs text-sm text-white/70">{message}</p>
    </div>
  );
}

function LoadingOverlay() {
  const { isLoading, activeOptions, loadingCount } = useLoading();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      return undefined;
    }

    const timeout = setTimeout(() => setVisible(false), 200);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (!isLoading && !visible) {
    return null;
  }

  const title = activeOptions?.title || "conectando";
  const message =
    activeOptions?.message ||
    "Estamos sincronizando seus dados com o ProConect. Isso leva apenas alguns instantes.";

  const displayCount = loadingCount || 1;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-lg transition-opacity duration-200 ${
        isLoading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-live="assertive"
      aria-busy={isLoading}
      role="alert"
    >
      <div className="relative flex w-full max-w-sm flex-col items-center gap-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 px-10 py-12 shadow-[0_20px_70px_-20px_rgba(15,118,110,0.75)]">
        <TechyBackdrop />
        <LoadingOrbit />
        <LoadingMessage title={title} message={message} />
        <span className="text-xs uppercase tracking-[0.4em] text-white/40">{`processos ativos ${String(
          displayCount,
        ).padStart(2, "0")}`}</span>
      </div>
    </div>
  );
}

export default LoadingOverlay;
