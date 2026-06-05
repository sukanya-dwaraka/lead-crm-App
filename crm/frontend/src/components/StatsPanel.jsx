import React from 'react';
import { Users, TrendingUp, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { STATUS_CONFIG } from './StatusBadge';

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      display: 'flex', flexDirection: 'column', gap: '12px',
      animation: 'fadeUp 0.4s ease both',
      transition: 'border-color var(--transition)',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color + '40'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: color + '0a',
        filter: 'blur(20px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        width: 36, height: 36,
        background: color + '15',
        border: `1px solid ${color}25`,
        borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-head)', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '4px' }}>{label}</div>
        {sub && <div style={{ fontSize: '12px', color, marginTop: '4px', fontWeight: 500 }}>{sub}</div>}
      </div>
    </div>
  );
}

function MiniBar({ label, count, total, color }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
        <span style={{ color: 'var(--text-2)' }}>{label}</span>
        <span style={{ fontWeight: 600, color }}>{count}</span>
      </div>
      <div style={{ height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color,
          borderRadius: 99,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  );
}

function SparkBar({ value, max }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
      <div style={{ height: 40, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
        <div style={{
          width: '100%', height: `${Math.max(4, pct)}%`,
          background: 'var(--accent)',
          borderRadius: '3px 3px 0 0',
          opacity: 0.7,
          transition: 'height 0.8s ease',
        }} />
      </div>
      <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 500 }}>{value}</div>
    </div>
  );
}

export function StatsPanel({ stats, loading }) {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            height: 110, borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }} />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const { total, byStatus, monthly, conversionRate } = stats;
  const maxMonthly = Math.max(...(monthly || []).map(m => m.count), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px' }}>
        <StatCard icon={<Users size={16}/>} label="Total Leads" value={total} color="var(--accent)" />
        <StatCard icon={<Zap size={16}/>} label="New" value={byStatus?.New || 0} color="var(--new)" />
        <StatCard icon={<TrendingUp size={16}/>} label="Qualified" value={byStatus?.Qualified || 0} color="var(--qualified)" />
        <StatCard icon={<CheckCircle2 size={16}/>} label="Converted" value={byStatus?.Converted || 0} color="var(--converted)" sub={`${conversionRate}% rate`} />
        <StatCard icon={<XCircle size={16}/>} label="Lost" value={byStatus?.Lost || 0} color="var(--lost)" />
      </div>

      {/* Pipeline + Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* Pipeline */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '20px',
        }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '13px', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
            Pipeline Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['New','Contacted','Qualified','Converted','Lost'].map(s => (
              <MiniBar key={s} label={s} count={byStatus?.[s] || 0} total={total} color={STATUS_CONFIG[s]?.color} />
            ))}
          </div>
        </div>

        {/* Monthly trend */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '20px',
        }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '13px', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
            Leads Added (6 mo)
          </h3>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: 80 }}>
            {(monthly || []).map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <SparkBar value={m.count} max={maxMonthly} />
                <div style={{ fontSize: '10px', color: 'var(--text-3)', textAlign: 'center' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
