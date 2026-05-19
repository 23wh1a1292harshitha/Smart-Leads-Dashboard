import type { Lead } from "../../types/index.js";
import Badge from "../ui/Badge.js";
import Button from "../ui/Button.js";
import { useAuthStore } from "../../store/authStore.js";

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onView: (lead: Lead) => void;
}

export default function LeadCard({ lead, onEdit, onDelete, onView }: LeadCardProps) {
  const { user } = useAuthStore();

  const createdByName =
    typeof lead.createdBy === "object" ? lead.createdBy.name : "Unknown";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <button
            onClick={() => onView(lead)}
            className="text-left group"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
              {lead.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">{lead.email}</p>
          </button>
        </div>
        <div className="flex flex-col gap-1 items-end shrink-0">
          <Badge type="status" value={lead.status} />
          <Badge type="source" value={lead.source} />
        </div>
      </div>

      {lead.notes && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{lead.notes}</p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          <span>By {createdByName}</span>
          <span className="mx-1">·</span>
          <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(lead)}>
            Edit
          </Button>
          {user?.role === "admin" && (
            <Button variant="danger" size="sm" onClick={() => onDelete(lead._id)}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
