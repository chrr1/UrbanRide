"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, MapPinOff, RefreshCw, CheckCircle2, X } from "lucide-react";

export function SkeletonLoader() {
  return (
    <div className="floating-card p-5 w-full bg-white space-y-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded-full w-1/3" />
      <div className="h-10 bg-gray-200 rounded-2xl w-full" />
      <div className="h-10 bg-gray-200 rounded-2xl w-full" />
      <div className="h-12 bg-gray-300 rounded-full w-full mt-4" />
    </div>
  );
}

export function EmptyState({
  title = "No routes found",
  message = "We couldn't find a route matching your criteria. Try changing destination or clearing filters.",
  buttonText = "Reset Filter / Cari Ulang",
  onReset,
}: {
  title?: string;
  message?: string;
  buttonText?: string;
  onReset: () => void;
}) {
  return (
    <div
      className="p-6 w-full rounded-2xl text-center space-y-3 border"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 flex items-center justify-center mx-auto">
        <MapPinOff className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold font-display" style={{ color: "var(--foreground)" }}>
        {title}
      </h3>
      <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
        {message}
      </p>
      <button
        onClick={onReset}
        className="py-2.5 px-4 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-xl shadow-md hover:opacity-90 active:scale-95 transition cursor-pointer"
      >
        {buttonText}
      </button>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="p-6 w-full rounded-2xl text-center space-y-3 border"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold font-display" style={{ color: "var(--foreground)" }}>
        Something went wrong
      </h3>
      <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
        We couldn't load the transit route updates. Please check your connection.
      </p>
      <button
        onClick={onRetry}
        className="py-2.5 px-4 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition inline-flex items-center space-x-1.5 cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Try Again</span>
      </button>
    </div>
  );
}

const TOAST_DURATION = 5000; // ms

export function SuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Progress bar — tick every 50ms
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / TOAST_DURATION) * 100);
      setProgress(remaining);
      if (elapsed >= TOAST_DURATION) {
        clearInterval(interval);
        setVisible(false);
        setTimeout(onClose, 300); // wait for exit animation
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onClose]);

  return (
    <div
      className={`fixed top-20 right-5 z-50 w-72 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      style={{ background: "#111111" }}
    >
      {/* Content row */}
      <div className="flex items-center space-x-3 px-4 py-3.5">
        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "var(--accent-cyber-lime)" }} />
        <span className="text-xs font-semibold text-white flex-1 leading-snug">{message}</span>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="p-1 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition shrink-0"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress bar — depletes left to right over 5s */}
      <div className="h-0.5 bg-gray-800 w-full">
        <div
          className="h-full transition-none"
          style={{ width: `${progress}%`, background: "var(--accent-cyber-lime)" }}
        />
      </div>
    </div>
  );
}

