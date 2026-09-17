'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PiPlus,
  PiPencilSimple,
  PiTrash,
  PiSpinner,
  PiBooks,
  PiFloppyDisk,
} from 'react-icons/pi';
import { programIcons, programIconOptions } from '@/lib/programIcons';
import { useSettings } from '@/lib/useSettings';
import Modal from '@/components/dashboard/Modal';
import ImageUpload from '@/components/ui/ImageUpload';
import { useToast } from '@/components/ui/Toast';
import { useAlert } from '@/components/ui/Alert';

type ProgramItem = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  impact: Record<string, string>;
  image: string;
};

type ProgramForm = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  features: string;
  impact: string;
  image: string;
};

const emptyForm: ProgramForm = {
  id: '',
  icon: 'heart',
  title: '',
  subtitle: '',
  description: '',
  features: '',
  impact: '',
  image: '',
};

const inputClasses =
  'w-full px-4 py-3 rounded-2xl border border-dark/15 bg-white text-sm text-dark placeholder:text-dark/35 focus:outline-none focus:border-dark/40 focus:ring-4 focus:ring-lime/20 transition-all';
const labelClasses = 'block text-xs font-semibold uppercase tracking-wide text-dark/50 mb-2';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-dark/45">{children}</h3>
      <span className="h-px flex-1 bg-dark/10" />
    </div>
  );
}

function parseFeatures(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseImpact(value: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of value.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (key) result[key] = val;
  }
  return result;
}

function impactToText(impact: Record<string, string> | undefined): string {
  return Object.entries(impact ?? {})
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
}

export default function ProgramsPage() {
  const { settings, loading } = useSettings();
  const { toast } = useToast();
  const { confirm } = useAlert();
  const [items, setItems] = useState<ProgramItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProgramForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (settings?.programs?.items) {
      const next = settings.programs.items as unknown as ProgramItem[];
      queueMicrotask(() => setItems(next));
    }
  }, [settings]);

  const filteredPrograms = items.filter(
    (program) =>
      (program.title ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (program.subtitle ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const persist = async (next: ProgramItem[]) => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ programs: { items: next } }),
    });
    if (!res.ok) throw new Error('Save failed');
    setItems(next);
  };

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (program: ProgramItem) => {
    setForm({
      id: program.id,
      icon: program.icon || 'heart',
      title: program.title ?? '',
      subtitle: program.subtitle ?? '',
      description: program.description ?? '',
      features: (program.features ?? []).join('\n'),
      impact: impactToText(program.impact),
      image: program.image ?? '',
    });
    setEditingId(program.id);
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const item: ProgramItem = {
        id: editingId ?? Date.now().toString(),
        icon: form.icon,
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        features: parseFeatures(form.features),
        impact: parseImpact(form.impact),
        image: form.image,
      };
      const next = editingId
        ? items.map((p) => (p.id === editingId ? item : p))
        : [...items, item];
      await persist(next);
      setFormOpen(false);
      toast(editingId ? 'Program updated successfully' : 'Program created successfully');
    } catch {
      toast('Failed to save the program.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (program: ProgramItem) => {
    confirm({
      title: 'Delete Program',
      message: `Delete the "${program.title}" program? This cannot be undone.`,
      icon: 'danger',
      confirmLabel: 'Delete',
      onConfirm: async () => {
        setBusyId(program.id);
        try {
          await persist(items.filter((p) => p.id !== program.id));
          toast('Program deleted successfully');
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
              Manage the programs shown on the public Programs page
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

                  <div className="border-t border-[#0e3b2b]/10 pt-4 text-sm text-[#0e3b2b]/60">
                    {(program.features ?? []).length} key activities ·{' '}
                    {Object.keys(program.impact ?? {}).length} impact stats
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && filteredPrograms.length === 0 && (
          <div className="rounded-2xl border border-[#0e3b2b]/10 bg-white p-12 text-center text-[#0e3b2b]/50">
            {items.length === 0 ? (
              <>
                <p>No programs yet.</p>
                <p className="mt-2 text-sm text-[#0e3b2b]/40">
                  The public site shows placeholder programs until you add your own here.
                </p>
              </>
            ) : (
              <p>No programs match your search.</p>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? 'Edit program' : 'New program'}
        subtitle={
          editingId
            ? 'Update the details and save your changes.'
            : 'Add a program to the public Programs page.'
        }
        icon={<PiBooks className="text-xl" />}
        maxWidth="max-w-2xl"
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-[#0e3b2b]/15 text-sm font-semibold text-[#0e3b2b] transition-colors hover:bg-[#0e3b2b]/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="program-form"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0e3b2b] text-white text-sm font-semibold transition-colors hover:bg-[#0e3b2b]/90 disabled:opacity-60"
            >
              {saving ? <PiSpinner className="animate-spin" /> : <PiFloppyDisk className="text-base" />}
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add program'}
            </button>
          </div>
        }
      >
        <form id="program-form" onSubmit={handleSave} className="space-y-8">
          <section className="space-y-4">
            <SectionLabel>Basics</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Title *</label>
                <input
                  className={`${inputClasses} font-semibold`}
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Education"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Subtitle</label>
                <input
                  className={inputClasses}
                  value={form.subtitle}
                  onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                  placeholder="e.g. Bright Futures Program"
                />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Description</label>
              <textarea
                className={`${inputClasses} resize-none leading-relaxed`}
                rows={4}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="What does this program do?"
              />
            </div>
          </section>

          <section className="space-y-4">
            <SectionLabel>Icon</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {programIconOptions.map((key) => {
                const Icon = programIcons[key];
                const active = form.icon === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setForm((p) => ({ ...p, icon: key }))}
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${
                      active
                        ? 'border-[#0e3b2b] bg-[#0e3b2b] text-white shadow-sm'
                        : 'border-[#0e3b2b]/15 text-[#0e3b2b]/60 hover:border-[#0e3b2b]/40'
                    }`}
                    title={key}
                  >
                    <Icon className="text-xl" />
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <SectionLabel>Key activities</SectionLabel>
            <div>
              <label className={labelClasses}>Activities</label>
              <textarea
                className={`${inputClasses} resize-none`}
                rows={4}
                value={form.features}
                placeholder={'Primary & Secondary School Support\nTutoring & Homework Help'}
                onChange={(e) => setForm((p) => ({ ...p, features: e.target.value }))}
              />
              <p className="mt-1.5 text-xs text-dark/40">One activity per line.</p>
            </div>
            <div>
              <label className={labelClasses}>Impact stats</label>
              <textarea
                className={`${inputClasses} resize-none`}
                rows={3}
                value={form.impact}
                placeholder={'beneficiaries: 2,500+\nschools: 15'}
                onChange={(e) => setForm((p) => ({ ...p, impact: e.target.value }))}
              />
              <p className="mt-1.5 text-xs text-dark/40">One per line, formatted as label: value.</p>
            </div>
          </section>

          <section className="space-y-4">
            <SectionLabel>Cover image</SectionLabel>
            <ImageUpload
              value={form.image}
              onChange={(v) => setForm((p) => ({ ...p, image: v }))}
              folder="rescue-mission/programs"
              label="Program Image"
            />
          </section>
        </form>
      </Modal>
    </div>
  );
}
