import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

//!Its used for merging classNames
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
