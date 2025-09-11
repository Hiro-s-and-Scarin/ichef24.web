"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChefHat, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: "/", label: t("header.home") },
    { href: "/history", label: t("header.history") },
    { href: "/my-recipe-book", label: "Minhas Receitas" },
    { href: "/plans", label: t("header.plans") },
  ];

  return (
    <header className="border-b border-gray-700/20 backdrop-blur-sm bg-black/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#f54703] to-[#ff7518] rounded-xl flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">iChef24</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  pathname === item.href
                    ? "text-[#ff7518]"
                    : "text-gray-300 hover:text-[#ff7518]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-700/50"
              asChild
            >
              <Link href="/">Entrar</Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-[#f54703] to-[#ff7518] hover:from-[#ff7518] hover:to-[#f54703] text-white border-0"
              asChild
            >
              <Link href="/plans">Começar Grátis</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-700/20 pt-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors ${
                    pathname === item.href
                      ? "text-[#ff7518]"
                      : "text-gray-300 hover:text-[#ff7518]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-700/20">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-gray-700/50 justify-start"
                  asChild
                >
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    Entrar
                  </Link>
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#f54703] to-[#ff7518] hover:from-[#ff7518] hover:to-[#f54703] text-white border-0 justify-start"
                  asChild
                >
                  <Link href="/plans" onClick={() => setIsOpen(false)}>
                    Começar Grátis
                  </Link>
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
