import React, { useEffect, useState } from "react";
import logo from "../../../app/askquery-logo.svg";

// Shown for a brief moment right after a successful login/register,
// before navigating to the dashboard — gives the handoff a deliberate,
// branded feel instead of an abrupt route swap.
export function LoginTransition({ onComplete }) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), 900);
    const doneTimer = setTimeout(() => onComplete(), 1200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#050505] transition-opacity duration-300 ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background — matches the dashboard/auth radial gradient + red glow accents */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-40 left-0 h-96 w-96 rounded-full bg-red-700/5 blur-[160px]" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-red-700/5 blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#141414_0%,#090909_45%,#050505_100%)]" />
      </div>

      <div className="relative flex flex-col items-center">
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full bg-red-700/20 blur-2xl" />

        <img
          src={logo}
          alt="AskQuery"
          className="relative h-16 w-16 animate-logo-in object-contain sm:h-20 sm:w-20"
        />

        <h1 className="relative mt-4 animate-text-in text-xl font-bold tracking-wide text-white opacity-0 sm:text-2xl">
          Ask<span className="text-red-400">Query</span>
        </h1>
      </div>
    </div>
  );
}

export default LoginTransition;
