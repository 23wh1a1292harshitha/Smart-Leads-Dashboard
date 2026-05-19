import { useCallback } from "react";
import Select from "../ui/Select.js";
import Input from "../ui/Input.js";
import type { LeadFilters } from "../../types/index.js";

interface LeadFiltersProps {
  filters: LeadFilters;
  onChange: (filters: LeadFilters) => void;
}

const statusOptions = [
  { value: "New", label: "New" },
  { value: "Contacted", label: "Contacted" },
  { value: "Qualified", label: "Qualified" },
  { value: "Lost", label: "Lost" },
];

const sourceOptions = [
  { value: "Website", label: "Website" },
  { value: "Instagram", label: "Instagram" },
  { value: "Referral", label: "Referral" },
];

const sortOptions = [
  { value: "latest", label: "Latest First" },
  { value: "oldest", label: "Oldest First" },
];

export default function LeadFiltersBar({ filters, onChange }: LeadFiltersProps) {
  const handleChange = useCallback(
    (key: keyof LeadFilters, value: string) => {
      onChange({ ...filters, [key]: value, page: 1 });
    },
    [filters, onChange]
  );

  const handleReset = () => {
    onChange({ status: "", source: "", search: "", sort: "latest", page: 1 });
  };

  const hasActiveFilters = filters.status || filters.source || filters.search;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input
          placeholder="Search by name or email..."
          value={filters.search ?? ""}
          onChange={(e) => handleChange("search", e.target.value)}
        />
        <Select
          options={statusOptions}
          placeholder="All Statuses"
          value={filters.status ?? ""}
          onChange={(e) => handleChange("status", e.target.value)}
        />
        <Select
          options={sourceOptions}
          placeholder="All Sources"
          value={filters.source ?? ""}
          onChange={(e) => handleChange("source", e.target.value)}
        />
        <Select
          options={sortOptions}
          value={filters.sort ?? "latest"}
          onChange={(e) => handleChange("sort", e.target.value)}
        />
      </div>
      {hasActiveFilters && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-gray-500">Active filters:</span>
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs">
              Status: {filters.status}
              <button onClick={() => handleChange("status", "")} className="hover:text-indigo-900">×</button>
            </span>
          )}
          {filters.source && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs">
              Source: {filters.source}
              <button onClick={() => handleChange("source", "")} className="hover:text-indigo-900">×</button>
            </span>
          )}
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs">
              Search: {filters.search}
              <button onClick={() => handleChange("search", "")} className="hover:text-indigo-900">×</button>
            </span>
          )}
          <button onClick={handleReset} className="text-xs text-red-500 hover:text-red-700 ml-auto">
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
