'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PiGear,
  PiCheck,
  PiArrowCounterClockwise,
  PiGlobe,
  PiPhone,
  PiEnvelope,
  PiMapPin,
  PiCurrencyCircleDollar,
  PiImage,
  PiShareNetwork,
} from 'react-icons/pi';

const defaultSettings = {
  orgName: 'Rescue Mission Orphanage',
  tagline: 'Give Hope To Children In Need',
  description:
    'A dedicated charity organization focused on creating sustainable solutions for those in need.',
  foundedYear: '2008',
  phone1: '+233 24 567 890',
  phone2: '+233 20 567 891',
  email1: 'info@rescuemission.org',
  email2: 'donate@rescuemission.org',
  address: '123 Hope Street, Accra, Ghana',
  officeHours: 'Mon-Fri: 9AM-5PM, Sat: 9AM-1PM',
  facebook: 'https://facebook.com/rescuemission',
  twitter: 'https://twitter.com/rescuemission',
  instagram: 'https://instagram.com/rescuemission',
  youtube: 'https://youtube.com/rescuemission',
  childrenServed: '5,000+',
  countriesActive: '5',
  volunteersActive: '186',
  fundsRaised: 'GH₵2.5M',
  donationPresets: [25, 50, 100, 250, 500, 1000],
};

const inputClasses =
  'w-full px-4 py-3 rounded-xl border border-dark/15 bg-white text-dark text-sm focus:outline-none focus:border-dark/40 transition-colors';

const labelClasses = 'block text-sm font-medium text-dark mb-2';

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [toast, setToast] = useState(false);

  const updateField = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const updatePreset = (index: number, value: string) => {
    const presets = [...settings.donationPresets];
    presets[index] = Number(value) || 0;
    setSettings((prev) => ({ ...prev, donationPresets: presets }));
  };

  const addPreset = () => {
    setSettings((prev) => ({
      ...prev,
      donationPresets: [...prev.donationPresets, 0],
    }));
  };

  const removePreset = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      donationPresets: prev.donationPresets.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  return (
    <div className="min-h-screen bg-[#f8fbf6] p-6 md:p-10">
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#7ed957] px-5 py-3 text-sm font-semibold text-[#0e3b2b] shadow-lg"
        >
          <PiCheck className="text-lg" />
          Settings saved successfully!
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
                  value={settings.orgName}
                  onChange={(e) => updateField('orgName', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Tagline</label>
                <input
                  className={inputClasses}
                  value={settings.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClasses}>Description</label>
                <textarea
                  className={inputClasses}
                  rows={3}
                  value={settings.description}
                  onChange={(e) => updateField('description', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Founded Year</label>
                <input
                  className={inputClasses}
                  value={settings.foundedYear}
                  onChange={(e) => updateField('foundedYear', e.target.value)}
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
                  value={settings.phone1}
                  onChange={(e) => updateField('phone1', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Phone 2</label>
                <input
                  className={inputClasses}
                  value={settings.phone2}
                  onChange={(e) => updateField('phone2', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Email 1</label>
                <input
                  className={inputClasses}
                  value={settings.email1}
                  onChange={(e) => updateField('email1', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Email 2</label>
                <input
                  className={inputClasses}
                  value={settings.email2}
                  onChange={(e) => updateField('email2', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClasses}>Address</label>
                <input
                  className={inputClasses}
                  value={settings.address}
                  onChange={(e) => updateField('address', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClasses}>Office Hours</label>
                <input
                  className={inputClasses}
                  value={settings.officeHours}
                  onChange={(e) => updateField('officeHours', e.target.value)}
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
                  value={settings.facebook}
                  onChange={(e) => updateField('facebook', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Twitter</label>
                <input
                  className={inputClasses}
                  value={settings.twitter}
                  onChange={(e) => updateField('twitter', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Instagram</label>
                <input
                  className={inputClasses}
                  value={settings.instagram}
                  onChange={(e) => updateField('instagram', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>YouTube</label>
                <input
                  className={inputClasses}
                  value={settings.youtube}
                  onChange={(e) => updateField('youtube', e.target.value)}
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
                <label className={labelClasses}>Children Served</label>
                <input
                  className={inputClasses}
                  value={settings.childrenServed}
                  onChange={(e) => updateField('childrenServed', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Countries Active</label>
                <input
                  className={inputClasses}
                  value={settings.countriesActive}
                  onChange={(e) => updateField('countriesActive', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Volunteers Active</label>
                <input
                  className={inputClasses}
                  value={settings.volunteersActive}
                  onChange={(e) => updateField('volunteersActive', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Funds Raised</label>
                <input
                  className={inputClasses}
                  value={settings.fundsRaised}
                  onChange={(e) => updateField('fundsRaised', e.target.value)}
                />
              </div>
            </div>
          </motion.div>

          {/* Donation Presets */}
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
              <h2 className="text-base font-bold text-[#0e3b2b]">Donation Presets</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {settings.donationPresets.map((amount, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className={inputClasses}
                    type="number"
                    value={amount}
                    onChange={(e) => updatePreset(i, e.target.value)}
                  />
                  <button
                    onClick={() => removePreset(i)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dark/15 text-dark/50 transition-colors hover:border-red-300 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addPreset}
              className="mt-4 text-sm font-semibold text-[#0e3b2b] underline underline-offset-2 transition-colors hover:text-[#7ed957]"
            >
              + Add Preset
            </button>
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
            className="rounded-full bg-[#0e3b2b] px-8 py-3.5 text-sm font-extrabold text-white transition-opacity hover:opacity-90"
          >
            Save Changes
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-full border border-dark/15 px-6 py-3.5 text-sm font-bold text-dark transition-colors hover:bg-dark/5"
          >
            <PiArrowCounterClockwise className="text-base" />
            Reset to Defaults
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
