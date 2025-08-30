"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { translateDynamicData } from "@/lib/config/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { RecipeParams } from "@/types/recipe";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: RecipeParams;
  onFiltersChange: (filters: Partial<RecipeParams>) => void;
}

export function FilterModal({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}: FilterModalProps) {
  const { t, i18n } = useTranslation();
  const [localFilters, setLocalFilters] = useState<RecipeParams>(filters);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    filters.tags || [],
  );

  const timeRanges = [
    { value: "15", label: t("filter.time.15") },
    { value: "30", label: t("filter.time.30") },
    { value: "45", label: t("filter.time.45") },
    { value: "60", label: t("filter.time.60") },
    { value: "120", label: t("filter.time.120") },
  ];

  // Opções de dificuldade com tradução dinâmica
  const difficultyOptions = [
    { value: "1", label: translateDynamicData.difficulty(1, i18n.language) },
    { value: "2", label: translateDynamicData.difficulty(2, i18n.language) },
    { value: "3", label: translateDynamicData.difficulty(3, i18n.language) },
    { value: "4", label: translateDynamicData.difficulty(4, i18n.language) },
    { value: "5", label: translateDynamicData.difficulty(5, i18n.language) },
  ];

  // Tipos de cozinha com tradução dinâmica
  const cuisineTypes = [
    translateDynamicData.cuisine("italian", i18n.language),
    translateDynamicData.cuisine("brazilian", i18n.language),
    translateDynamicData.cuisine("japanese", i18n.language),
    translateDynamicData.cuisine("mexican", i18n.language),
    translateDynamicData.cuisine("indian", i18n.language),
    translateDynamicData.cuisine("french", i18n.language),
    translateDynamicData.cuisine("chinese", i18n.language),
    translateDynamicData.cuisine("thai", i18n.language),
    translateDynamicData.cuisine("mediterranean", i18n.language),
    translateDynamicData.cuisine("arabic", i18n.language),
  ];

  const handleApplyFilters = () => {
    onFiltersChange({
      ...localFilters,
      tags: selectedTags,
      page: 1,
    });
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: RecipeParams = {
      page: 1,
      limit: 12,
    };
    setLocalFilters(resetFilters);
    setSelectedTags([]);
    onFiltersChange(resetFilters);
    onClose();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-orange-100/50 [&::-webkit-scrollbar-track]:dark:bg-gray-700/50 [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-orange-400 [&::-webkit-scrollbar-thumb]:to-yellow-400 [&::-webkit-scrollbar-thumb]:dark:from-orange-500 [&::-webkit-scrollbar-thumb]:dark:to-yellow-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-orange-500 [&::-webkit-scrollbar-thumb]:hover:to-yellow-500 [&::-webkit-scrollbar-thumb]:dark:hover:from-orange-400 [&::-webkit-scrollbar-thumb]:dark:hover:to-yellow-400">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{t("filter.title")}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">{t("filter.search.label")}</Label>
            <Input
              id="search"
              placeholder={t("filter.search.placeholder")}
              value={localFilters.search || ""}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>

          {/* Difficulty Level */}
          <div className="space-y-2">
            <Label>{t("filter.difficulty.label")}</Label>
            <Select
              value={localFilters.difficulty?.[0] || ""}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  difficulty: value ? [value] : undefined,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filter.select.difficulty")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("filter.all.levels")}</SelectItem>
                {difficultyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cooking Time */}
          <div className="space-y-2">
            <Label>{t("filter.time.label")}</Label>
            <Select
              value={localFilters.time || ""}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  time: value || undefined,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filter.select.time")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("filter.any.time")}</SelectItem>
                {timeRanges.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cuisine Types */}
          <div className="space-y-2">
            <Label>{t("filter.cuisine.label")}</Label>
            <div className="flex flex-wrap gap-2">
              {cuisineTypes.map((cuisine) => (
                <Badge
                  key={cuisine}
                  variant={
                    selectedTags.includes(cuisine) ? "default" : "outline"
                  }
                  className="cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30"
                  onClick={() => toggleTag(cuisine)}
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label>{t("filter.sort.label")}</Label>
            <Select
              value={localFilters.sortBy || ""}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  sortBy: (value as string) || undefined,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filter.select.sort")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("filter.sort.default")}</SelectItem>
                <SelectItem value="newest">{t("filter.sort.newest")}</SelectItem>
                <SelectItem value="oldest">{t("filter.sort.oldest")}</SelectItem>
                <SelectItem value="title">{t("filter.sort.title")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="flex-1"
            >
              {t("filter.reset")}
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              {t("filter.apply")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
