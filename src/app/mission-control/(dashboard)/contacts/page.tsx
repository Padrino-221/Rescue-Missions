'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PiMagnifyingGlass,
  PiEnvelope,
  PiClock,
  PiCheck,
  PiTrash,
  PiSpinner,
} from 'react-icons/pi';
import { useResource } from '@/lib/useResource';

type Contact = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
};

type FilterType = 'all' | 'unread' | 'read';

export default function ContactsPage() {
  const { data: contacts, setData, loading, error } = useResource<Contact>('/api/contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [busyIds, setBusyIds] = useState<number[]>([]);

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'unread') return matchesSearch && !contact.read;
    if (activeFilter === 'read') return matchesSearch && contact.read;
    return matchesSearch;
  });

  const unreadCount = contacts.filter((c) => !c.read).length;

  const toggleSelect = (id: number) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length && filteredContacts.length > 0) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((c) => c.id));
    }
  };

  const setBusy = (ids: number[], busy: boolean) => {
    setBusyIds((prev) => (busy ? [...new Set([...prev, ...ids])] : prev.filter((id) => !ids.includes(id))));
  };

  const markAsRead = async (id: number) => {
    setBusy([id], true);
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      if (!res.ok) throw new Error();
      setData((prev) => prev.map((c) => (c.id === id ? { ...c, read: true } : c)));
    } catch {
      alert('Failed to update the contact.');
    } finally {
      setBusy([id], false);
    }
  };

  const markSelectedAsRead = async () => {
    await Promise.all(selectedContacts.map((id) => markAsRead(id)));
    setSelectedContacts([]);
  };

  const deleteContact = async (id: number) => {
    const contact = contacts.find((c) => c.id === id);
    if (!confirm(`Delete contact from ${contact?.name ?? 'this contact'}? This cannot be undone.`)) return;
    setBusy([id], true);
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setData((prev) => prev.filter((c) => c.id !== id));
      setSelectedContacts((prev) => prev.filter((cid) => cid !== id));
    } catch {
      alert('Failed to delete the contact.');
    } finally {
      setBusy([id], false);
    }
  };

  const deleteSelected = async () => {
    if (!confirm(`Delete ${selectedContacts.length} contact(s)? This cannot be undone.`)) return;
    setBusy(selectedContacts, true);
    try {
      await Promise.all(selectedContacts.map((id) => fetch(`/api/contacts/${id}`, { method: 'DELETE' })));
      setData((prev) => prev.filter((c) => !selectedContacts.includes(c.id)));
      setSelectedContacts([]);
    } catch {
      alert('Failed to delete some contacts.');
    } finally {
      setBusy(selectedContacts, false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#f8fbf6] p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-[#0e3b2b]">Contacts</h1>
            {unreadCount > 0 && (
              <span className="bg-[#7ed957] text-[#0e3b2b] text-sm font-semibold px-3 py-1 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#0e3b2b]/10 overflow-hidden"
        >
          <div className="p-4 border-b border-[#0e3b2b]/10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex gap-2">
                {(['all', 'unread', 'read'] as FilterType[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === filter
                        ? 'bg-[#0e3b2b] text-[#f8fbf6]'
                        : 'bg-[#0e3b2b]/5 text-[#0e3b2b] hover:bg-[#0e3b2b]/10'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
              <div className="relative flex-1 max-w-md">
                <PiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0e3b2b]/40" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0e3b2b]/5 border border-[#0e3b2b]/10 rounded-lg text-[#0e3b2b] placeholder:text-[#0e3b2b]/40 focus:outline-none focus:ring-2 focus:ring-[#7ed957]/50"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="border-b border-[#0e3b2b]/10 p-4 text-sm text-red-600">{error}</div>
          )}

          {selectedContacts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#7ed957]/10 border-b border-[#0e3b2b]/10 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#0e3b2b]">
                  {selectedContacts.length} selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={markSelectedAsRead}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#0e3b2b] text-[#f8fbf6] rounded-lg text-sm font-medium hover:bg-[#0e3b2b]/90 transition-colors"
                  >
                    <PiCheck /> Mark Read
                  </button>
                  <button
                    onClick={deleteSelected}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    <PiTrash /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#0e3b2b]/10">
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-[#0e3b2b]/30 text-[#7ed957] focus:ring-[#7ed957]/50"
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-[#0e3b2b]">Name</th>
                  <th className="p-4 text-left text-sm font-semibold text-[#0e3b2b]">Email</th>
                  <th className="p-4 text-left text-sm font-semibold text-[#0e3b2b]">Subject</th>
                  <th className="p-4 text-left text-sm font-semibold text-[#0e3b2b]">Date</th>
                  <th className="p-4 text-left text-sm font-semibold text-[#0e3b2b]">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-[#0e3b2b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-16 text-center">
                      <PiSpinner className="mx-auto animate-spin text-2xl text-[#0e3b2b]/30" />
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="border-b border-[#0e3b2b]/5 hover:bg-[#0e3b2b]/5 transition-colors"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => toggleSelect(contact.id)}
                          className="rounded border-[#0e3b2b]/30 text-[#7ed957] focus:ring-[#7ed957]/50"
                        />
                      </td>
                      <td className="p-4">
                        <span className={`text-[#0e3b2b] ${!contact.read ? 'font-semibold' : ''}`}>
                          {contact.name}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-[#0e3b2b]/70">{contact.email}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-[#0e3b2b]/5 rounded text-xs font-medium text-[#0e3b2b]">
                          {contact.subject}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-[#0e3b2b]/70">{formatDate(contact.date)}</td>
                      <td className="p-4">
                        {!contact.read && (
                          <span className="w-2.5 h-2.5 bg-[#7ed957] rounded-full block" />
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {!contact.read && (
                            <button
                              onClick={() => markAsRead(contact.id)}
                              disabled={busyIds.includes(contact.id)}
                              className="p-2 hover:bg-[#0e3b2b]/10 rounded-lg transition-colors text-[#0e3b2b] disabled:opacity-50"
                              title="Mark as read"
                            >
                              <PiEnvelope />
                            </button>
                          )}
                          <button
                            onClick={() => deleteContact(contact.id)}
                            disabled={busyIds.includes(contact.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500 disabled:opacity-50"
                            title="Delete"
                          >
                            {busyIds.includes(contact.id) ? (
                              <PiSpinner className="animate-spin" />
                            ) : (
                              <PiTrash />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-[#0e3b2b]/5">
            {loading ? (
              <div className="p-12 text-center">
                <PiSpinner className="mx-auto animate-spin text-2xl text-[#0e3b2b]/30" />
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div key={contact.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleSelect(contact.id)}
                        className="rounded border-[#0e3b2b]/30 text-[#7ed957] focus:ring-[#7ed957]/50"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[#0e3b2b] ${!contact.read ? 'font-semibold' : ''}`}>
                            {contact.name}
                          </span>
                          {!contact.read && (
                            <span className="w-2 h-2 bg-[#7ed957] rounded-full" />
                          )}
                        </div>
                        <span className="text-sm text-[#0e3b2b]/60">{contact.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-8">
                    <span className="inline-block px-2 py-1 bg-[#0e3b2b]/5 rounded text-xs font-medium text-[#0e3b2b] mb-2">
                      {contact.subject}
                    </span>
                    <p className="text-sm text-[#0e3b2b]/70 mb-2 line-clamp-2">{contact.message}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-[#0e3b2b]/50">
                        <PiClock />
                        {formatDate(contact.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        {!contact.read && (
                          <button
                            onClick={() => markAsRead(contact.id)}
                            disabled={busyIds.includes(contact.id)}
                            className="p-1.5 hover:bg-[#0e3b2b]/10 rounded-lg transition-colors text-[#0e3b2b] disabled:opacity-50"
                          >
                            <PiEnvelope />
                          </button>
                        )}
                        <button
                          onClick={() => deleteContact(contact.id)}
                          disabled={busyIds.includes(contact.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-500 disabled:opacity-50"
                        >
                          {busyIds.includes(contact.id) ? (
                            <PiSpinner className="animate-spin" />
                          ) : (
                            <PiTrash />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {!loading && filteredContacts.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-[#0e3b2b]/50">No contacts found.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
