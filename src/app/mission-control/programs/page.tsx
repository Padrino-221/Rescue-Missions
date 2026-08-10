'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PiPlus,
  PiPencilSimple,
  PiTrash,
  PiGraduationCap,
  PiHeart,
  PiGear,
  PiHouse,
  PiLightning,
  PiUsers,
} from 'react-icons/pi';

const programs = [
  {
    id: 1,
    title: 'Education',
    subtitle: 'Quality learning for all',
    icon: PiGraduationCap,
    description:
      'Comprehensive education programs from primary to vocational training, empowering children with knowledge and skills for a brighter future.',
    status: 'active',
    beneficiaries: '2500+',
  },
  {
    id: 2,
    title: 'Healthcare',
    subtitle: 'Caring for well-being',
    icon: PiHeart,
    description:
      'Holistic healthcare services including medical checkups, dental care, mental health support, and emergency treatments.',
    status: 'active',
    beneficiaries: '3000+',
  },
  {
    id: 3,
    title: 'Nutrition',
    subtitle: 'Nourishing body and soul',
    icon: PiLightning,
    description:
      'Balanced meal programs providing nutritious breakfast, lunch, and dinner to ensure every child receives proper nutrition.',
    status: 'active',
    beneficiaries: '500K+ meals',
  },
  {
    id: 4,
    title: 'Shelter',
    subtitle: 'Safe spaces to grow',
    icon: PiHouse,
    description:
      'Safe and loving residential facilities that provide a warm home environment with care, guidance, and stability.',
    status: 'active',
    beneficiaries: '500+',
  },
  {
    id: 5,
    title: 'Aftercare',
    subtitle: 'Building independent futures',
    icon: PiGear,
    description:
      'Transition support programs helping youth prepare for independent living through career guidance, life skills, and mentorship.',
    status: 'inactive',
    beneficiaries: '1200+',
  },
  {
    id: 6,
    title: 'Community',
    subtitle: 'Strengthening families',
    icon: PiUsers,
    description:
      'Community outreach initiatives supporting families through parenting workshops, livelihood programs, and social services.',
    status: 'active',
    beneficiaries: '5000+',
  },
];

export default function ProgramsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrograms = programs.filter(
    (program) =>
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fbf6] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0e3b2b]">Programs</h1>
            <p className="mt-1 text-sm text-[#0e3b2b]/60">
              Manage and track all rescue mission programs
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-[#0e3b2b] px-5 py-2.5 text-sm font-medium text-[#f8fbf6] transition-colors hover:bg-[#0e3b2b]/90">
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program) => {
            const Icon = program.icon;
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
                    <button className="rounded-lg p-2 text-[#0e3b2b]/60 transition-colors hover:bg-[#0e3b2b]/5 hover:text-[#0e3b2b]">
                      <PiPencilSimple className="text-lg" />
                    </button>
                    <button className="rounded-lg p-2 text-[#0e3b2b]/60 transition-colors hover:bg-red-50 hover:text-red-600">
                      <PiTrash className="text-lg" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#0e3b2b]">
                  {program.title}
                </h3>
                <p className="mb-3 text-sm font-medium text-[#7ed957]">
                  {program.subtitle}
                </p>
                <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#0e3b2b]/60">
                  {program.description}
                </p>

                <div className="flex items-center justify-between border-t border-[#0e3b2b]/10 pt-4">
                  <div className="text-sm">
                    <span className="font-bold text-[#0e3b2b]">
                      {program.beneficiaries}
                    </span>
                    <span className="ml-1 text-[#0e3b2b]/60">
                      beneficiaries
                    </span>
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
      </div>
    </div>
  );
}
