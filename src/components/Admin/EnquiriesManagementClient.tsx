'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Trash2,
  RefreshCw,
  FileText,
  MessageSquare,
  X,
  Save,
  Check,
  Send
} from 'lucide-react';
import { EnquiryRecord } from '@/lib/enquiry-service';

interface Props {
  initialEnquiries: EnquiryRecord[];
}

const STATUS_CONFIG: Record<
  EnquiryRecord['status'],
  { label: string; bg: string; text: string; border: string }
> = {
  new: { label: 'New Lead', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  contacted: { label: 'Contacted', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  scheduled: { label: 'Demo Scheduled', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  converted: { label: 'Enrolled / Converted', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  archived: { label: 'Archived', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
};

export default function EnquiriesManagementClient({ initialEnquiries }: Props) {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>(initialEnquiries);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRecord | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSaveSuccess, setNotesSaveSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync state if initialEnquiries updates
  useEffect(() => {
    setEnquiries(initialEnquiries);
  }, [initialEnquiries]);

  // When modal opens, sync admin notes
  useEffect(() => {
    if (selectedEnquiry) {
      setAdminNotesInput(selectedEnquiry.adminNotes || '');
      setNotesSaveSuccess(false);
    }
  }, [selectedEnquiry]);

  // Refresh data from API
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/enquiries');
      const data = await res.json();
      if (data.success && Array.isArray(data.enquiries)) {
        setEnquiries(data.enquiries);
      }
    } catch (err) {
      console.error('Failed to refresh enquiries:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Status Counts
  const stats = useMemo(() => {
    const total = enquiries.length;
    const newCount = enquiries.filter((e) => e.status === 'new').length;
    const contactedCount = enquiries.filter((e) => e.status === 'contacted').length;
    const scheduledCount = enquiries.filter((e) => e.status === 'scheduled').length;
    const convertedCount = enquiries.filter((e) => e.status === 'converted').length;
    return { total, newCount, contactedCount, scheduledCount, convertedCount };
  }, [enquiries]);

  // Filtered List
  const filteredList = useMemo(() => {
    return enquiries.filter((item) => {
      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      // Level filter
      if (levelFilter !== 'all' && item.academicLevel !== levelFilter) return false;
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = item.parentName.toLowerCase().includes(q);
        const matchesStudent = item.studentName?.toLowerCase().includes(q);
        const matchesPhone = item.phone.toLowerCase().includes(q);
        const matchesEmail = item.email?.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q);
        if (!matchesName && !matchesStudent && !matchesPhone && !matchesEmail && !matchesNotes) {
          return false;
        }
      }
      return true;
    });
  }, [enquiries, statusFilter, levelFilter, searchTerm]);

  // Inline Status Change
  const handleStatusChange = async (id: string, newStatus: EnquiryRecord['status']) => {
    try {
      // Optimistic update
      setEnquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );

      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Save Admin Notes
  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setIsSavingNotes(true);
    setNotesSaveSuccess(false);

    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: adminNotesInput }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((item) =>
            item.id === selectedEnquiry.id ? { ...item, adminNotes: adminNotesInput } : item
          )
        );
        setSelectedEnquiry((prev) =>
          prev ? { ...prev, adminNotes: adminNotesInput } : null
        );
        setNotesSaveSuccess(true);
        setTimeout(() => setNotesSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Delete Enquiry
  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this enquiry?')) return;

    try {
      setEnquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);

      await fetch(`/api/admin/enquiries/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete enquiry:', err);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (enquiries.length === 0) {
      alert('No enquiries to export.');
      return;
    }

    const headers = [
      'Reference ID',
      'Date Received',
      'Status',
      'Parent / Guardian Name',
      'Phone / WhatsApp',
      'Email Address',
      'Student Name',
      'Academic Level',
      'Development Areas',
      'CLARVO Exploration Offerings',
      'Preferred Time Slot',
      'Parent Notes',
      'Counselor Admin Notes',
      'Source Page',
    ];

    const rows = enquiries.map((e) => [
      `"${e.id}"`,
      `"${new Date(e.createdAt).toLocaleString('en-IN')}"`,
      `"${e.status.toUpperCase()}"`,
      `"${e.parentName.replace(/"/g, '""')}"`,
      `"${e.phone.replace(/"/g, '""')}"`,
      `"${(e.email || '').replace(/"/g, '""')}"`,
      `"${(e.studentName || '').replace(/"/g, '""')}"`,
      `"${e.academicLevel.replace(/"/g, '""')}"`,
      `"${(e.developmentAreas || []).join(', ').replace(/"/g, '""')}"`,
      `"${(e.clarvoExploration || []).join(', ').replace(/"/g, '""')}"`,
      `"${e.preferredTimeFrame.replace(/"/g, '""')}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
      `"${(e.adminNotes || '').replace(/"/g, '""')}"`,
      `"${(e.sourcePage || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CLARVO_Demo_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Admissions &amp; Consultation Leads
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Demo &amp; Student Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time enquiry records submitted through the website demo booking form. Only visible to administrators.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-10 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            title="Refresh Enquiries"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Enquiries</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{stats.total}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">All time submissions</div>
        </div>

        <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">New Leads</div>
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">{stats.newCount}</div>
          <div className="text-[11px] text-blue-500 font-semibold mt-0.5">Action required</div>
        </div>

        <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Contacted</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{stats.contactedCount}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5">In follow-up</div>
        </div>

        <div className="bg-white border border-purple-200 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Demos Scheduled</div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 mt-1">{stats.scheduledCount}</div>
          <div className="text-[11px] text-purple-600 font-semibold mt-0.5">Walkthroughs set</div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Converted</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{stats.convertedCount}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Active enrollments</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by parent name, student name, phone, or email..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="new">New Lead</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Demo Scheduled</option>
            <option value="converted">Converted</option>
            <option value="archived">Archived</option>
          </select>

          {/* Academic Level Select */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="all">All Academic Levels</option>
            <option value="High School (Grades 9-12)">High School (9–12)</option>
            <option value="Middle School (Grades 6-8)">Middle School (6–8)</option>
            <option value="Higher Education/University Prep">University Prep</option>
            <option value="Primary School (Grades 1-5)">Primary School (1–5)</option>
          </select>
        </div>
      </div>

      {/* Main Enquiries Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {filteredList.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No enquiries found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {enquiries.length === 0
                ? 'No demo enquiries have been submitted yet. Submissions through /book-a-demo will appear here immediately.'
                : 'No enquiries match your current search or filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Date / Ref</th>
                  <th className="py-3.5 px-4">Parent / Student</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Academic Level</th>
                  <th className="py-3.5 px-4">Interest Areas</th>
                  <th className="py-3.5 px-4">Preferred Slot</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item) => {
                  const statusInfo = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;
                  const dateStr = new Date(item.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const timeStr = new Date(item.createdAt).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  // Clean phone for WhatsApp (e.g. 919820012345)
                  const cleanPhone = item.phone.replace(/\D/g, '');
                  const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
                    `Hello ${item.parentName}, thank you for requesting a demo on CLARVO! When would be a convenient time for your 1-on-1 consultation?`
                  )}`;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Date & Ref */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800">{dateStr}</div>
                        <div className="text-[11px] text-slate-400">{timeStr}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate max-w-[90px]">
                          {item.id}
                        </div>
                      </td>

                      {/* Parent / Student */}
                      <td className="py-4 px-4">
                        <div className="font-black text-slate-900 text-[13px]">
                          {item.parentName}
                        </div>
                        {item.studentName ? (
                          <div className="text-[11px] text-[#2563EB] font-bold flex items-center gap-1 mt-0.5">
                            <GraduationCap className="w-3 h-3" />
                            <span>Student: {item.studentName}</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic mt-0.5">Student name omitted</div>
                        )}
                      </td>

                      {/* Contact Details */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{item.phone}</span>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                            title="Open WhatsApp Chat"
                          >
                            <Send className="w-3 h-3" />
                          </a>
                          <a
                            href={`tel:${item.phone}`}
                            className="p-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                            title="Call Phone"
                          >
                            <Phone className="w-3 h-3" />
                          </a>
                        </div>
                        {item.email ? (
                          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <a
                              href={`mailto:${item.email}`}
                              className="hover:text-blue-600 truncate max-w-[140px]"
                            >
                              {item.email}
                            </a>
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400 italic mt-0.5">No email provided</div>
                        )}
                      </td>

                      {/* Academic Level */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 whitespace-nowrap">
                          {item.academicLevel}
                        </span>
                      </td>

                      {/* Interest Areas */}
                      <td className="py-4 px-4 max-w-[200px]">
                        <div className="flex flex-wrap gap-1">
                          {item.clarvoExploration?.slice(0, 2).map((exp, idx) => (
                            <span
                              key={idx}
                              className="inline-block text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md truncate max-w-[170px]"
                            >
                              {exp}
                            </span>
                          ))}
                          {(item.clarvoExploration?.length || 0) > 2 && (
                            <span className="text-[10px] text-slate-400 font-bold">
                              +{item.clarvoExploration.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Preferred Slot */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-[11px]">
                          <Clock className="w-3 h-3 text-[#2563EB]" />
                          <span>{item.preferredTimeFrame}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value as EnquiryRecord['status'])
                          }
                          className={`h-7 px-2.5 rounded-lg border text-[11px] font-extrabold focus:outline-none cursor-pointer ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                        >
                          <option value="new">New Lead</option>
                          <option value="contacted">Contacted</option>
                          <option value="scheduled">Demo Scheduled</option>
                          <option value="converted">Converted</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedEnquiry(item)}
                            className="h-7 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDeleteEnquiry(item.id)}
                            className="p-1 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILED ENQUIRY MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {selectedEnquiry.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                      STATUS_CONFIG[selectedEnquiry.status].bg
                    } ${STATUS_CONFIG[selectedEnquiry.status].text} ${
                      STATUS_CONFIG[selectedEnquiry.status].border
                    }`}
                  >
                    {STATUS_CONFIG[selectedEnquiry.status].label}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {selectedEnquiry.parentName}
                </h2>
                <p className="text-xs text-slate-500">
                  Received on {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}
                </p>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Contact Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase">Contact Phone</div>
                <div className="text-sm font-black text-slate-900">{selectedEnquiry.phone}</div>
              </div>

              <div className="flex items-center gap-2">
                {(() => {
                  const clean = selectedEnquiry.phone.replace(/\D/g, '');
                  const wa = clean.length === 10 ? `91${clean}` : clean;
                  return (
                    <a
                      href={`https://wa.me/${wa}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  );
                })()}

                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>

                {selectedEnquiry.email && (
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="h-8 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>

            {/* Questions & Answers Grid */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Student Name
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedEnquiry.studentName || 'Not specified'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Academic Level
                  </span>
                  <span className="font-bold text-[#2563EB]">
                    {selectedEnquiry.academicLevel}
                  </span>
                </div>
              </div>

              {/* Development Areas */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">
                  Areas of Student Development
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEnquiry.developmentAreas?.length > 0 ? (
                    selectedEnquiry.developmentAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200"
                      >
                        {area}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">None selected</span>
                  )}
                </div>
              </div>

              {/* Offerings of Interest */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">
                  What Would You Like to Explore with CLARVO?
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEnquiry.clarvoExploration?.length > 0 ? (
                    selectedEnquiry.clarvoExploration.map((opt, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200"
                      >
                        {opt}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">None selected</span>
                  )}
                </div>
              </div>

              {/* Preferred Slot & Parent Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Preferred Time Slot
                  </span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                    {selectedEnquiry.preferredTimeFrame}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Source Page
                  </span>
                  <span className="font-mono text-slate-600 text-xs">
                    {selectedEnquiry.sourcePage || '/book-a-demo'}
                  </span>
                </div>
              </div>

              {selectedEnquiry.notes && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Parent Specific Questions / Notes
                  </span>
                  <p className="text-slate-800 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                    “{selectedEnquiry.notes}”
                  </p>
                </div>
              )}
            </div>

            {/* Internal Counselor / Admin Notes Editor */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Internal Admin &amp; Counselor Notes</span>
                </label>
                {notesSaveSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </span>
                )}
              </div>
              <textarea
                rows={3}
                value={adminNotesInput}
                onChange={(e) => setAdminNotesInput(e.target.value)}
                placeholder="Add follow-up notes, call records, counselor assignments, demo date/time confirmed..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              />
              <div className="mt-2.5 flex justify-end">
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="h-8 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingNotes ? 'Saving...' : 'Save Notes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
