'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PiGear,
  PiCheck,
  PiArrowCounterClockwise,
  PiGlobe,
  PiPhone,
  PiCurrencyCircleDollar,
  PiShareNetwork,
  PiSpinner,
  PiPlus,
  PiTrash,
} from 'react-icons/pi';

// The settings object is stored as data/settings.json by the /api/settings route.
// This page edits a subset of the sections and preserves everything else on save.
type SiteSettings = {
  general: {
    orgName: string;
    tagline: string;
    description: string;
    foundedYear: string;
    copyrightYear: string;
  };
  contact: {
    phone1: string;
    phone2: string;
    email1: string;
    email2: string;
    address1: string;
    address2: string;
    officeHours1: string;
    officeHours2: string;
    mediaEmail: string;
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
  impactStats: {
    kicker: string;
    heading: string;
    description: string;
    stats: { value: string; label: string; description: string }[];
  };
  donations: {
    presetAmounts: { amount: number; impact: string }[];
    allocation: { label: string; percentage: number }[];
    taxInfo: string;
  };
  // Other sections (homeHero, about, testimonials, volunteerRoles, sponsorship,
  // corporate, faq, partners, cta) are preserved untouched on save.
  [key: string]: unknown;
};

const inputClasses =
  'w-full px-4 py-3 rounded-xl border border-dark/15 bg-white text-dark text-sm focus:outline-none focus:border-dark/40 transition-colors';

const labelClasses = 'block text-sm font-medium text-dark mb-2';

const emptySettings = (): SiteSettings => ({
  general: {
    orgName: '',
    tagline: '',
    description: '',
    foundedYear: '',
    copyrightYear: '',
  },
  contact: {
    phone1: '',
    phone2: '',
    email1: '',
    email2: '',
    address1: '',
    address2: '',
    officeHours1: '',
    officeHours2: '',
    mediaEmail: '',
  },
  social: {
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    linkedin: '',
  },
  impactStats: {
    kicker: '',
    heading: '',
    description: '',
    stats: [],
  },
  donations: {
    presetAmounts: [],
    allocation: [],
    taxInfo: '',
  },
});

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(emptySettings());
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Settings saved successfully!');
  const [toastError, setToastError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = () => {
    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load settings');
        return res.json();
      })
      .then((data) => {
        setSettings({
          ...emptySettings(),
          ...data,
          general: { ...emptySettings().general, ...data.general },
          contact: { ...emptySettings().contact, ...data.contact },
          social: { ...emptySettings().social, ...data.social },
          impactStats: { ...emptySettings().impactStats, ...data.impactStats },
          donations: { ...emptySettings().donations, ...data.donations },
        });
      })
      .catch(() => {
        setToastMessage('Could not load settings.');
        setToastError(true);
        setToast(true);
        setTimeout(() => setToast(false), 3000);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const showToast = (message: string, isError = false) => {
    setToastMessage(message);
    setToastError(isError);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const updateGeneral = (field: keyof SiteSettings['general'], value: string) =>
    setSettings((prev) => ({ ...prev, general: { ...prev.general, [field]: value } }));

  const updateContact = (field: keyof SiteSettings['contact'], value: string) =>
    setSettings((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));

  const updateSocial = (field: keyof SiteSettings['social'], value: string) =>
    setSettings((prev) => ({ ...prev, social: { ...prev.social, [field]: value } }));

  const updateImpact = (field: 'kicker' | 'heading' | 'description', value: string) =>
    setSettings((prev) => ({
      ...prev,
      impactStats: { ...prev.impactStats, [field]: value },
    }));

  const updateStat = (index: number, field: 'value' | 'label' | 'description', value: string) =>
    setSettings((prev) => ({
      ...prev,
      impactStats: {
        ...prev.impactStats,
        stats: prev.impactStats.stats.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
      },
    }));

  const addStat = () =>
    setSettings((prev) => ({
      ...prev,
      impactStats: {
        ...prev.impactStats,
        stats: [...prev.impactStats.stats, { value: '', label: '', description: '' }],
      },
    }));

  const removeStat = (index: number) =>
    setSettings((prev) => ({
      ...prev,
      impactStats: {
        ...prev.impactStats,
        stats: prev.impactStats.stats.filter((_, i) => i !== index),
      },
    }));

  const updatePreset = (index: number, field: 'amount' | 'impact', value: string) =>
    setSettings((prev) => ({
      ...prev,
      donations: {
        ...prev.donations,
        presetAmounts: prev.donations.presetAmounts.map((p, i) =>
          i === index
            ? field === 'amount'
              ? { ...p, amount: Number(value) || 0 }
              : { ...p, impact: value }
            : p
        ),
      },
    }));

  const addPreset = () =>
    setSettings((prev) => ({
      ...prev,
      donations: {
        ...prev.donations,
        presetAmounts: [...prev.donations.presetAmounts, { amount: 0, impact: '' }],
      },
    }));

  const removePreset = (index: number) =>
    setSettings((prev) => ({
      ...prev,
      donations: {
        ...prev.donations,
        presetAmounts: prev.donations.presetAmounts.filter((_, i) => i !== index),
      },
    }));

  const updateAllocation = (index: number, field: 'label' | 'percentage', value: string) =>
    setSettings((prev) => ({
      ...prev,
      donations: {
        ...prev.donations,
        allocation: prev.donations.allocation.map((a, i) =>
          i === index
            ? field === 'percentage'
              ? { ...a, percentage: Number(value) || 0 }
              : { ...a, label: value }
            : a
        ),
      },
    }));

  const addAllocation = () =>
    setSettings((prev) => ({
      ...prev,
      donations: {
        ...prev.donations,
        allocation: [...prev.donations.allocation, { label: '', percentage: 0 }],
      },
    }));

  const removeAllocation = (index: number) =>
    setSettings((prev) => ({
      ...prev,
      donations: {
        ...prev.donations,
        allocation: prev.donations.allocation.filter((_, i) => i !== index),
      },
    }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      showToast('Settings saved successfully!');
    } catch {
      showToast('Failed to save settings. Please try again.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    await loadSettings();
    showToast('Settings reset to saved values.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fbf6] p-6 md:p-10 flex items-center justify-center">
        <PiSpinner className="animate-spin text-3xl text-[#0e3b2b]/30" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbf6] p-6 md:p-10">
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-lg ${
            toastError ? 'bg-red-500 text-white' : 'bg-[#7ed957] text-[#0e3b2b]'
          }`}
        >
          {toastError ? null : <PiCheck className="text-lg" />}
          {toastMessage}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#0e3b2b]">Site Settings</h1>
          <p className="mt-1 text-sm text-dark/60">
            Manage your website content and details
          </p>
        </div>

        <div className="space-y-6">
          {/* General */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-dark/10 bg-white p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0e3b2b]/10 text-[#0e3b2b]">
                <PiGear className="text-lg" />
              </div>
              <h2 className="text-base font-bold text-[#0e3b2b]">General</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Organization Name</label>
                <input
                  className={inputClasses}
                  value={settings.general.orgName}
                  onChange={(e) => updateGeneral('orgName', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Tagline</label>
                <input
                  className={inputClasses}
                  value={settings.general.tagline}
                  onChange={(e) => updateGeneral('tagline', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClasses}>Description</label>
                <textarea
                  className={inputClasses}
                  rows={3}
                  value={settings.general.description}
                  onChange={(e) => updateGeneral('description', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Founded Year</label>
                <input
                  className={inputClasses}
                  value={settings.general.foundedYear}
                  onChange={(e) => updateGeneral('foundedYear', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Copyright Year</label>
                <input
                  className={inputClasses}
                  value={settings.general.copyrightYear}
                  onChange={(e) => updateGeneral('copyrightYear', e.target.value)}
                />
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl border border-dark/10 bg-white p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0e3b2b]/10 text-[#0e3b2b]">
                <PiPhone className="text-lg" />
              </div>
              <h2 className="text-base font-bold text-[#0e3b2b]">Contact</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Phone 1</label>
                <input
                  className={inputClasses}
                  value={settings.contact.phone1}
                  onChange={(e) => updateContact('phone1', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Phone 2</label>
                <input
                  className={inputClasses}
                  value={settings.contact.phone2}
                  onChange={(e) => updateContact('phone2', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Email 1</label>
                <input
                  className={inputClasses}
                  value={settings.contact.email1}
                  onChange={(e) => updateContact('email1', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Email 2</label>
                <input
                  className={inputClasses}
                  value={settings.contact.email2}
                  onChange={(e) => updateContact('email2', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Media Email</label>
                <input
                  className={inputClasses}
                  value={settings.contact.mediaEmail}
                  onChange={(e) => updateContact('mediaEmail', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Address Line 1</label>
                <input
                  className={inputClasses}
                  value={settings.contact.address1}
                  onChange={(e) => updateContact('address1', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Address Line 2</label>
                <input
                  className={inputClasses}
                  value={settings.contact.address2}
                  onChange={(e) => updateContact('address2', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Office Hours 1</label>
                <input
                  className={inputClasses}
                  value={settings.contact.officeHours1}
                  onChange={(e) => updateContact('officeHours1', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Office Hours 2</label>
                <input
                  className={inputClasses}
                  value={settings.contact.officeHours2}
                  onChange={(e) => updateContact('officeHours2', e.target.value)}
                />
              </div>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-2xl border border-dark/10 bg-white p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0e3b2b]/10 text-[#0e3b2b]">
                <PiShareNetwork className="text-lg" />
              </div>
              <h2 className="text-base font-bold text-[#0e3b2b]">Social Media</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Facebook</label>
                <input
                  className={inputClasses}
                  value={settings.social.facebook}
                  onChange={(e) => updateSocial('facebook', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Twitter</label>
                <input
                  className={inputClasses}
                  value={settings.social.twitter}
                  onChange={(e) => updateSocial('twitter', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Instagram</label>
                <input
                  className={inputClasses}
                  value={settings.social.instagram}
                  onChange={(e) => updateSocial('instagram', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>YouTube</label>
                <input
                  className={inputClasses}
                  value={settings.social.youtube}
                  onChange={(e) => updateSocial('youtube', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>LinkedIn</label>
                <input
                  className={inputClasses}
                  value={settings.social.linkedin}
                  onChange={(e) => updateSocial('linkedin', e.target.value)}
                />
              </div>
            </div>
          </motion.div>

          {/* Impact Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="rounded-2xl border border-dark/10 bg-white p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0e3b2b]/10 text-[#0e3b2b]">
                <PiGlobe className="text-lg" />
              </div>
              <h2 className="text-base font-bold text-[#0e3b2b]">Impact Stats</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Kicker</label>
                <input
                  className={inputClasses}
                  value={settings.impactStats.kicker}
                  onChange={(e) => updateImpact('kicker', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Heading</label>
                <input
                  className={inputClasses}
                  value={settings.impactStats.heading}
                  onChange={(e) => updateImpact('heading', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClasses}>Description</label>
                <textarea
                  className={inputClasses}
                  rows={2}
                  value={settings.impactStats.description}
                  onChange={(e) => updateImpact('description', e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {settings.impactStats.stats.map((stat, i) => (
                <div key={i} className="grid gap-3 sm:grid-cols-[1fr_1fr_2fr_auto] items-center">
                  <input
                    className={inputClasses}
                    placeholder="Value (e.g. 2,500+)"
                    value={stat.value}
                    onChange={(e) => updateStat(i, 'value', e.target.value)}
                  />
                  <input
                    className={inputClasses}
                    placeholder="Label (e.g. Children Educated)"
                    value={stat.label}
                    onChange={(e) => updateStat(i, 'label', e.target.value)}
                  />
                  <input
                    className={inputClasses}
                    placeholder="Description"
                    value={stat.description}
                    onChange={(e) => updateStat(i, 'description', e.target.value)}
                  />
                  <button
                    onClick={() => removeStat(i)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-dark/15 text-dark/50 transition-colors hover:border-red-300 hover:text-red-500"
                  >
                    <PiTrash />
                  </button>
                </div>
              ))}
              <button
                onClick={addStat}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0e3b2b] underline underline-offset-2 transition-colors hover:text-[#7ed957]"
              >
                <PiPlus className="text-base" /> Add Stat
              </button>
            </div>
          </motion.div>

          {/* Donations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="rounded-2xl border border-dark/10 bg-white p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0e3b2b]/10 text-[#0e3b2b]">
                <PiCurrencyCircleDollar className="text-lg" />
              </div>
              <h2 className="text-base font-bold text-[#0e3b2b]">Donations</h2>
            </div>

            <label className={labelClasses}>Preset Amounts</label>
            <div className="space-y-3">
              {settings.donations.presetAmounts.map((preset, i) => (
                <div key={i} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto] items-center">
                  <input
                    className={inputClasses}
                    type="number"
                    placeholder="Amount (GH₵)"
                    value={preset.amount}
                    onChange={(e) => updatePreset(i, 'amount', e.target.value)}
                  />
                  <input
                    className={inputClasses}
                    placeholder="Impact (e.g. School supplies for a month)"
                    value={preset.impact}
                    onChange={(e) => updatePreset(i, 'impact', e.target.value)}
                  />
                  <button
                    onClick={() => removePreset(i)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-dark/15 text-dark/50 transition-colors hover:border-red-300 hover:text-red-500"
                  >
                    <PiTrash />
                  </button>
                </div>
              ))}
              <button
                onClick={addPreset}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0e3b2b] underline underline-offset-2 transition-colors hover:text-[#7ed957]"
              >
                <PiPlus className="text-base" /> Add Preset
              </button>
            </div>

            <label className={`${labelClasses} mt-6`}>Fund Allocation</label>
            <div className="space-y-3">
              {settings.donations.allocation.map((item, i) => (
                <div key={i} className="grid gap-3 sm:grid-cols-[2fr_1fr_auto] items-center">
                  <input
                    className={inputClasses}
                    placeholder="Label (e.g. Programs & Services)"
                    value={item.label}
                    onChange={(e) => updateAllocation(i, 'label', e.target.value)}
                  />
                  <div className="relative">
                    <input
                      className={inputClasses}
                      type="number"
                      min="0"
                      max="100"
                      placeholder="%"
                      value={item.percentage}
                      onChange={(e) => updateAllocation(i, 'percentage', e.target.value)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/40 text-sm">%</span>
                  </div>
                  <button
                    onClick={() => removeAllocation(i)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-dark/15 text-dark/50 transition-colors hover:border-red-300 hover:text-red-500"
                  >
                    <PiTrash />
                  </button>
                </div>
              ))}
              <button
                onClick={addAllocation}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0e3b2b] underline underline-offset-2 transition-colors hover:text-[#7ed957]"
              >
                <PiPlus className="text-base" /> Add Allocation
              </button>
            </div>

            <div className="mt-6">
              <label className={labelClasses}>Tax Information</label>
              <textarea
                className={inputClasses}
                rows={3}
                value={settings.donations.taxInfo}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    donations: { ...prev.donations, taxInfo: e.target.value },
                  }))
                }
              />
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-[#0e3b2b] px-8 py-3.5 text-sm font-extrabold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-full border border-dark/15 px-6 py-3.5 text-sm font-bold text-dark transition-colors hover:bg-dark/5"
          >
            <PiArrowCounterClockwise className="text-base" />
            Reset to Saved
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
