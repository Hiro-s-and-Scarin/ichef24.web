"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function CheckoutSuccessPage() {
  const { t, ready } = useTranslation();
  const searchParams = useSearchParams();
  const [planName, setPlanName] = useState<string>("");

  useEffect(() => {
    const planNameParam = searchParams.get("planName");
    if (planNameParam) {
      setPlanName(decodeURIComponent(planNameParam));
    }
  }, [searchParams]);

  if (!ready || !t) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {t("checkout.success.title")}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {t("checkout.success.subtitle", { planName: planName || t("checkout.success.default.plan") })}
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {t("checkout.success.description")}
          </p>
          
          <div className="space-y-4">
            <Link href="/dashboard">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
                <ArrowRight className="w-5 h-5 mr-2" />
                {t("checkout.success.dashboard")}
              </Button>
            </Link>
            
            <Link href="/plans">
              <Button variant="outline" className="px-8 py-3 text-lg">
                {t("checkout.success.plans")}
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-300">
              {t("checkout.success.tip")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
