"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const eclipseRef = useRef<HTMLDivElement>(null);

  // Evita hidratação incorreta
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Get button position
    const button = buttonRef.current;
    const eclipse = eclipseRef.current;

    if (button && eclipse) {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Position eclipse at button center
      eclipse.style.left = `${centerX}px`;
      eclipse.style.top = `${centerY}px`;
      eclipse.style.transform = "translate(-50%, -50%) scale(0)";

      // Apply colors and shadows based on current theme
      const isDark = resolvedTheme === "dark";
      eclipse.style.background = isDark 
        ? "linear-gradient(to bottom right, rgba(219, 234, 254, 0.6), rgba(224, 231, 255, 0.6))" 
        : "rgba(17, 24, 39, 0.6)";
      eclipse.style.boxShadow = isDark 
        ? "0 0 100px 50px rgba(219, 234, 254, 0.15)" 
        : "0 0 100px 50px rgba(17, 24, 39, 0.15)";
      eclipse.style.opacity = "1";

      // Start animation
      eclipse.classList.add("animate-eclipse");

      // Change theme after animation starts
      setTimeout(() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }, 200);

      // Reset animation
      setTimeout(() => {
        eclipse.classList.remove("animate-eclipse");
        eclipse.style.opacity = "0";
        eclipse.style.transform = "translate(-50%, -50%) scale(0)";
        setIsAnimating(false);
      }, 600);
    }
  };

  // Não renderiza nada até estar montado no cliente
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-600 hover:text-gray-900 hover:bg-orange-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700/50"
      >
        <div className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <>
      {/* Eclipse Animation Overlay - Hidden by default */}
      <div
        ref={eclipseRef}
        className="fixed w-8 h-8 rounded-full pointer-events-none z-50 opacity-0"
        style={{
          transform: "translate(-50%, -50%) scale(0)",
        }}
      />

      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        disabled={isAnimating}
        className={`text-gray-600 hover:text-gray-900 hover:bg-orange-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700/50 transition-all duration-300 ${
          isAnimating ? "scale-95" : ""
        }`}
      >
        {resolvedTheme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </Button>
    </>
  );
}
