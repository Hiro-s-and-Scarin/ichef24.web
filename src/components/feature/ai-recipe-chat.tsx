"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChefHat, Send, Sparkles, MessageCircle, Mic } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AIRecipeChatProps {
  onRecipeGenerated?: (recipe: any) => void;
}

export function AIRecipeChat({ onRecipeGenerated }: AIRecipeChatProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    setIsGenerating(true);

    // Simulate AI recipe generation
    setTimeout(() => {
      const generatedRecipe = {
        id: Date.now(),
        title: t("ai.generated.title"),
        description: `${t("ai.generated.description")}: "${input}"`,
        image: "/placeholder.svg?height=200&width=300",
        time: "25 min",
        servings: "3 pessoas",
        difficulty: t("common.medium"),
        tags: [t("ai.tag"), t("ai.personalized"), t("ai.quick")],
        date: t("common.now"),
        rating: 5,
        ingredients: [
          t("ai.ingredients.selected"),
          t("ai.ingredients.spices"),
          t("ai.ingredients.unique"),
        ],
        instructions: [
          t("ai.instructions.prepare"),
          t("ai.instructions.follow"),
          t("ai.instructions.finish"),
        ],
      };

      if (onRecipeGenerated) {
        onRecipeGenerated(generatedRecipe);
      }

      setInput("");
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <Card className="bg-white/95 border-orange-200 backdrop-blur-sm dark:bg-gray-800/95 dark:border-gray-600 shadow-xl">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-xl flex items-center justify-center mx-auto shadow-lg">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              {t("ai.chat.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {t("ai.chat.subtitle")}
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="min-h-[200px] bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center space-y-2">
              <MessageCircle className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-xs">{t("ai.chat.area")}</p>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("ai.placeholder")}
              className="h-12 pr-20 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 text-base rounded-xl shadow-lg focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300"
              disabled={isGenerating}
            />
            <div className="absolute right-2 top-2 flex gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-lg"
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isGenerating}
                className="h-8 w-8 bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {isGenerating && (
            <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400 py-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">{t("ai.generating")}</span>
            </div>
          )}
        </form>

        {/* Quick Suggestions */}
        <div className="space-y-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium">
            {t("ai.suggestions")}:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              t("ai.suggestion.vegetarian"),
              t("ai.suggestion.chicken"),
              t("ai.suggestion.dessert"),
              t("ai.suggestion.italian"),
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setInput(suggestion)}
                className="h-8 border-orange-200 text-gray-700 hover:text-gray-900 hover:bg-orange-100 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg transition-all duration-300 text-xs"
                disabled={isGenerating}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
