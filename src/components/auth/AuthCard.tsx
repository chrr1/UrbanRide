"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthCardProps {
  initialMode?: "login" | "register";
  onSuccess?: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export default function AuthCard({
  initialMode = "login",
  onSuccess,
  isModal = false,
  onClose,
}: AuthCardProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [contentMode, setContentMode] = useState<"login" | "register">(initialMode);
  const [isFading, setIsFading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isRegister = mode === "register";
  const isRegisterContent = contentMode === "register";

  const handleToggleMode = (newMode: "login" | "register") => {
    if (newMode === mode) return;
    setIsFading(true);
    setMode(newMode);

    if (typeof window !== "undefined") {
      const newPath = newMode === "register" ? "/register" : "/login";
      window.history.replaceState(null, "", newPath);
    }

    // Smoothly dissolve & swap text halfway through the physical slide (at 220ms)
    setTimeout(() => {
      setContentMode(newMode);
      setIsFading(false);
    }, 220);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      login(`${provider.toLowerCase()}@urbanride.id`, `${provider} Rider`);
      setIsLoading(false);
      if (onSuccess) {
        onSuccess();
      } else {
        const redirectUrl = sessionStorage.getItem("urbanride-redirect") || "/";
        sessionStorage.removeItem("urbanride-redirect");
        router.push(redirectUrl);
      }
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const userEnteredEmail = email.trim() || "chrs@gmail.com";
      let userEnteredName = fullName.trim();
      if (!userEnteredName) {
        const usernamePart = userEnteredEmail.split("@")[0];
        userEnteredName = usernamePart.charAt(0).toUpperCase() + usernamePart.slice(1);
      }
      login(userEnteredEmail, userEnteredName);
      setIsLoading(false);
      if (onSuccess) {
        onSuccess();
      } else {
        const redirectUrl = sessionStorage.getItem("urbanride-redirect") || "/";
        sessionStorage.removeItem("urbanride-redirect");
        router.push(redirectUrl);
      }
    }, 500);
  };

  return (
    <div className="relative w-full max-w-[960px] mx-auto bg-white rounded-[32px] p-4 sm:p-5 shadow-[0_30px_70px_-15px_rgba(79,70,229,0.18),0_10px_25px_-5px_rgba(0,0,0,0.06)] border border-gray-100 transition-all overflow-hidden">
      {/* Optional Close Button for Modal */}
      {isModal && onClose && (
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-30 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition cursor-pointer"
        >
          ✕
        </button>
      )}

      {/* Grid Wrapper for Two 50% Panels */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch w-full min-h-[530px]">
        
        {/* === SLIDING PANEL 1: Aurora Visual Artwork Banner (50%) === */}
        {/* Physically slides left ⇄ right with 0.75s cubic-bezier curve */}
        <div
          className={`auth-panel-aurora ${isRegister ? "is-register" : "is-login"} relative rounded-[24px] overflow-hidden min-h-[340px] md:min-h-[530px] p-7 sm:p-9 flex flex-col justify-between shadow-inner w-full z-20`}
          style={{
            background: `
              radial-gradient(circle at 100% 100%, rgba(245, 243, 255, 0.75) 0%, rgba(232, 237, 255, 0.5) 18%, rgba(199, 210, 254, 0.2) 36%, transparent 52%),
              radial-gradient(circle at 14% 16%, #93C5FD 0%, #3B82F6 30%, transparent 55%),
              radial-gradient(circle at 86% 16%, #E9D5FF 0%, #C084FC 32%, #818CF8 52%, transparent 68%),
              radial-gradient(circle at 18% 85%, #0B1120 0%, #172554 45%, #1E40AF 75%, transparent 92%),
              linear-gradient(140deg, #1D4ED8 0%, #2563EB 25%, #4338CA 55%, #6D28D9 80%, #C4B5FD 100%)
            `,
            transform: isDesktop
              ? isRegister
                ? "translateX(calc(100% + 1.5rem))"
                : "translateX(0px)"
              : "none",
            transition: "transform 0.75s cubic-bezier(0.65, 0, 0.35, 1)",
            willChange: "transform",
          }}
        >
          {/* Top Brand Spark Icon */}
          <div className="relative z-10">
            <div className="w-9 h-9 text-white">
              {/* 8-pointed star / asterisk matching reference */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5v4.5l3.18-3.18a1.5 1.5 0 1 1 2.12 2.12L15.62 10.12h4.88a1.5 1.5 0 0 1 0 3h-4.88l3.18 3.18a1.5 1.5 0 1 1-2.12 2.12L13.5 15.24v4.26a1.5 1.5 0 0 1-3 0v-4.26l-3.18 3.18a1.5 1.5 0 1 1-2.12-2.12l3.18-3.18H3.5a1.5 1.5 0 0 1 0-3h4.88l-3.18-3.18a1.5 1.5 0 1 1 2.12-2.12L10.5 8v-4.5A1.5 1.5 0 0 1 12 2z" />
              </svg>
            </div>
          </div>

          {/* Bottom Heading & Copy with Mid-Slide Soft Dissolve */}
          <div
            className="relative z-10 space-y-2 mt-auto pt-16 max-w-[290px]"
            style={{
              opacity: isFading ? 0 : 1,
              transition: "opacity 0.22s ease-in-out",
            }}
          >
            <p className="text-xs sm:text-sm font-medium text-white/90 tracking-wide drop-shadow-xs">
              {isRegisterContent ? "Start your journey" : "You can easily"}
            </p>
            <h2 className="text-2xl sm:text-[28px] font-bold font-display text-white leading-snug tracking-tight drop-shadow-sm">
              {isRegisterContent
                ? "Join UrbanRide for smart city transit and live navigation"
                : "Get access your personal hub for clarity and productivity"}
            </h2>
          </div>
        </div>

        {/* === SLIDING PANEL 2: Form Area (50%) === */}
        {/* Physically slides right ⇄ left with 0.75s cubic-bezier curve */}
        <div
          className={`auth-panel-form ${isRegister ? "is-register" : "is-login"} p-4 sm:px-6 sm:py-6 lg:px-8 flex flex-col justify-center w-full z-10`}
          style={{
            transform: isDesktop
              ? isRegister
                ? "translateX(calc(-100% - 1.5rem))"
                : "translateX(0px)"
              : "none",
            transition: "transform 0.75s cubic-bezier(0.65, 0, 0.35, 1)",
            willChange: "transform",
          }}
        >
          {/* Inner Content with Mid-Slide Soft Dissolve */}
          <div
            style={{
              opacity: isFading ? 0 : 1,
              transition: "opacity 0.22s ease-in-out",
            }}
          >
            {/* Asterisk Spark Brand Icon in Form Header */}
            <div className="mb-3 text-indigo-600">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5v4.5l3.18-3.18a1.5 1.5 0 1 1 2.12 2.12L15.62 10.12h4.88a1.5 1.5 0 0 1 0 3h-4.88l3.18 3.18a1.5 1.5 0 1 1-2.12 2.12L13.5 15.24v4.26a1.5 1.5 0 0 1-3 0v-4.26l-3.18 3.18a1.5 1.5 0 1 1-2.12-2.12l3.18-3.18H3.5a1.5 1.5 0 0 1 0-3h4.88l-3.18-3.18a1.5 1.5 0 1 1 2.12-2.12L10.5 8v-4.5A1.5 1.5 0 0 1 12 2z" />
              </svg>
            </div>

            {/* Form Header Title */}
            <div>
              <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 font-display tracking-tight leading-tight">
                {isRegisterContent ? "Create an account" : "Welcome back"}
              </h1>
              <p className="text-xs sm:text-[13px] text-gray-500 mt-1.5 leading-relaxed">
                {isRegisterContent
                  ? "Access your tasks, notes, and projects anytime, anywhere - and keep everything flowing in one place."
                  : "Sign in to access your saved transit tickets, recent journeys, and smart city services."}
              </p>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
              
              {/* Full Name in Register Mode */}
              {isRegisterContent && (
                <div>
                  <label className="text-xs font-semibold text-gray-800 mb-1.5 block">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition bg-white"
                  />
                </div>
              )}

              {/* Email / Username Input */}
              <div>
                <label className="text-xs font-semibold text-gray-800 mb-1.5 block">
                  Email or username
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chrs@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition bg-white"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="text-xs font-semibold text-gray-800 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-[0_10px_25px_-5px_rgba(79,70,229,0.5)] transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>{isRegisterContent ? "Get Started" : "Sign In"}</span>
                )}
              </button>
            </form>

            {/* Decorative Compact Social Divider with End Dots matching reference */}
            <div className="my-4 flex items-center justify-center space-x-2.5 max-w-[260px] mx-auto w-full">
              {/* Left Dot + Line */}
              <div className="flex items-center flex-1">
                <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                <div className="flex-1 border-t border-gray-200" />
              </div>

              {/* Center Text */}
              <span className="text-[11px] font-medium text-gray-400 shrink-0 select-none">
                or continue with
              </span>

              {/* Right Line + Dot */}
              <div className="flex items-center flex-1">
                <div className="flex-1 border-t border-gray-200" />
                <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
              </div>
            </div>

            {/* 3 Social Buttons (Behance, Google, Facebook) */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Behance */}
              <button
                type="button"
                onClick={() => handleSocialLogin("Behance")}
                className="h-10 rounded-xl bg-gray-100/90 hover:bg-gray-200/80 transition flex items-center justify-center cursor-pointer border border-gray-200/60 font-black text-sm text-gray-700 active:scale-95"
                title="Continue with Behance"
              >
                <span className="tracking-tighter">Bē</span>
              </button>

              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="h-10 rounded-xl bg-gray-100/90 hover:bg-gray-200/80 transition flex items-center justify-center cursor-pointer border border-gray-200/60 active:scale-95"
                title="Continue with Google"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => handleSocialLogin("Facebook")}
                className="h-10 rounded-xl bg-gray-100/90 hover:bg-gray-200/80 transition flex items-center justify-center cursor-pointer border border-gray-200/60 font-black text-sm text-[#1877F2] active:scale-95"
                title="Continue with Facebook"
              >
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>

            {/* Bottom Switcher */}
            <div className="mt-4 text-center">
              {isRegisterContent ? (
                <p className="text-xs text-gray-500 font-medium">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleToggleMode("login")}
                    className="font-bold text-indigo-600 hover:text-indigo-700 transition cursor-pointer underline-offset-2 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <p className="text-xs text-gray-500 font-medium">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleToggleMode("register")}
                    className="font-bold text-indigo-600 hover:text-indigo-700 transition cursor-pointer underline-offset-2 hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
