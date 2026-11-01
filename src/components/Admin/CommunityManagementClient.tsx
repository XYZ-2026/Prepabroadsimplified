'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  QrCode, 
  MessageSquare, 
  Copy, 
  ExternalLink, 
  Save, 
  Check, 
  AlertCircle, 
  Clock, 
  History, 
  Users, 
  Download, 
  Search, 
  RefreshCw, 
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { CommunitySettings, CommunityLead } from '@/lib/community-service';

interface Props {
  initialSettings: CommunitySettings;
  initialLeads: CommunityLead[];
  adminEmail: string;
}

export default function CommunityManagementClient({ initialSettings, initialLeads, adminEmail }: Props) {
  const [settings, setSettings] = useState<CommunitySettings>(initialSettings);
  const [leads, setLeads] = useState<CommunityLead[]>(initialLeads);
  const [whatsappUrlInput, setWhatsappUrlInput] = useState(initialSettings.activeWhatsAppUrl || '');
  const [updateNote, setUpdateNote] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [copiedQrUrl, setCopiedQrUrl] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Resolve QR landing page full URL
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const publicQrPath = settings.qrLandingPageUrl || '/join-community';
  const fullQrUrl = mounted && typeof window !== 'undefined'
    ? `${window.location.origin}${publicQrPath}`
    : `https://clarvo.in${publicQrPath}`;

  const handleCopyQrUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullQrUrl);
      setCopiedQrUrl(true);
      setTimeout(() => setCopiedQrUrl(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSaveWhatsAppUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const res = await fetch('/api/admin/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeWhatsAppUrl: whatsappUrlInput,
          note: updateNote,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSaveError(data.error || 'Failed to update WhatsApp link. Please verify the URL.');
        setSaving(false);
        return;
      }

      setSettings(data.settings);
      setWhatsappUrlInput(data.settings.activeWhatsAppUrl);
      setUpdateNote('');
      setSaveSuccess('WhatsApp invitation URL updated successfully! All new QR submissions will now redirect to this link.');
      setSaving(false);
      setTimeout(() => setSaveSuccess(null), 5000);
    } catch (err: any) {
      setSaveError(err.message || 'Network error occurred while saving.');
      setSaving(false);
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/admin/community');
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.leads)) setLeads(data.leads);
        if (data.settings) setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed refreshing community data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Filter leads by search
  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    const q = searchQuery.toLowerCase();
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.schoolName.toLowerCase().includes(q) ||
        l.grade.toLowerCase().includes(q) ||
        (l.priorityGoal && l.priorityGoal.toLowerCase().includes(q))
    );
  }, [leads, searchQuery]);

  // Export leads to CSV
  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['ID', 'Name', 'Phone', 'Email', 'School Name', 'Grade', 'Priority / Looking For', 'Submitted At', 'Source'];
    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.schoolName.replace(/"/g, '""')}"`,
      `"${l.grade}"`,
      `"${(l.priorityGoal || 'General Community').replace(/"/g, '""')}"`,
      `"${new Date(l.createdAt).toLocaleString()}"`,
      `"${l.source}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CLARVO_Community_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E7EC] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>COMMUNITY ACQUISITION &amp; QR ROUTING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#080F1C] tracking-tight">
            Student &amp; Parent Community Settings
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage the active WhatsApp group destination URL for the QR lead-generation landing page without code changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/join-community"
            target="_blank"
            className="h-10 px-4 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#080F1C] text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs hover:border-[#2563EB]"
          >
            <span>Preview Landing Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#2563EB]" />
          </Link>
        </div>
      </div>

      {/* ── Top Row: QR URL Box + Active WhatsApp Config ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 1. Stable QR-Code Landing Page Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#CBD5E1] p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#2563EB]" />
                <span>Stable QR Destination</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Permanent URL
              </span>
            </div>

            <h3 className="text-base font-extrabold text-[#080F1C]">
              QR Code Landing Page
            </h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Print this permanent URL or its QR code on marketing flyers, standees, and brochures. It always resolves the currently active WhatsApp link on lead submission.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] break-all font-mono text-xs text-[#080F1C]">
              {fullQrUrl}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E4E7EC] flex items-center gap-3">
            <button
              onClick={handleCopyQrUrl}
              className="flex-1 h-10 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              {copiedQrUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedQrUrl ? 'Copied to Clipboard!' : 'Copy QR Landing URL'}</span>
            </button>
            <Link
              href="/join-community"
              target="_blank"
              className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#080F1C] text-xs font-bold inline-flex items-center justify-center gap-1 transition-all"
              title="Open Public Landing Page"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 2. Active WhatsApp Link Manager (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#CBD5E1] p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#E4E7EC] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#080F1C]">
                  Active WhatsApp Group Invitation URL
                </h3>
                <p className="text-xs text-[#64748B]">
                  When a group reaches maximum capacity (1,024 members), paste the new group invite URL below.
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-flex text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Instant Live Update
            </span>
          </div>

          {saveSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{saveSuccess}</span>
            </div>
          )}

          {saveError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{saveError}</span>
            </div>
          )}

          <form onSubmit={handleSaveWhatsAppUrl} className="space-y-4">
            <div>
              <label htmlFor="whatsappUrl" className="block text-xs font-bold text-[#080F1C] mb-1">
                WhatsApp Invitation URL (HTTPS) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="whatsappUrl"
                  type="url"
                  required
                  value={whatsappUrlInput}
                  onChange={(e) => setWhatsappUrlInput(e.target.value)}
                  placeholder="https://chat.whatsapp.com/..."
                  className="flex-1 h-11 px-3.5 rounded-xl border border-[#CBD5E1] text-xs font-mono text-[#080F1C] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]"
                />
                {whatsappUrlInput && (
                  <a
                    href={whatsappUrlInput}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#080F1C] text-xs font-bold inline-flex items-center gap-1 shrink-0"
                    title="Test WhatsApp Group Link"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                Must be an official WhatsApp invitation link (e.g. <code>https://chat.whatsapp.com/JevCH59LcE33ahR612sLEG</code>).
              </p>
            </div>

            <div>
              <label htmlFor="updateNote" className="block text-xs font-bold text-[#080F1C] mb-1">
                Update Reason / Note (Optional)
              </label>
              <input
                id="updateNote"
                type="text"
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
                placeholder="e.g. Community Group 1 full (1,024 members), switched to Group 2"
                className="w-full h-10 px-3.5 rounded-xl border border-[#CBD5E1] text-xs text-[#080F1C] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E4E7EC]">
              <div className="text-[11px] text-[#64748B]">
                Last updated: <strong>{new Date(settings.updatedAt).toLocaleString()}</strong> by{' '}
                <span className="text-[#2563EB]">{settings.updatedBy}</span>
              </div>

              <button
                type="submit"
                disabled={saving || !whatsappUrlInput.trim()}
                className="h-10 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving Changes...' : 'Save New WhatsApp Link'}</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* ── Link Change Audit History ── */}
      <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-4 border-b border-[#E4E7EC] pb-3">
          <History className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-base font-extrabold text-[#080F1C]">
            WhatsApp Invitation Change History
          </h3>
          <span className="text-xs text-[#64748B]">({settings.history?.length || 0} recorded updates)</span>
        </div>

        {(!settings.history || settings.history.length === 0) ? (
          <p className="text-xs text-[#64748B] py-2">No previous link changes recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E4E7EC] text-[#64748B] uppercase tracking-wider text-[10.5px]">
                  <th className="py-2.5 px-3">Date &amp; Time</th>
                  <th className="py-2.5 px-3">WhatsApp Group Link</th>
                  <th className="py-2.5 px-3">Updated By</th>
                  <th className="py-2.5 px-3">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC]">
                {settings.history.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-3 whitespace-nowrap text-[#475569]">
                      {new Date(item.updatedAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#2563EB] max-w-[280px] truncate">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        <span className="truncate">{item.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>
                    <td className="py-2.5 px-3 text-[#080F1C] font-semibold whitespace-nowrap">
                      {item.updatedBy}
                    </td>
                    <td className="py-2.5 px-3 text-[#64748B]">
                      {item.note || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Community QR Leads Management Table ── */}
      <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-[#E4E7EC] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-base font-extrabold text-[#080F1C]">
                Community Leads ({leads.length})
              </h3>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Verified leads collected via the QR landing page (/join-community).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads, priorities..."
                className="h-9 pl-8 pr-3 rounded-xl border border-[#CBD5E1] text-xs text-[#080F1C] placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-9 px-3 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#080F1C] text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs hover:border-[#2563EB] cursor-pointer disabled:opacity-50"
              title="Refresh leads and settings"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#2563EB] ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={leads.length === 0}
              className="h-9 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#080F1C] text-xs font-bold inline-flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="text-center py-8 text-[#64748B] text-xs">
            {searchQuery ? 'No leads matching your search criteria.' : 'No community leads recorded yet. Scan the QR code to test.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E4E7EC] text-[#64748B] uppercase tracking-wider text-[10.5px]">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">School Name</th>
                  <th className="py-2.5 px-3">Grade</th>
                  <th className="py-2.5 px-3">Priority / Looking For</th>
                  <th className="py-2.5 px-3">Submitted At</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC]">
                {filteredLeads.map((lead: CommunityLead) => (
                  <tr key={lead.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-3 font-bold text-[#080F1C] whitespace-nowrap">
                      {lead.name}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11.5px] text-[#475569] whitespace-nowrap">
                      <a href={`tel:${lead.phone}`} className="hover:text-[#2563EB]">
                        {lead.phone}
                      </a>
                    </td>
                    <td className="py-3 px-3 text-[#475569] whitespace-nowrap">
                      <a href={`mailto:${lead.email}`} className="hover:text-[#2563EB]">
                        {lead.email}
                      </a>
                    </td>
                    <td className="py-3 px-3 text-[#080F1C]">
                      {lead.schoolName}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-bold text-[#2563EB] bg-[#E8F0FF] px-2 py-0.5 rounded text-[11px]">
                        {lead.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {lead.priorityGoal ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#E8F0FF] text-[#2563EB] border border-[#2563EB]/20">
                          {lead.priorityGoal}
                        </span>
                      ) : (
                        <span className="text-[#94A3B8] text-[11px] italic">General Community</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[#64748B] whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Recorded</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
