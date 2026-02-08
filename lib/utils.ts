import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function parseAIJsonResponse(text: string) {
  const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(jsonString);
}
