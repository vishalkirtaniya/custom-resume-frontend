import { ProjectItem } from "@/types/type";

export function projToForm(p: ProjectItem) {
  return {
    ...p,
    stack: (p.stack ?? []).join(", "),
    metrics: (p.metrics ?? []).join("\n"),
  };
}

export function formToProj(f: any): ProjectItem {
  return {
    ...f,
    stack: f.stack
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean),
    metrics: f.metrics
      .split("\n")
      .map((s: string) => s.trim())
      .filter(Boolean),
  };
}