
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatHorasMinutos(horasDecimais: number): string {
  const horas = Math.floor(horasDecimais);
  const minutos = Math.round((horasDecimais - horas) * 60);
  
  // Ajustar se os minutos chegarem a 60
  if (minutos === 60) {
    return `${String(horas + 1).padStart(2, '0')}:00`;
  }
  
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}
