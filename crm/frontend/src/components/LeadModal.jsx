import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building2, Tag, FileText } from 'lucide-react';
import { STATUSES } from './StatusBadge';

const EMPTY = { name: '', email: '', phone: '', company: '', status: 'New', notes: '' };

export function LeadModal({ open, onClose, onSubmit, initial, loading }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const isEdit = !!initial?.id;

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY, ...initial } : EMPTY);
      setErrors({});
    }
  }, [open, initial]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.company.trim()) e.company = 'Required';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
  }

  function set(field) {
    return (e) => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      if (errors[field]) setErrors(er => { const n = { ...er }; delete n[field]; return n; });
    };
  }

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
      backdropFilter: 'blur(6px)',
      animation: 'fadeIn 0.15s ease',
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: 520,
        maxHeight: '90vh',
        overflowY: 'auto',
        animation: 'scaleIn 0.2s ease',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '18px', fontWeight: 700 }}>
              {isEdit ? 'Edit Lead' : 'Add New Lead'}
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: '13px', marginTop: '2px' }}>
              {isEdit ? 'Update lead information' : 'Fill in the details to add a new lead'}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '6px', color: 'var(--text-2)',
            display: 'flex', alignItems: 'center', transition: 'var(--transition)',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-2)'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Name + Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field icon={<User size={14}/>} label="Full Name" error={errors.name}>
              <input value={form.name} onChange={set('name')} placeholder="Priya Sharma" style={inputStyle(errors.name)} />
            </Field>
            <Field icon={<Mail size={14}/>} label="Email" error={errors.email}>
              <input value={form.email} onChange={set('email')} placeholder="priya@company.com" type="email" style={inputStyle(errors.email)} />
            </Field>
          </div>

          {/* Phone + Company */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field icon={<Phone size={14}/>} label="Phone Number" error={errors.phone}>
              <input value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" style={inputStyle(errors.phone)} />
            </Field>
            <Field icon={<Building2 size={14}/>} label="Company Name" error={errors.company}>
              <input value={form.company} onChange={set('company')} placeholder="Acme Corp" style={inputStyle(errors.company)} />
            </Field>
          </div>

          {/* Status */}
          <Field icon={<Tag size={14}/>} label="Lead Status">
            <select value={form.status} onChange={set('status')} style={{
              ...inputStyle(),
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238b95ad' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'calc(100% - 12px) center',
              paddingRight: '32px',
            }}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>

          {/* Notes */}
          <Field icon={<FileText size={14}/>} label="Notes">
            <textarea value={form.notes} onChange={set('notes')}
              placeholder="Additional information about this lead..."
              rows={3}
              style={{ ...inputStyle(), resize: 'vertical', minHeight: '80px' }}
            />
          </Field>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '11px',
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', color: 'var(--text-2)',
              fontWeight: 500, fontSize: '14px',
              transition: 'var(--transition)',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{
              flex: 2, padding: '11px',
              background: loading ? 'rgba(79,124,255,0.5)' : 'var(--accent)',
              border: 'none', borderRadius: 'var(--radius)',
              color: '#fff', fontWeight: 600, fontSize: '14px',
              fontFamily: 'var(--font-head)',
              transition: 'var(--transition)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              {loading && <span style={{
                width: 14, height: 14, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                animation: 'spin 0.7s linear infinite',
                display: 'inline-block',
              }}/>}
              {isEdit ? 'Save Changes' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ icon, label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '12px', fontWeight: 500, color: 'var(--text-2)',
        display: 'flex', alignItems: 'center', gap: '5px',
        fontFamily: 'var(--font-head)', letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>
        <span style={{ color: 'var(--text-3)' }}>{icon}</span>
        {label}
        {error && <span style={{ color: 'var(--lost)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— {error}</span>}
      </label>
      {children}
    </div>
  );
}

function inputStyle(error) {
  return {
    width: '100%',
    background: 'var(--surface2)',
    border: `1px solid ${error ? 'var(--lost)' : 'var(--border)'}`,
    borderRadius: 'var(--radius)',
    padding: '10px 12px',
    color: 'var(--text)',
    fontSize: '14px',
    outline: 'none',
    transition: 'var(--transition)',
    boxShadow: error ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
  };
}
