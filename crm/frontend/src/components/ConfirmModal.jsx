import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function ConfirmModal({ open, onClose, onConfirm, lead, loading }) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.15s ease',
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: 400,
        padding: '28px 24px',
        animation: 'scaleIn 0.2s ease',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        textAlign: 'center',
      }}>
        <div style={{
          width: 52, height: 52,
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <AlertTriangle size={22} color="var(--lost)" />
        </div>

        <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>
          Delete Lead
        </h3>
        <p style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text)' }}>{lead?.name}</strong>?
          This action cannot be undone.
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px',
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', color: 'var(--text-2)',
            fontWeight: 500, fontSize: '14px', transition: 'var(--transition)',
          }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} style={{
            flex: 1, padding: '10px',
            background: 'var(--lost)', border: 'none',
            borderRadius: 'var(--radius)', color: '#fff',
            fontWeight: 600, fontSize: '14px', fontFamily: 'var(--font-head)',
            transition: 'var(--transition)',
            opacity: loading ? 0.6 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}>
            {loading && <span style={{
              width: 13, height: 13, borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#fff',
              animation: 'spin 0.7s linear infinite',
              display: 'inline-block',
            }}/>}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
