import { ExpItem } from "@/types/type";

export function expToForm(e: ExpItem) {
  return {
    ...e,
    stack: (e.stack ?? []).join(", "),
    highlights: (e.highlights ?? []).join("\n"),
  };
}
// Convert form strings back to arrays for saving
export function formToExp(f: any): ExpItem {
  return {
    ...f,
    stack: f.stack
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean),
    highlights: f.highlights
      .split("\n")
      .map((s: string) => s.trim())
      .filter(Boolean),
  };
}