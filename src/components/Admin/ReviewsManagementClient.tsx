'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Download,
  Star,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  EyeOff,
  Sparkles,
  School,
  GraduationCap,
  Calendar,
  MessageSquare,
  Trash2,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  X,
  Save,
  Check,
  User,
  ShieldCheck,
  Tag,
  Clock
} from 'lucide-react';
import { ReviewRecord } from '@/lib/review-service';

interface Props {
  initialReviews: ReviewRecord[];
}

const STATUS_CONFIG: Record<
  ReviewRecord['status'],
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  pending: { label: 'Pending Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
  approved: { label: 'Approved', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
  rejected: { label: 'Rejected', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle },
};

export default function ReviewsManagementClient({ initialReviews }: Props) {
  const [reviews, setReviews] = useState<ReviewRecord[]>(initialReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [presentationFilter, setPresentationFilter] = useState<string>('all'); // all | featured | hidden
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedReview, setSelectedReview] = useState<ReviewRecord | null>(null);
  
  // Drawer/Modal edit state
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [headlineInput, setHeadlineInput] = useState('');
  const [impactTagInput, setImpactTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state if initialReviews updates
  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  // When modal opens, sync inputs
  useEffect(() => {
    if (selectedReview) {
      setAdminNotesInput(selectedReview.adminNotes || '');
      setHeadlineInput(selectedReview.headline || '');
      setImpactTagInput(selectedReview.impactTag || '');
      setSaveSuccess(false);
    }
  }, [selectedReview]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Refresh reviews from API
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
        showToast('Reviews refreshed successfully');
      }
    } catch (err) {
      console.error('Failed to refresh reviews:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Metrics & Stats
  const stats = useMemo(() => {
    const total = reviews.length;
    const featuredCount = reviews.filter((r) => r.isFeatured && r.status === 'approved').length;
    const pendingCount = reviews.filter((r) => r.status === 'pending').length;
    const approvedCount = reviews.filter((r) => r.status === 'approved').length;
    const rejectedCount = reviews.filter((r) => r.status === 'rejected').length;
    const avgRating = total > 0
      ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / total).toFixed(1)
      : '5.0';

    return { total, featuredCount, pendingCount, approvedCount, rejectedCount, avgRating };
  }, [reviews]);

  // Filtered List
  const filteredList = useMemo(() => {
    return reviews.filter((item) => {
      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      
      // Presentation filter
      if (presentationFilter === 'featured' && (!item.isFeatured || item.status !== 'approved')) return false;
      if (presentationFilter === 'hidden' && item.isFeatured && item.status === 'approved') return false;

      // Rating filter
      if (ratingFilter !== 'all' && String(item.rating) !== ratingFilter) return false;

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSchool = item.school.toLowerCase().includes(q);
        const matchesGrade = item.grade.toLowerCase().includes(q);
        const matchesHeadline = item.headline.toLowerCase().includes(q);
        const matchesComment = item.comment.toLowerCase().includes(q);
        const matchesEmail = item.email?.toLowerCase().includes(q);
        const matchesTag = item.impactTag?.toLowerCase().includes(q);

        if (!matchesName && !matchesSchool && !matchesGrade && !matchesHeadline && !matchesComment && !matchesEmail && !matchesTag) {
          return false;
        }
      }

      return true;
    });
  }, [reviews, statusFilter, presentationFilter, ratingFilter, searchTerm]);

  // 1-Click Toggle "Presented on Website" (isFeatured)
  const handleTogglePresented = async (review: ReviewRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextFeatured = !review.isFeatured;
    const nextStatus = nextFeatured && review.status !== 'approved' ? 'approved' : review.status;

    // Optimistic Update
    setReviews((prev) =>
      prev.map((r) =>
        r.id === review.id ? { ...r, isFeatured: nextFeatured, status: nextStatus } : r
      )
    );

    if (selectedReview && selectedReview.id === review.id) {
      setSelectedReview((prev) => (prev ? { ...prev, isFeatured: nextFeatured, status: nextStatus } : null));
    }

    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: nextFeatured, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(nextFeatured ? 'Review marked as Presented on Website' : 'Review removed from Website presentation');
      } else {
        // Rollback
        setReviews((prev) =>
          prev.map((r) => (r.id === review.id ? review : r))
        );
      }
    } catch (err) {
      console.error('Failed to toggle presented flag:', err);
      // Rollback
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? review : r))
      );
    }
  };

  // Inline Status Change (Pending / Approved / Rejected)
  const handleStatusChange = async (id: string, newStatus: ReviewRecord['status'], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = reviews.find((r) => r.id === id);
    if (!target) return;

    // If rejecting or pending, automatically remove from featured if it was featured
    const nextFeatured = newStatus === 'approved' ? target.isFeatured : false;

    // Optimistic update
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: newStatus, isFeatured: nextFeatured } : r
      )
    );

    if (selectedReview && selectedReview.id === id) {
      setSelectedReview((prev) => (prev ? { ...prev, status: newStatus, isFeatured: nextFeatured } : null));
    }

    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, isFeatured: nextFeatured }),
      });
      showToast(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  // Save Modal Edits (Admin Notes, Headline, Tag)
  const handleSaveModal = async () => {
    if (!selectedReview) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/admin/reviews/${selectedReview.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminNotes: adminNotesInput,
          headline: headlineInput,
          impactTag: impactTagInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === selectedReview.id
              ? {
                  ...r,
                  adminNotes: adminNotesInput,
                  headline: headlineInput,
                  impactTag: impactTagInput,
                }
              : r
          )
        );
        setSelectedReview((prev) =>
          prev
            ? {
                ...prev,
                adminNotes: adminNotesInput,
                headline: headlineInput,
                impactTag: impactTagInput,
              }
            : null
        );
        setSaveSuccess(true);
        showToast('Review details saved successfully');
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Failed to save review details:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Review
  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;

    // Optimistic delete
    setReviews((prev) => prev.filter((r) => r.id !== id));
    if (selectedReview && selectedReview.id === id) {
      setSelectedReview(null);
    }

    try {
      await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      showToast('Review deleted permanently');
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Role',
      'Email',
      'School',
      'Grade',
      'Report Type',
      'Rating',
      'Headline',
      'Comment',
      'Impact Tag',
      'Status',
      'Presented On Website',
      'Admin Notes',
      'Created At',
    ];

    const rows = filteredList.map((r) => [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      r.role,
      r.email || '',
      `"${r.school.replace(/"/g, '""')}"`,
      r.grade,
      `"${r.reportType.replace(/"/g, '""')}"`,
      r.rating,
      `"${r.headline.replace(/"/g, '""')}"`,
      `"${r.comment.replace(/"/g, '""')}"`,
      r.impactTag || '',
      r.status,
      r.isFeatured ? 'YES' : 'NO',
      `"${(r.adminNotes || '').replace(/"/g, '""')}"`,
      r.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CLARVO_Student_Reviews_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#080F1C] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Student Reviews &amp; Testimonials
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2563EB] text-xs font-extrabold uppercase tracking-wider">
              Admin Moderation
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Inspect authentic student and parent feedback submitted across report pages, and select which testimonials are presented on the website.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-60 cursor-pointer"
            title="Refresh reviews list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#2563EB]' : ''}`} />
            Refresh
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="Export filtered reviews to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>

          <Link
            href="/submit-review"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            title="Open student review submission form in a new tab"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Review Form Link
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Reviews */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Received</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{stats.total}</div>
          <span className="text-[11px] font-semibold text-slate-500 mt-1">Across all assessment reports</span>
        </div>

        {/* Presented On Website (Highlighted) */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-2xl border border-blue-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#2563EB] uppercase tracking-wider">Presented on Site</span>
            <Eye className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1E3A8A] mt-2">{stats.featuredCount}</div>
          <span className="text-[11px] font-bold text-[#2563EB] mt-1">Active on Public Homepage</span>
        </div>

        {/* Pending Moderation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Pending Moderation</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">{stats.pendingCount}</div>
          <span className="text-[11px] font-semibold text-slate-500 mt-1">Requires admin review</span>
        </div>

        {/* Approved Total */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Approved Total</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{stats.approvedCount}</div>
          <span className="text-[11px] font-semibold text-slate-500 mt-1">Verified testimonials</span>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Rating</span>
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{stats.avgRating} <span className="text-sm font-bold text-slate-400">/ 5.0</span></div>
          <span className="text-[11px] font-semibold text-slate-500 mt-1">Overall student satisfaction</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, school, headline, keyword, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#2563EB] cursor-pointer"
            >
              <option value="all">All Statuses ({reviews.length})</option>
              <option value="pending">Pending ({stats.pendingCount})</option>
              <option value="approved">Approved ({stats.approvedCount})</option>
              <option value="rejected">Rejected ({stats.rejectedCount})</option>
            </select>

            {/* Presentation Filter */}
            <select
              value={presentationFilter}
              onChange={(e) => setPresentationFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#2563EB] cursor-pointer"
            >
              <option value="all">All Presentation States</option>
              <option value="featured">✨ Presented on Website ({stats.featuredCount})</option>
              <option value="hidden">Hidden / Internal Only</option>
            </select>

            {/* Rating Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#2563EB] cursor-pointer"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars ★★★★★</option>
              <option value="4">4 Stars ★★★★</option>
              <option value="3">3 Stars ★★★</option>
              <option value="2">2 Stars ★★</option>
              <option value="1">1 Star ★</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pill Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-bold mr-1">Quick Views:</span>
          <button
            onClick={() => { setStatusFilter('all'); setPresentationFilter('all'); setRatingFilter('all'); setSearchTerm(''); }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              statusFilter === 'all' && presentationFilter === 'all' && ratingFilter === 'all' && !searchTerm
                ? 'bg-[#2563EB] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => { setStatusFilter('all'); setPresentationFilter('featured'); }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              presentationFilter === 'featured'
                ? 'bg-[#2563EB] text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <Eye className="w-3 h-3" /> Presented on Website ({stats.featuredCount})
          </button>
          <button
            onClick={() => { setStatusFilter('pending'); setPresentationFilter('all'); }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3 h-3" /> Needs Review ({stats.pendingCount})
          </button>
        </div>
      </div>

      {/* Main Reviews Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-500">
            Showing <strong className="text-slate-900">{filteredList.length}</strong> of {reviews.length} reviews
          </div>
          <div className="text-[11px] font-bold text-slate-400">
            Click any row to inspect, edit notes, or moderate
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No reviews found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No student reviews match the active search filters. Try clearing filters or submit a test review using the review form.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Student / Reviewer</th>
                  <th className="py-3 px-4">School &amp; Grade</th>
                  <th className="py-3 px-4">Report Evaluated</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Review &amp; Headline</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Presented on Website</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredList.map((review) => {
                  const statusConf = STATUS_CONFIG[review.status] || STATUS_CONFIG.pending;
                  const isPresented = review.isFeatured && review.status === 'approved';

                  return (
                    <tr
                      key={review.id}
                      onClick={() => setSelectedReview(review)}
                      className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                        selectedReview?.id === review.id ? 'bg-blue-50/70' : ''
                      }`}
                    >
                      {/* Reviewer Name & Role */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-black flex items-center justify-center shrink-0 border border-slate-200 uppercase">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                              {review.name}
                              {review.role === 'parent' && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                                  Parent
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                              {review.email || 'No email provided'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* School & Grade */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800">{review.grade}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[170px]" title={review.school}>
                          {review.school}
                        </div>
                      </td>

                      {/* Report Evaluated */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 max-w-[160px] truncate" title={review.reportType}>
                          {review.reportType}
                        </span>
                      </td>

                      {/* Star Rating */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-[11px] font-bold text-slate-700">{review.rating}</span>
                        </div>
                      </td>

                      {/* Headline & Comment */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 truncate" title={review.headline}>
                          “{review.headline}”
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5" title={review.comment}>
                          {review.comment}
                        </div>
                        {review.impactTag && (
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                              <Tag className="w-2.5 h-2.5" /> {review.impactTag}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <select
                            value={review.status}
                            onChange={(e) => handleStatusChange(review.id, e.target.value as ReviewRecord['status'])}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border cursor-pointer appearance-none pr-6 focus:outline-none transition-all ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </td>

                      {/* 1-Click "Presented on Website" Toggle */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleTogglePresented(review, e)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer border ${
                            isPresented
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 shadow-xs'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                          title={isPresented ? 'Click to hide from website' : 'Click to present this review on website testimonials'}
                        >
                          {isPresented ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Presented</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReview(review)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
                            title="Inspect full details and admin notes"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(review.id, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete review"
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

      {/* Review Inspection & Moderation Modal Drawer */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-50 p-5 sm:p-6 border-b border-slate-200 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                  {selectedReview.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">{selectedReview.name}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 text-[10px] font-extrabold uppercase">
                      {selectedReview.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>{selectedReview.grade}</span>
                    <span>•</span>
                    <span>{selectedReview.school}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedReview(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto text-xs">
              {/* Presentation Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                  selectedReview.isFeatured && selectedReview.status === 'approved'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <span className="font-black text-xs block">
                    {selectedReview.isFeatured && selectedReview.status === 'approved'
                      ? '✨ Currently Presented on Website Testimonials'
                      : '🔒 Hidden from Website (Internal Only)'}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {selectedReview.isFeatured && selectedReview.status === 'approved'
                      ? 'This review is published and visible on the public landing page.'
                      : 'Toggle the switch to make this review visible on the homepage.'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleTogglePresented(selectedReview)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    selectedReview.isFeatured && selectedReview.status === 'approved'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                  }`}
                >
                  {selectedReview.isFeatured && selectedReview.status === 'approved' ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Remove from Website
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Present on Website
                    </>
                  )}
                </button>
              </div>

              {/* Review Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Evaluated Report</span>
                  <span className="font-bold text-slate-800 text-xs block mt-0.5">{selectedReview.reportType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Star Rating</span>
                  <div className="flex items-center gap-1 text-amber-400 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < selectedReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-slate-800 font-bold">{selectedReview.rating} / 5</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Submitted On</span>
                  <span className="font-bold text-slate-800 text-xs block mt-0.5">
                    {new Date(selectedReview.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Review Headline & Full Comment */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Student Headline
                </label>
                <input
                  type="text"
                  value={headlineInput}
                  onChange={(e) => setHeadlineInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Student Testimonial Body
                </label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 italic leading-relaxed text-xs sm:text-sm">
                  “{selectedReview.comment}”
                </div>
              </div>

              {/* Impact Tag Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Outcome / Impact Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stream Selection Clarity, Digital SAT 1540, IB Pathways"
                  value={impactTagInput}
                  onChange={(e) => setImpactTagInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Admin Internal Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Internal Admin Notes (Private)
                  </label>
                  <span className="text-[10px] text-slate-400">Only visible to administrators</span>
                </div>
                <textarea
                  rows={3}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="Add verification notes, student context, or follow-up details..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-[#2563EB] text-xs resize-none"
                />
              </div>

              {/* Moderation Status Radio Buttons */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Moderation Decision
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['pending', 'approved', 'rejected'] as ReviewRecord['status'][]).map((st) => {
                    const isSelected = selectedReview.status === st;
                    const conf = STATUS_CONFIG[st];
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(selectedReview.id, st)}
                        className={`p-2.5 rounded-xl border text-center font-bold text-xs capitalize transition-all cursor-pointer ${
                          isSelected
                            ? `${conf.bg} ${conf.text} ${conf.border} ring-2 ring-blue-500/20 shadow-xs`
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {conf.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={(e) => handleDelete(selectedReview.id, e)}
                className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveModal}
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" /> Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" /> {isSaving ? 'Saving...' : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
