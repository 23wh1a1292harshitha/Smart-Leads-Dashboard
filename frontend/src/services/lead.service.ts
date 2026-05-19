import api from "../lib/axios.js";
import type { ApiResponse, Lead, LeadFilters, CreateLeadInput } from "../types/index.js";

export const leadService = {
  getLeads: async (filters: LeadFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.source) params.append("source", filters.source);
    if (filters.search) params.append("search", filters.search);
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.page) params.append("page", String(filters.page));
    params.append("limit", "10");

    const res = await api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
    return res.data;
  },

  getLeadById: async (id: string) => {
    const res = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data;
  },

  createLead: async (data: CreateLeadInput) => {
    const res = await api.post<ApiResponse<Lead>>("/leads", data);
    return res.data;
  },

  updateLead: async (id: string, data: Partial<CreateLeadInput>) => {
    const res = await api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return res.data;
  },

  deleteLead: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/leads/${id}`);
    return res.data;
  },

  exportCSV: (filters: Omit<LeadFilters, "page" | "sort"> = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.source) params.append("source", filters.source);
    if (filters.search) params.append("search", filters.search);

    const token = localStorage.getItem("token");
    const url = `${import.meta.env.VITE_API_URL ?? "http://localhost:5000/api"}/leads/export/csv?${params.toString()}`;

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "leads.csv");

    // Add auth header via fetch
    fetch(url, { headers: { Authorization: `Bearer ${token ?? ""}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        link.href = objectUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
      })
      .catch(console.error);
  },
};
