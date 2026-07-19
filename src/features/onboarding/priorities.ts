import { Activity, Apple, BookOpen, Dumbbell, Repeat2 } from "lucide-react";

export const priorities = [
  { id: "movement", label: { en: "Move more", mk: "Повеќе движење" }, icon: Activity },
  { id: "strength", label: { en: "Build strength", mk: "Градење сила" }, icon: Dumbbell },
  { id: "nutrition", label: { en: "Eat with context", mk: "Исхрана со контекст" }, icon: Apple },
  { id: "consistency", label: { en: "Stay consistent", mk: "Доследност" }, icon: Repeat2 },
  { id: "education", label: { en: "Understand my body", mk: "Разбирање на телото" }, icon: BookOpen },
] as const;
