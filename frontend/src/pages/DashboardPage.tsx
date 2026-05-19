import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout.js";
import LeadFiltersBar from "../components/leads/LeadFilters.js";
import LeadCard from "../components/leads/LeadCard.js";
import LeadForm from "../components/leads/LeadForm.js";
import LeadDetail from "../components/leads/LeadDetail.js";
import Modal from "../components/leads/LeadModal.js";
import Pagination from "../components/leads/Pagination.js";
import Button from "../components/ui/Button.js";
import { leadService } from "../services/lead.service.js";
import { useAuthStore } from "../store/authStore.js";
import { useDebounce } from "../hooks/useDebounce.js";
import type { Lead, LeadFilters, PaginationMeta, CreateLeadInput } from "../types/index.js";

type ModalMode = "create" | "edit" | "view" | null;

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [filters, setFilters] = useState<LeadFilters>({
    status: "",
    source: "",
    search: "",
    sort: "latest",
    page: 1,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await leadService.getLeads({
        ...filters,
        search: debouncedSearch,
      });
      if (res.success && res.data) {
        setLeads(res.data);
        if (res.meta) setMeta(res.meta);
      }
    } catch {
      toast.error("Failed to fetch leads");
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  const handleCreate = async (data: CreateLeadInput) => {
    setIsSubmitting(true);
    try {
      await leadService.createLead(data);
      toast.success("Lead created successfully");
      setModalMode(null);
      void fetchLeads();
    } catch {
      toast.error("Failed to create lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: CreateLeadInput) => {
    if (!selectedLead) return;
    setIsSubmitting(true);
    try {
      await leadService.updateLead(selectedLead._id, data);
      toast.success("Lead updated successfully");
      setModalMode(null);
      setSelectedLead(null);
      void fetchLeads();
    } catch {
      toast.error("Failed to update lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await leadService.deleteLead(id);
      toast.success("Lead deleted");
      void fetchLeads();
    } catch {
      toast.error("Failed to delete lead");
    }
  };

  const handleExport = () => {
    leadService.exportCSV({
      status: filters.status ?? undefined,
      source: filters.source ?? undefined,
      search: debouncedSearch,
    });
    toast.success("Downloading CSV...");
  };

  const openEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setModalMode("edit");
  };

  const openView = (lead: Lead) => {
    setSelectedLead(lead);
    setModalMode("view");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedLead(null);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {meta ? `${meta.total} total leads` : "Manage your leads"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={handleExport}>
            ↓ Export CSV
          </Button>
          <Button size="sm" onClick={() => setModalMode("create")}>
            + Add Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <LeadFiltersBar filters={filters} onChange={setFilters} />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
              <div className="h-3 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No leads found</h3>
          <p className="text-gray-500 text-sm mb-4">
            {filters.search || filters.status || filters.source
              ? "Try adjusting your filters"
              : "Get started by adding your first lead"}
          </p>
          <Button onClick={() => setModalMode("create")}>Add your first lead</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {leads.map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                onEdit={openEdit}
                onDelete={(id) => void handleDelete(id)}
                onView={openView}
              />
            ))}
          </div>
          {meta && meta.totalPages > 1 && (
            <Pagination
              meta={meta}
              onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
            />
          )}
        </>
      )}

      {/* Stats bar */}
      {meta && meta.total > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(["New", "Contacted", "Qualified", "Lost"] as const).map((status) => {
            const count = leads.filter((l) => l.status === status).length;
            return (
              <div key={status} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-500">{status}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={modalMode === "create"}
        onClose={closeModal}
        title="Add New Lead"
      >
        <LeadForm
          onSubmit={handleCreate}
          onCancel={closeModal}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={modalMode === "edit"}
        onClose={closeModal}
        title="Edit Lead"
      >
        {selectedLead && (
          <LeadForm
            lead={selectedLead}
            onSubmit={handleUpdate}
            onCancel={closeModal}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      <Modal
        isOpen={modalMode === "view"}
        onClose={closeModal}
        title="Lead Details"
      >
        {selectedLead && (
          <div className="space-y-4">
            <LeadDetail lead={selectedLead} />
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setModalMode("edit");
                }}
              >
                Edit Lead
              </Button>
              {user?.role === "admin" && (
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => {
                    void handleDelete(selectedLead._id);
                    closeModal();
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
