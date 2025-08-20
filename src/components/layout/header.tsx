"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChefHat, Menu, X, Heart, Clock, Users } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: "/dashboard", label: t("header.home"), icon: ChefHat },
    { href: "/history", label: t("header.history"), icon: Clock },
    { href: "/favorites", label: t("header.favorites"), icon: Heart },
    { href: "/community", label: t("header.community"), icon: Users },
    { href: "/plans", label: t("header.plans"), icon: ChefHat },
  ];

  return (
    <header
      className="border-b border-orange-200/50 backdrop-blur-sm bg-white/80 dark:border-gray-700/50 dark:bg-black/80 sticky top-0 z-50"
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-lg flex items-center justify-center">
            <ChefHat className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            iChef24
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors ${
                pathname === item.href
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800 hover:bg-orange-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 text-sm"
            >
              {t("header.login")}
            </Button>
          </Link>
          <Link href="/plans">
            <Button
              size="sm"
              className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0 text-sm"
            >
              {t("header.start")}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-600 dark:text-gray-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <ChefHat className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-800 dark:text-white">
                  Menu
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 dark:hover:from-orange-900/20 dark:hover:to-yellow-900/20 transition-all duration-300 group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-3 h-3 bg-orange-500 rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                  <span className="font-medium">{item.label}</span>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <item.icon className="w-4 h-4 text-orange-500" />
                  </div>
                </Link>
              ))}
            </div>

            {/* User Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              {user ? (
                <div className="flex items-center justify-between px-4 py-4 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                      <ChefHat className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Olá, {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Chef iChef24
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      /* logout logic */
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors p-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Link
                  href="/"
                  className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 dark:hover:from-orange-900/20 dark:hover:to-yellow-900/20 transition-all duration-300 group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-3 h-3 bg-orange-500 rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                  <span className="font-medium">Entrar</span>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ChefHat className="w-4 h-4 text-orange-500" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
