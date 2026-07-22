import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

export const generateSessionLink = (sessionId: string) => {
  return `${window.location.origin}/session/${sessionId}`;
};

export const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: NodeJS.Timeout;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let lastRun = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastRun >= limit) {
      lastRun = now;
      fn(...args);
    }
  };
};
