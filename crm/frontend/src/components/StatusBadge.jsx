import React from 'react';

const STATUS_CONFIG = {
  New:       { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', dot: '#3b82f6' },
  Contacted: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', dot: '#f59e0b' },
  Qualified: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', dot: '#8b5cf6' },
  Converted: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', dot: '#10b981' },
  Lost:      { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  dot: '#ef4444' },
};

export function StatusBadge({ status, size = 'md' }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['New'];
  const fontSize = size === 'sm' ? '11px' : '12px';
  const padding  = size === 'sm' ? '3px 8px' : '4px 10px';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      fontSize,
      fontWeight: 500,
      color: cfg.color,
      background: cfg.bg,
      border: `1px solid ${cfg.color}22`,
      borderRadius: '99px',
      padding,
      whiteSpace: 'nowrap',
      fontFamily: 'var(--font-head)',
      letterSpacing: '0.02em',
    }}>
      <span style={{
        width: 6, height: 6,
        borderRadius: '50%',
        background: cfg.dot,
        flexShrink: 0,
        animation: status === 'New' ? 'pulse-dot 2s ease-in-out infinite' : 'none',
      }} />
      {status}
    </span>
  );
}

export const STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
export { STATUS_CONFIG };
