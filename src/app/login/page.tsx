import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Login & Register - UrbanRide",
  description: "Sign in or create an account for UrbanRide Smart City Transit Platform.",
};

export default function LoginPage() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6"
      style={{
        background: `
          radial-gradient(circle at 50% 0%, rgba(224, 231, 255, 0.7) 0%, rgba(243, 244, 246, 0.4) 60%),
          #F0EEF8
        `,
      }}
    >
      {/* The Centered Auth Card */}
      <AuthCard initialMode="login" />
    </div>
  );
}
