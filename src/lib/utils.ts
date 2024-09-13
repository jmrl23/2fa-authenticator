import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const api = axios.create({
  baseURL: '/api',
});
