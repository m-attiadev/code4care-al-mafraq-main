import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime12h(time: string): string {
  const [hStr, mStr] = time.split(":");
  let h = Number(hStr);
  const m = Number(mStr);
  if (isNaN(h) || isNaN(m)) return time;
  const suffix = h >= 12 ? "م" : "ص";
  const hour12 = h % 12 || 12;
  const mm = String(m).padStart(2, "0");
  return `${hour12}:${mm} ${suffix}`;
}

export function formatTime12hFromDate(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes();
  const suffix = h >= 12 ? "م" : "ص";
  const hour12 = h % 12 || 12;
  const mm = String(m).padStart(2, "0");
  return `${hour12}:${mm} ${suffix}`;
}
