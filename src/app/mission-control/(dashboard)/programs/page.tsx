'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PiPlus,
  PiPencilSimple,
  PiTrash,
  PiSpinner,
} from 'react-icons/pi';
import { programIcons, programIconOptions } from '@/lib/programIcons';
import { useResource } from '@/lib/useResource';
import Modal from '@/components/dashboard/Modal';
import Select from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { useAlert } from '@/components/ui/Alert';

type Program = {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  status: 'active' | 'inactive';
  beneficiaries: string;
};

type ProgramForm = {
  title: string
  subtitle: string
  icon: string
  description: string
  status: Program['status']
  beneficiaries: string
}

const emptyForm: ProgramForm = {
  title: '',
  subtitle: '',
  icon: 'heart',
  description: '',
  status: 'active',
  beneficiaries: '',
};

const inputClasses =
  'w-full px-4 py-2.5 rounded-xl border border-dark/15 bg-white text-sm text-dark placeholder:text-dark/35 focus:outline-none focus:border-dark/40 transition-colors';
const labelClasses = 'block text-sm font-medium text-dark mb-1.5';

export default function ProgramsPage() {
  const { data: programs, setData, loading, error, reload } = useResource<Program>('/api/programs');
  const { toast } = useToast();
  const { confirm } = useAlert();
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProgramForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const filteredPrograms = programs.filter(
    (program) =>
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (program: Program) => {
    setForm({
      title: program.title,
      subtitle: program.subtitle,
      icon: program.icon,
      description: program.description,
      status: program.status,
      beneficiaries: program.beneficiaries,
    });
    setEditingId(program.id);
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(editingId ? `/api/programs/${editingId}` : '/api/programs', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setFormOpen(false);
      toast(editingId ? 'Program updated successfully' : 'Program created successfully');
      reload();
    } catch {
      toast('Failed to save the program.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (program: Program) => {
    confirm({
      title: 'Delete Program',
      message: `Delete the "${program.title}" program? This cannot be undone.`,
      icon: 'danger',
      confirmLabel: 'Delete',
      onConfirm: async () => {
        setBusyId(program.id);
        try {
          const res = await fetch(`/api/programs/${program.id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error();
          toast('Program deleted successfully');
          setData((prev) => prev.filter((p) => p.id !== program.id));
        } catch {
          toast('Failed to delete the program.', 'error');
        } finally {
          setBusyId(null);
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fbf6] p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0e3b2b]">Programs</h1>
            <p className="mt-1 text-sm text-[#0e3b2b]/60">
              Manage and track all rescue mission programs
            </p>
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0e3b2b] px-5 py-2.5 text-sm font-medium text-[#f8fbf6] transition-colors hover:bg-[#0e3b2b]/90 self-start"
          >
            <PiPlus className="text-lg" />
            Add Program
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md rounded-xl border border-[#0e3b2b]/10 bg-white px-4 py-2.5 text-sm text-[#0e3b2b] outline-none placeholder:text-[#0e3b2b]/40 focus:border-[#7ed957] focus:ring-2 focus:ring-[#7ed957]/20"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-[#0e3b2b]/10 bg-white p-16 text-center">
            <PiSpinner className="mx-auto animate-spin text-2xl text-[#0e3b2b]/30" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrograms.map((program) => {
              const Icon = programIcons[program.icon] ?? programIcons.heart;
              return (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border border-[#0e3b2b]/10 bg-white p-6"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7ed957]/20">
                      <Icon className="text-xl text-[#0e3b2b]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(program)}
                        className="rounded-lg p-2 text-[#0e3b2b]/60 transition-colors hover:bg-[#0e3b2b]/5 hover:text-[#0e3b2b]"
                        title="Edit"
                      >
                        <PiPencilSimple className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(program)}
                        disabled={busyId === program.id}
                        className="rounded-lg p-2 text-[#0e3b2b]/60 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        title="Delete"
                      >
                        {busyId === program.id ? (
                          <PiSpinner className="text-lg animate-spin" />
                        ) : (
                          <PiTrash className="text-lg" />
                        )}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#0e3b2b]">{program.title}</h3>
                  <p className="mb-3 text-sm font-medium text-[#7ed957]">{program.subtitle}</p>
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#0e3b2b]/60">
                    {program.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-[#0e3b2b]/10 pt-4">
                    <div className="text-sm">
                      <span className="font-bold text-[#0e3b2b]">{program.beneficiaries}</span>
                      <span className="ml-1 text-[#0e3b2b]/60">beneficiaries</span>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        program.status === 'active'
                          ? 'bg-[#7ed957]/20 text-[#0e3b2b]'
                          : 'bg-[#0e3b2b]/10 text-[#0e3b2b]/60'
                      }`}
                    >
                      {program.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && filteredPrograms.length === 0 && (
          <div className="rounded-2xl border border-[#0e3b2b]/10 bg-white p-12 text-center text-[#0e3b2b]/50">
            No programs found.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? 'Edit Program' : 'Add Program'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Title *</label>
              <input
                className={inputClasses}
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Subtitle</label>
              <input
                className={inputClasses}
                value={form.subtitle}
                onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Icon</label>
            <div className="flex flex-wrap gap-2">
              {programIconOptions.map((key) => {
                const Icon = programIcons[key];
                const active = form.icon === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setForm((p) => ({ ...p, icon: key }))}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all ${
                      active
                        ? 'border-[#0e3b2b] bg-[#0e3b2b] text-white'
                        : 'border-[#0e3b2b]/15 text-[#0e3b2b]/60 hover:border-[#0e3b2b]/40'
                    }`}
                    title={key}
                  >
                    <Icon className="text-lg" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelClasses}>Description</label>
            <textarea
              className={inputClasses}
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Beneficiaries</label>
              <input
                className={inputClasses}
                value={form.beneficiaries}
                placeholder="e.g. 2500+"
                onChange={(e) => setForm((p) => ({ ...p, beneficiaries: e.target.value }))}
              />
            </div>
            <div>
              <Select
                label="Status"
                value={form.status}
                onChange={(v) => setForm((p) => ({ ...p, status: v as Program['status'] }))}
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-[#0e3b2b]/15 text-sm font-semibold text-[#0e3b2b] hover:bg-[#0e3b2b]/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#0e3b2b] text-white text-sm font-semibold hover:bg-[#0e3b2b]/90 transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Program'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
