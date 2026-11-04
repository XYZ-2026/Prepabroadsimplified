'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Search, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  FileSpreadsheet, 
  Trash2,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { CommunitySettings, CommunityLead, CommunityType, CommunityCampaign } from '@/lib/community-service';

const LinkedInIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.66 1.66 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.66 1.66 0 0 0 1.66-1.66c0-.92-.74-1.66-1.66-1.66Z" />
  </svg>
);

interface Props {
  initialSettings?: CommunitySettings;
  initialStudentSettings?: CommunitySettings;
  initialCounsellorSettings?: CommunitySettings;
  initialLeads: CommunityLead[];
  adminEmail: string;
}

export default function CommunityManagementClient({ 
  initialSettings, 
  initialStudentSettings, 
  initialCounsellorSettings, 
  initialLeads, 
  adminEmail 
}: Props) {
  // Settings for both independent communities
  const [studentSettings, setStudentSettings] = useState<CommunitySettings>(
    initialStudentSettings || initialSettings || {
      activeWhatsAppUrl: 'https://chat.whatsapp.com/JevCH59LcE33ahR612sLEG',
      qrLandingPageUrl: '/join-community',
      updatedAt: new Date().toISOString(),
      updatedBy: 'System',
      history: [],
    }
  );

  const [counsellorSettings, setCounsellorSettings] = useState<CommunitySettings>(
    initialCounsellorSettings || {
      activeWhatsAppUrl: 'https://chat.whatsapp.com/C6UVHin2Qkv9rhBqON8BHQ',
      qrLandingPageUrl: '/join-counsellor-community',
      updatedAt: new Date().toISOString(),
      updatedBy: 'System',
      history: [],
    }
  );

  // Active community configuration tab in admin dashboard
  const [activeCommunityTab, setActiveCommunityTab] = useState<CommunityType>('counsellor_mentor');

  // Input states for each community
  const [studentUrlInput, setStudentUrlInput] = useState(studentSettings.activeWhatsAppUrl || '');
  const [studentNote, setStudentNote] = useState('');
  
  const [counsellorUrlInput, setCounsellorUrlInput] = useState(counsellorSettings.activeWhatsAppUrl || '');
  const [counsellorNote, setCounsellorNote] = useState('');

  const [leads, setLeads] = useState<CommunityLead[]>(initialLeads);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [copiedQrUrl, setCopiedQrUrl] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [campaignFilter, setCampaignFilter] = useState<'all' | CommunityCampaign>('all');

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeSettings = activeCommunityTab === 'counsellor_mentor' ? counsellorSettings : studentSettings;
  const currentUrlInput = activeCommunityTab === 'counsellor_mentor' ? counsellorUrlInput : studentUrlInput;
  const currentNote = activeCommunityTab === 'counsellor_mentor' ? counsellorNote : studentNote;

  const publicQrPath = activeSettings.qrLandingPageUrl;
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

    const isCounsellor = activeCommunityTab === 'counsellor_mentor';
    const targetUrl = isCounsellor ? counsellorUrlInput : studentUrlInput;
    const targetNote = isCounsellor ? counsellorNote : studentNote;

    try {
      const res = await fetch('/api/admin/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeWhatsAppUrl: targetUrl,
          note: targetNote,
          communityType: activeCommunityTab,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSaveError(data.error || 'Failed to update WhatsApp link. Please verify the URL.');
        setSaving(false);
        return;
      }

      if (isCounsellor) {
        setCounsellorSettings(data.settings);
        setCounsellorUrlInput(data.settings.activeWhatsAppUrl);
        setCounsellorNote('');
        setSaveSuccess('Global Counselling Association WhatsApp invitation URL updated successfully! All new QR submissions will now redirect to this link.');
      } else {
        setStudentSettings(data.settings);
        setStudentUrlInput(data.settings.activeWhatsAppUrl);
        setStudentNote('');
        setSaveSuccess('Student & Parent Community WhatsApp invitation URL updated successfully! All new QR submissions will now redirect to this link.');
      }

      setSaving(false);
      setTimeout(() => setSaveSuccess(null), 6000);
    } catch (err: any) {
      setSaveError(err.message || 'Network error occurred while saving.');
      setSaving(false);
    }
  };

  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    setDeletingId(leadId);
    try {
      const res = await fetch(`/api/admin/community?id=${encodeURIComponent(leadId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
      } else {
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
      }
    } catch (err) {
      console.error('Delete lead error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePurgeTestLeads = async () => {
    if (!window.confirm('Remove all test leads from the community database?')) return;
    setRefreshing(true);
    try {
      const res = await fetch('/api/admin/community?purgeTest=true', {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Purge error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/admin/community');
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.leads)) setLeads(data.leads);
        if (data.studentSettings) {
          setStudentSettings(data.studentSettings);
          setStudentUrlInput(data.studentSettings.activeWhatsAppUrl);
        }
        if (data.counsellorSettings) {
          setCounsellorSettings(data.counsellorSettings);
          setCounsellorUrlInput(data.counsellorSettings.activeWhatsAppUrl);
        }
      }
    } catch (err) {
      console.error('Failed refreshing community data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Filter leads by search query and campaign filter tab
  const filteredLeads = useMemo(() => {
    let result = leads;
    if (campaignFilter !== 'all') {
      result = result.filter((l) => l.source === campaignFilter);
    }

    if (!searchQuery.trim()) return result;
    const q = searchQuery.toLowerCase();
    return result.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.schoolName && l.schoolName.toLowerCase().includes(q)) ||
        (l.grade && l.grade.toLowerCase().includes(q)) ||
        (l.linkedInUrl && l.linkedInUrl.toLowerCase().includes(q)) ||
        (l.priorityGoal && l.priorityGoal.toLowerCase().includes(q))
    );
  }, [leads, searchQuery, campaignFilter]);

  const studentCount = useMemo(() => leads.filter((l) => l.source === 'clarvo_student_parent_community').length, [leads]);
  const counsellorCount = useMemo(() => leads.filter((l) => l.source === 'mentor_counsellor_community').length, [leads]);

  // Export leads to CSV
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) return;
    const headers = ['ID', 'Campaign', 'Name', 'Phone', 'Email', 'School / Organisation', 'Grade / Role', 'LinkedIn Profile', 'Priority / Goal', 'Submitted At'];
    const rows = filteredLeads.map((l) => [
      `"${l.id}"`,
      `"${l.source === 'mentor_counsellor_community' ? 'Global Counselling Association' : 'Student & Parent Community'}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${(l.schoolName || '—').replace(/"/g, '""')}"`,
      `"${(l.grade || (l.source === 'mentor_counsellor_community' ? 'Counsellor / Mentor' : '—')).replace(/"/g, '""')}"`,
      `"${(l.linkedInUrl || '—').replace(/"/g, '""')}"`,
      `"${(l.priorityGoal || 'General Community').replace(/"/g, '""')}"`,
      `"${new Date(l.createdAt).toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CLARVO_Community_Leads_${campaignFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E7EC] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1258DE] mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>COMMUNITY ACQUISITION &amp; QR ROUTING HUBS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#080F1C] tracking-tight">
            Community Landing Pages &amp; WhatsApp Settings
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Independently manage active WhatsApp destination links and review QR lead submissions for both communities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/join-counsellor-community"
            target="_blank"
            className="h-10 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#080F1C] text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs hover:border-[#1258DE]"
          >
            <span>Counsellor Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#1258DE]" />
          </Link>
          <Link
            href="/join-community"
            target="_blank"
            className="h-10 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#080F1C] text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs hover:border-[#1258DE]"
          >
            <span>Student &amp; Parent Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#1258DE]" />
          </Link>
        </div>
      </div>

      {/* ── Community Selector Ribbon (Strictly Independent Configurations) ── */}
      <div className="bg-[#F1F5F9] p-1.5 rounded-2xl flex flex-col sm:flex-row gap-1.5">
        
        {/* Tab 1: Global Counselling Association */}
        <button
          onClick={() => {
            setActiveCommunityTab('counsellor_mentor');
            setSaveError(null);
            setSaveSuccess(null);
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
            activeCommunityTab === 'counsellor_mentor'
              ? 'bg-white shadow-sm border border-[#CBD5E1]'
              : 'hover:bg-white/60 text-[#64748B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              activeCommunityTab === 'counsellor_mentor'
                ? 'bg-[#1258DE] text-white'
                : 'bg-slate-200 text-slate-600'
            }`}>
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#080F1C]">
                  Global Counselling Association
                </span>
                <span className="text-[10px] font-bold text-[#1258DE] bg-[#E6EDFF] px-2 py-0.5 rounded-full border border-[#1258DE]/20">
                  Mentors &amp; Counsellors
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
                Route: /join-counsellor-community
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#080F1C] bg-slate-100 px-2 py-1 rounded-md">
            {counsellorCount} leads
          </span>
        </button>

        {/* Tab 2: Student & Parent Community */}
        <button
          onClick={() => {
            setActiveCommunityTab('student_parent');
            setSaveError(null);
            setSaveSuccess(null);
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
            activeCommunityTab === 'student_parent'
              ? 'bg-white shadow-sm border border-[#CBD5E1]'
              : 'hover:bg-white/60 text-[#64748B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              activeCommunityTab === 'student_parent'
                ? 'bg-[#1258DE] text-white'
                : 'bg-slate-200 text-slate-600'
            }`}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#080F1C]">
                  Student &amp; Parent Community
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Grades 7–12 Families
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
                Route: /join-community
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#080F1C] bg-slate-100 px-2 py-1 rounded-md">
            {studentCount} leads
          </span>
        </button>

      </div>

      {/* ── Active Community Config Row: QR Destination Card + WhatsApp Link Manager ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 1. Stable QR-Code Landing Page Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#CBD5E1] p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#1258DE]" />
                <span>Permanent QR Destination</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Zero Code Change
              </span>
            </div>

            <h3 className="text-base font-extrabold text-[#080F1C]">
              {activeCommunityTab === 'counsellor_mentor'
                ? 'Global Counselling Association QR Link'
                : 'Student & Parent Community QR Link'}
            </h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Print this permanent URL or its QR code on marketing flyers, brochures, standees, and banners. It resolves the currently active WhatsApp link on lead submission.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] break-all font-mono text-xs text-[#080F1C]">
              {fullQrUrl}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E4E7EC] flex items-center gap-3">
            <button
              onClick={handleCopyQrUrl}
              className="flex-1 h-10 px-4 rounded-xl bg-[#1258DE] hover:bg-[#0E46B3] text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              {copiedQrUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedQrUrl ? 'Copied to Clipboard!' : 'Copy QR Landing URL'}</span>
            </button>
            <Link
              href={publicQrPath}
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
                  {activeCommunityTab === 'counsellor_mentor'
                    ? 'Counsellor WhatsApp Invitation URL'
                    : 'Student & Parent WhatsApp Invitation URL'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Updating this link takes effect instantly without site redeployment.
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-flex text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Live &amp; Independent
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
                  value={activeCommunityTab === 'counsellor_mentor' ? counsellorUrlInput : studentUrlInput}
                  onChange={(e) => {
                    if (activeCommunityTab === 'counsellor_mentor') {
                      setCounsellorUrlInput(e.target.value);
                    } else {
                      setStudentUrlInput(e.target.value);
                    }
                  }}
                  placeholder="https://chat.whatsapp.com/..."
                  className="flex-1 h-11 px-3.5 rounded-xl border border-[#CBD5E1] text-xs font-mono text-[#080F1C] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1258DE]"
                />
                {(activeCommunityTab === 'counsellor_mentor' ? counsellorUrlInput : studentUrlInput) && (
                  <a
                    href={activeCommunityTab === 'counsellor_mentor' ? counsellorUrlInput : studentUrlInput}
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
                Must be an official WhatsApp invitation link (e.g. <code>https://chat.whatsapp.com/C6UVHin2Qkv9rhBqON8BHQ</code>).
              </p>
            </div>

            <div>
              <label htmlFor="updateNote" className="block text-xs font-bold text-[#080F1C] mb-1">
                Update Reason / Note (Optional)
              </label>
              <input
                id="updateNote"
                type="text"
                value={activeCommunityTab === 'counsellor_mentor' ? counsellorNote : studentNote}
                onChange={(e) => {
                  if (activeCommunityTab === 'counsellor_mentor') {
                    setCounsellorNote(e.target.value);
                  } else {
                    setStudentNote(e.target.value);
                  }
                }}
                placeholder="e.g. Switched to Counsellor Group 2, capacity full"
                className="w-full h-10 px-3.5 rounded-xl border border-[#CBD5E1] text-xs text-[#080F1C] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1258DE]"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E4E7EC]">
              <div className="text-[11px] text-[#64748B]">
                Last updated: <strong>{new Date(activeSettings.updatedAt).toLocaleString()}</strong> by{' '}
                <span className="text-[#1258DE] font-semibold">{activeSettings.updatedBy}</span>
              </div>

              <button
                type="submit"
                disabled={saving || !currentUrlInput.trim()}
                className="h-10 px-5 rounded-xl bg-[#1258DE] hover:bg-[#0E46B3] text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving Changes...' : 'Save New WhatsApp Link'}</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* ── Link Change Audit History for Current Community ── */}
      <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-4 border-b border-[#E4E7EC] pb-3">
          <History className="w-4 h-4 text-[#1258DE]" />
          <h3 className="text-base font-extrabold text-[#080F1C]">
            {activeCommunityTab === 'counsellor_mentor'
              ? 'Global Counselling Association Link Change History'
              : 'Student & Parent Community Link Change History'}
          </h3>
          <span className="text-xs text-[#64748B]">({activeSettings.history?.length || 0} recorded updates)</span>
        </div>

        {(!activeSettings.history || activeSettings.history.length === 0) ? (
          <p className="text-xs text-[#64748B] py-2">No previous link changes recorded for this community.</p>
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
                {activeSettings.history.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-3 whitespace-nowrap text-[#475569]">
                      {new Date(item.updatedAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#1258DE] max-w-[280px] truncate">
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
        
        {/* Table Controls Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 border-b border-[#E4E7EC] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1258DE]" />
              <h3 className="text-base font-extrabold text-[#080F1C]">
                Community Leads ({filteredLeads.length} of {leads.length})
              </h3>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Verified leads collected via QR landing pages (/join-counsellor-community and /join-community).
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setCampaignFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                campaignFilter === 'all'
                  ? 'bg-[#1258DE] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-[#475569]'
              }`}
            >
              All Leads ({leads.length})
            </button>
            <button
              onClick={() => setCampaignFilter('mentor_counsellor_community')}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                campaignFilter === 'mentor_counsellor_community'
                  ? 'bg-[#1258DE] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-[#475569]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Counsellor Association ({counsellorCount})</span>
            </button>
            <button
              onClick={() => setCampaignFilter('clarvo_student_parent_community')}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                campaignFilter === 'clarvo_student_parent_community'
                  ? 'bg-[#1258DE] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-[#475569]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Student &amp; Parent ({studentCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, phone..."
                className="h-9 pl-8 pr-3 rounded-xl border border-[#CBD5E1] text-xs text-[#080F1C] placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#1258DE]"
              />
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-9 px-3 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#080F1C] text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs hover:border-[#1258DE] cursor-pointer disabled:opacity-50"
              title="Refresh leads and settings"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#1258DE] ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handlePurgeTestLeads}
              disabled={refreshing}
              className="h-9 px-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer"
              title="Remove all mock / test entries"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clean Tests</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={filteredLeads.length === 0}
              className="h-9 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#080F1C] text-xs font-bold inline-flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="text-center py-8 text-[#64748B] text-xs">
            {searchQuery ? 'No leads matching your search criteria.' : 'No community leads recorded yet for this category.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E4E7EC] text-[#64748B] uppercase tracking-wider text-[10.5px]">
                  <th className="py-2.5 px-3">Community / Campaign</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Organisation / School</th>
                  <th className="py-2.5 px-3">Role / Grade</th>
                  <th className="py-2.5 px-3">LinkedIn Profile</th>
                  <th className="py-2.5 px-3">Submitted At</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC]">
                {filteredLeads.map((lead: CommunityLead) => {
                  const isCounsellorLead = lead.source === 'mentor_counsellor_community';
                  return (
                    <tr key={lead.id} className="hover:bg-[#F8FAFC]">
                      {/* Community Badge */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {isCounsellorLead ? (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#1258DE] bg-[#E6EDFF] px-2 py-0.5 rounded-md border border-[#1258DE]/20">
                            <GraduationCap className="w-3 h-3 text-[#1258DE]" />
                            <span>Counsellor Association</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            <Users className="w-3 h-3 text-slate-600" />
                            <span>Student &amp; Parent</span>
                          </span>
                        )}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-3 font-bold text-[#080F1C] whitespace-nowrap">
                        {lead.name}
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-3 font-mono text-[11.5px] text-[#475569] whitespace-nowrap">
                        <a href={`tel:${lead.phone}`} className="hover:text-[#1258DE]">
                          {lead.phone}
                        </a>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-3 text-[#475569] whitespace-nowrap">
                        <a href={`mailto:${lead.email}`} className="hover:text-[#1258DE]">
                          {lead.email}
                        </a>
                      </td>

                      {/* Organisation / School */}
                      <td className="py-3 px-3 text-[#080F1C]">
                        {isCounsellorLead ? (
                          <span className="text-slate-600 italic text-[11px]">Independent / Educational</span>
                        ) : (
                          lead.schoolName || '—'
                        )}
                      </td>

                      {/* Role / Grade */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {isCounsellorLead ? (
                          <span className="font-bold text-[#1258DE] bg-[#E6EDFF] px-2 py-0.5 rounded text-[11px]">
                            Counsellor / Mentor
                          </span>
                        ) : (
                          <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {lead.grade || '—'}
                          </span>
                        )}
                      </td>

                      {/* LinkedIn Profile */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {lead.linkedInUrl ? (
                          <a
                            href={lead.linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#0A66C2] hover:underline"
                          >
                            <LinkedInIcon className="w-3.5 h-3.5 shrink-0 text-[#0A66C2]" />
                            <span>View Profile</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-[#94A3B8] text-[11px]">—</span>
                        )}
                      </td>

                      {/* Submitted At */}
                      <td className="py-3 px-3 text-[#64748B] whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Recorded</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          disabled={deletingId === lead.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
