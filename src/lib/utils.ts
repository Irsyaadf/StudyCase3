"use client";
import dayjs from "dayjs";

export function formatDate(date: string | Date | null): string {
  return date ? dayjs(date).format("DD MMM YYYY, HH:mm") : "-";
}

/**
 * Fungsi untuk mendapatkan warna sesuai status karyawan.
 */
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    ACTIVE: "green",
    INACTIVE: "volcano",
    SUSPENDED: "gold",
    PROBATION: "blue",
    TERMINATED: "red",
    RESIGNED: "orange",
    RETIRED: "purple",
  };
  return statusColors[status] || "gray";
}

