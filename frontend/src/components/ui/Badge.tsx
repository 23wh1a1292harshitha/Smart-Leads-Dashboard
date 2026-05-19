import type { LeadStatus, LeadSource } from "../../types/index.js";

const statusColors: Record<LeadStatus, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Qualified: "bg-green-100 text-green-700",
  Lost: "bg-red-100 text-red-700",
};

const sourceColors: Record<LeadSource, string> = {
  Website: "bg-purple-100 text-purple-700",
  Instagram: "bg-pink-100 text-pink-700",
  Referral: "bg-orange-100 text-orange-700",
};

interface BadgeProps {
  type: "status" | "source";
  value: LeadStatus | LeadSource;
}

export default function Badge({ type, value }: BadgeProps) {
  const colorClass =
    type === "status"
      ? statusColors[value as LeadStatus]
      : sourceColors[value as LeadSource];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {value}
    </span>
  );
}
