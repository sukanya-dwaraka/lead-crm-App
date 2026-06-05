import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, Plus, RefreshCw, SlidersHorizontal,
  BarChart2, ChevronDown, X, Filter
} from 'lucide-react';

import { api } from './utils/api';
import { STATUSES } from './components/StatusBadge';
import { StatsPanel } from './components/StatsPanel';
import { LeadTable } from './components/LeadTable';
import { LeadModal } from './components/LeadModal';
import { ConfirmModal } from './components/ConfirmModal';
import { Pagination } from './components/Pagination';
import { ToastContainer, toast } from './components/Toast';

const LIMIT_OPTIONS = [5, 10, 25, 50];

function useDebounce(value, ms = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export default function App() {
  /* ── Leads state ───────────────────────────────────────── */
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [leadsLoading, setLeadsLoading] = useState(true);

  /* ── Stats state ───────────────────────────────────────── */
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showStats, setShowStats] = useState(true);

  /* ── Query params ──────────────────────────────────────── */
  const [searchInput, setSearchInput] = useState('');
  const search = useDebounce(searchInput, 350);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  /* ── Modals ────────────────────────────────────────────── */
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  /* ── Fetch leads ───────────────────────────────────────── */
  const fetchLeads = useCallback(async () => {
    setLeadsLoading(true);
    try {
      const data = await api.getLeads({
        search: search || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        sortBy, sortOrder, page, limit,
      });
      setLeads(data.leads);
      setPagination(data.pagination);
    } catch (e) {
      toast.error('Failed to load leads: ' + e.message);
    } finally {
      setLeadsLoading(false);
    }
  }, [search, statusFilter, sortBy, sortOrder, page, limit]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  /* ── Fetch stats ───────────────────────────────────────── */
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (e) {
      // silently fail stats
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  /* ── Reset page when filters change ───────────────────── */
  useEffect(() => { setPage(1); }, [search, statusFilter, limit]);

  /* ── Sort handler ──────────────────────────────────────── */
  function handleSort(field) {
    if (sortBy === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
  }

  /* ── Create / Edit ─────────────────────────────────────── */
  function openCreate() { setEditingLead(null); setModalOpen(true); }
  function openEdit(lead) { setEditingLead(lead); setModalOpen(true); }

  async function handleSubmit(formData) {
    setModalLoading(true);
    try {
      if (editingLead) {
        await api.updateLead(editingLead.id, formData);
        toast.success('Lead updated successfully');
      } else {
        await api.createLead(formData);
        toast.success('Lead added successfully');
      }
      setModalOpen(false);
      fetchLeads();
      fetchStats();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setModalLoading(false);
    }
  }

  /* ── Delete ────────────────────────────────────────────── */
  function openDelete(lead) { setDeletingLead(lead); }

  async function handleDelete() {
    setModalLoading(true);
    try {
      await api.deleteLead(deletingLead.id);
      toast.success(`${deletingLead.name} deleted`);
      setDeletingLead(null);
      fetchLeads();
      fetchStats();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setModalLoading(false);
    }
  }

  /* ── Render ────────────────────────────────────────────── */
  const hasActiveFilters = search || statusFilter !== 'All';

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Top Nav ──────────────────────────────────────── */}
      <nav style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,12,16,0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100,
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 60,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 32, height: 32,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px',
              boxShadow: '0 0 16px var(--accent-glow)',
            }}>⚡</div>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em' }}>
              Lead<span style={{ color: 'var(--accent)' }}>Flow</span>
            </span>
            <span style={{
              fontSize: '10px', fontWeight: 600, fontFamily: 'var(--font-head)',
              background: 'rgba(79,124,255,0.12)', color: 'var(--accent)',
              border: '1px solid rgba(79,124,255,0.2)', borderRadius: '4px',
              padding: '2px 6px', letterSpacing: '0.04em',
            }}>CRM</span>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowStats(s => !s)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: showStats ? 'rgba(79,124,255,0.12)' : 'var(--surface)',
                border: `1px solid ${showStats ? 'rgba(79,124,255,0.3)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)', padding: '7px 12px',
                color: showStats ? 'var(--accent)' : 'var(--text-2)',
                fontSize: '13px', fontWeight: 500,
                transition: 'var(--transition)',
              }}
            >
              <BarChart2 size={14} />
              <span style={{ display: 'none' }} className="sm-show">Analytics</span>
            </button>

            <button onClick={fetchLeads} title="Refresh" style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '7px',
              color: 'var(--text-2)', display: 'flex', alignItems: 'center',
              transition: 'var(--transition)',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-2)'}
            >
              <RefreshCw size={14} />
            </button>

            <button onClick={openCreate} style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              background: 'var(--accent)', border: 'none',
              borderRadius: 'var(--radius)', padding: '8px 16px',
              color: '#fff', fontSize: '14px', fontWeight: 600,
              fontFamily: 'var(--font-head)',
              transition: 'var(--transition)',
              boxShadow: '0 0 20px var(--accent-glow)',
            }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
            >
              <Plus size={15} />
              Add Lead
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main content ─────────────────────────────────── */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Page header */}
        <div style={{ animation: 'fadeUp 0.4s ease' }}>
          <h1 style={{
            fontFamily: 'var(--font-head)', fontSize: '26px', fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1.1,
          }}>
            Lead Management
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '14px', marginTop: '4px' }}>
            Track, manage, and convert your business leads
          </p>
        </div>

        {/* Analytics */}
        {showStats && (
          <div style={{ animation: 'fadeUp 0.35s ease' }}>
            <StatsPanel stats={stats} loading={statsLoading} />
          </div>
        )}

        {/* ── Toolbar ──────────────────────────────────── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center',
          animation: 'fadeUp 0.4s ease 0.05s both',
        }}>
          {/* Search */}
          <div style={{ flex: '1 1 240px', position: 'relative', minWidth: 0 }}>
            <Search size={15} style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-3)', pointerEvents: 'none',
            }} />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by name, email, or company…"
              style={{
                width: '100%',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '9px 12px 9px 36px',
                color: 'var(--text)', fontSize: '14px', outline: 'none',
                transition: 'border-color var(--transition)',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')} style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer',
                display: 'flex', padding: '2px',
              }}>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Status filter chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['All', ...STATUSES].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: '7px 14px', borderRadius: '99px', fontSize: '13px', fontWeight: 500,
                fontFamily: 'var(--font-head)',
                background: statusFilter === s ? 'var(--accent)' : 'var(--surface)',
                border: `1px solid ${statusFilter === s ? 'var(--accent)' : 'var(--border)'}`,
                color: statusFilter === s ? '#fff' : 'var(--text-2)',
                transition: 'var(--transition)',
                cursor: 'pointer',
              }}
                onMouseEnter={e => { if (statusFilter !== s) e.currentTarget.style.borderColor = 'var(--border2)'; }}
                onMouseLeave={e => { if (statusFilter !== s) e.currentTarget.style.borderColor = 'var(--border)'; }}
              >{s}</button>
            ))}
          </div>

          {/* Limit select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>Per page:</span>
            <select value={limit} onChange={e => setLimit(Number(e.target.value))} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '8px 10px',
              color: 'var(--text)', fontSize: '13px', cursor: 'pointer', outline: 'none',
            }}>
              {LIMIT_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Active filter indicator */}
        {hasActiveFilters && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            animation: 'fadeIn 0.2s ease',
          }}>
            <Filter size={12} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
              Filters active —
              <button onClick={() => { setSearchInput(''); setStatusFilter('All'); }} style={{
                background: 'none', border: 'none', color: 'var(--accent)',
                cursor: 'pointer', fontSize: '12px', padding: '0 4px',
              }}>
                Clear all
              </button>
            </span>
          </div>
        )}

        {/* Table */}
        <div style={{ animation: 'fadeUp 0.4s ease 0.1s both' }}>
          <LeadTable
            leads={leads}
            loading={leadsLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        </div>

        {/* Pagination */}
        {pagination && (
          <div style={{ animation: 'fadeUp 0.3s ease' }}>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        )}
      </main>

      {/* ── Modals ───────────────────────────────────────── */}
      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initial={editingLead}
        loading={modalLoading}
      />

      <ConfirmModal
        open={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDelete}
        lead={deletingLead}
        loading={modalLoading}
      />

      <ToastContainer />
    </div>
  );
}
