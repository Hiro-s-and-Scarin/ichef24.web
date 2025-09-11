"use client";

import { Suspense } from "react";
import { FavoritesPageContent } from "@/components/feature/pages/favorites-page";

export default function MyRecipeBookPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <FavoritesPageContent />
    </Suspense>
  );
}
