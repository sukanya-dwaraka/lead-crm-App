import React, { useState, useCallback, useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

let _addToast = null;

export function toast(message, type = 'success') {
  if (_addToast) _addToast({ message, type, id: Date.now() });
}
toast.success = (msg) => toast(msg, 'success');
toast.error = (msg) => toast(msg, 'error');
toast.info = (msg) => toast(msg, 'info');

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  _addToast = useCallback((t) => {
    setToasts(prev => [...prev, t]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3500);
  }, []);

  function dismiss(id) {
    setToasts(prev => prev.filter(x => x.id !== id));
  }

  const ICONS = {
    success: <CheckCircle2 size={16} />,
    error:   <XCircle size={16} />,
    info:    <Info size={16} />,
  };
  const COLORS = {
    success: '#10b981',
    error:   '#ef4444',
    info:    '#4f7cff',
  };

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: '10px',
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'var(--surface)',
          border: `1px solid ${COLORS[t.type]}33`,
          borderLeft: `3px solid ${COLORS[t.type]}`,
          borderRadius: 'var(--radius)',
          padding: '12px 14px',
          minWidth: 260, maxWidth: 360,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'fadeUp 0.25s ease',
          pointerEvents: 'all',
          color: COLORS[t.type],
        }}>
          {ICONS[t.type]}
          <span style={{ flex: 1, fontSize: '14px', color: 'var(--text)', fontWeight: 450 }}>{t.message}</span>
          <button onClick={() => dismiss(t.id)} style={{
            background: 'none', border: 'none', color: 'var(--text-3)',
            cursor: 'pointer', display: 'flex', padding: '2px',
          }}>
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
