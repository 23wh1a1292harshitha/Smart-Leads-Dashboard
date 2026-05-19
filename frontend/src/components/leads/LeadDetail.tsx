import type { Lead } from "../../types/index.js";
import Badge from "../ui/Badge.js";

interface LeadDetailProps {
  lead: Lead;
}

export default function LeadDetail({ lead }: LeadDetailProps) {
  const createdByName =
    typeof lead.createdBy === "object" ? lead.createdBy.name : "Unknown";
  const createdByEmail =
    typeof lead.createdBy === "object" ? lead.createdBy.email : "";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
          <p className="mt-1 font-medium text-gray-900">{lead.name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
          <p className="mt-1 font-medium text-gray-900">{lead.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
          <div className="mt-1">
            <Badge type="status" value={lead.status} />
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Source</p>
          <div className="mt-1">
            <Badge type="source" value={lead.source} />
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Created By</p>
          <p className="mt-1 text-sm text-gray-900">{createdByName}</p>
          {createdByEmail && <p className="text-xs text-gray-500">{createdByEmail}</p>}
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Created At</p>
          <p className="mt-1 text-sm text-gray-900">
            {new Date(lead.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
      {lead.notes && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Notes</p>
          <p className="mt-1 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{lead.notes}</p>
        </div>
      )}
    </div>
  );
}
