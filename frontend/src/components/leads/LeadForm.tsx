import { useForm } from "react-hook-form";
import Input from "../ui/Input.js";
import Select from "../ui/Select.js";
import Button from "../ui/Button.js";
import type { Lead, CreateLeadInput } from "../../types/index.js";

interface LeadFormProps {
  lead?: Lead;
  onSubmit: (data: CreateLeadInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
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

export default function LeadForm({ lead, onSubmit, onCancel, isLoading }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLeadInput>({
    defaultValues: {
      name: lead?.name ?? "",
      email: lead?.email ?? "",
      status: lead?.status ?? "New",
      source: lead?.source ?? "Website",
      notes: lead?.notes ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="name"
        label="Full Name"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register("name", {
          required: "Name is required",
          minLength: { value: 2, message: "Name must be at least 2 characters" },
        })}
      />
      <Input
        id="email"
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
          pattern: { value: /^\S+@\S+\.\S+$/, message: "Please enter a valid email" },
        })}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          id="status"
          label="Status"
          options={statusOptions}
          error={errors.status?.message}
          {...register("status", { required: "Status is required" })}
        />
        <Select
          id="source"
          label="Source"
          options={sourceOptions}
          error={errors.source?.message}
          {...register("source", { required: "Source is required" })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-gray-700">
          Notes <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Add any notes about this lead..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
          {...register("notes", {
            maxLength: { value: 500, message: "Notes cannot exceed 500 characters" },
          })}
        />
        {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {lead ? "Update Lead" : "Create Lead"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
