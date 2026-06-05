import React from 'react';
import { Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown, Building2, Calendar } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

function SortIcon({ field, sortBy, sortOrder }) {
  if (sortBy !== field) return <ChevronsUpDown size={13} style={{ opacity: 0.3 }} />;
  return sortOrder === 'asc'
    ? <ChevronUp size={13} style={{ color: 'var(--accent)' }} />
    : <ChevronDown size={13} style={{ color: 'var(--accent)' }} />;
}

function Th({ children, field, sortBy, sortOrder, onSort, style = {} }) {
  const active = sortBy === field;
  return (
    <th
      onClick={() => field && onSort(field)}
      style={{
        padding: '10px 16px',
        textAlign: 'left',
        fontSize: '11px',
        fontFamily: 'var(--font-head)',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: active ? 'var(--accent)' : 'var(--text-3)',
        cursor: field ? 'pointer' : 'default',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        transition: 'color var(--transition)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {children}
        {field && <SortIcon field={field} sortBy={sortBy} sortOrder={sortOrder} />}
      </div>
    </th>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[60, 140, 100, 110, 90, 70].map((w, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <div style={{
            height: 14, width: w, borderRadius: 6,
            background: 'linear-gradient(90deg, var(--surface2) 25%, var(--border) 50%, var(--surface2) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }} />
        </td>
      ))}
    </tr>
  );
}

export function LeadTable({ leads, loading, sortBy, sortOrder, onSort, onEdit, onDelete }) {
  const thProps = { sortBy, sortOrder, onSort };

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
              <Th {...thProps} field="name">Name</Th>
              <Th {...thProps} field="company">Company</Th>
              <Th {...thProps}>Contact</Th>
              <Th {...thProps} field="status">Status</Th>
              <Th {...thProps} field="createdAt">Created</Th>
              <Th {...thProps} style={{ textAlign: 'right' }}>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '15px', color: 'var(--text-2)' }}>No leads found</div>
                  <div style={{ fontSize: '13px', marginTop: '4px' }}>Try adjusting your search or filters</div>
                </td>
              </tr>
            ) : leads.map((lead, idx) => (
              <tr key={lead.id} style={{
                borderBottom: '1px solid var(--border)',
                transition: 'background var(--transition)',
                animation: `fadeUp 0.3s ease ${idx * 0.04}s both`,
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Name */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                      background: `hsl(${lead.name.charCodeAt(0) * 7 % 360}, 55%, 25%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-head)',
                      color: `hsl(${lead.name.charCodeAt(0) * 7 % 360}, 70%, 75%)`,
                    }}>
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '14px' }}>{lead.name}</div>
                      {lead.notes && (
                        <div style={{
                          fontSize: '12px', color: 'var(--text-3)',
                          maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{lead.notes}</div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Company */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <Building2 size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-2)' }}>{lead.company}</span>
                  </div>
                </td>

                {/* Contact */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-2)' }}>{lead.email}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{lead.phone}</div>
                </td>

                {/* Status */}
                <td style={{ padding: '14px 16px' }}>
                  <StatusBadge status={lead.status} />
                </td>

                {/* Created */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-3)' }}>
                    <Calendar size={12} />
                    {formatDate(lead.createdAt)}
                  </div>
                </td>

                {/* Actions */}
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <ActionBtn onClick={() => onEdit(lead)} title="Edit">
                      <Pencil size={14} />
                    </ActionBtn>
                    <ActionBtn onClick={() => onDelete(lead)} title="Delete" danger>
                      <Trash2 size={14} />
                    </ActionBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionBtn({ children, onClick, title, danger }) {
  return (
    <button onClick={onClick} title={title} style={{
      background: 'var(--surface2)',
      border: '1px solid var(--border)',
      borderRadius: '7px',
      padding: '7px',
      color: danger ? 'var(--lost)' : 'var(--text-2)',
      display: 'flex', alignItems: 'center',
      transition: 'var(--transition)',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = danger ? 'var(--lost)' : 'var(--accent)';
        e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.1)' : 'rgba(79,124,255,0.1)';
        e.currentTarget.style.color = danger ? 'var(--lost)' : 'var(--accent)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background = 'var(--surface2)';
        e.currentTarget.style.color = danger ? 'var(--lost)' : 'var(--text-2)';
      }}
    >
      {children}
    </button>
  );
}
