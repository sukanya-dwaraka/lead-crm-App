import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Build page range
  const pages = [];
  const delta = 2;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: '12px',
    }}>
      <span style={{ fontSize: '13px', color: 'var(--text-3)' }}>
        Showing <strong style={{ color: 'var(--text-2)' }}>{start}–{end}</strong> of{' '}
        <strong style={{ color: 'var(--text-2)' }}>{total}</strong> leads
      </span>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <PageBtn disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft size={15} />
        </PageBtn>

        {pages.map((p, i) =>
          p === '...'
            ? <span key={`ellipsis-${i}`} style={{ color: 'var(--text-3)', padding: '0 4px', fontSize: '14px' }}>…</span>
            : <PageBtn key={p} active={p === page} onClick={() => onPageChange(p)}>{p}</PageBtn>
        )}

        <PageBtn disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
          <ChevronRight size={15} />
        </PageBtn>
      </div>
    </div>
  );
}

function PageBtn({ children, onClick, active, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 34, height: 34,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '8px',
        border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
        background: active ? 'var(--accent)' : 'var(--surface2)',
        color: active ? '#fff' : disabled ? 'var(--text-3)' : 'var(--text-2)',
        fontSize: '13px', fontWeight: active ? 700 : 400,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-head)',
        transition: 'var(--transition)',
        opacity: disabled ? 0.4 : 1,
        padding: '0 8px',
      }}
      onMouseEnter={e => {
        if (!disabled && !active) {
          e.currentTarget.style.borderColor = 'var(--border2)';
          e.currentTarget.style.color = 'var(--text)';
        }
      }}
      onMouseLeave={e => {
        if (!disabled && !active) {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--text-2)';
        }
      }}
    >
      {children}
    </button>
  );
}
