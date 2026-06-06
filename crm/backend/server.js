import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


let leads = [
  {
    id: uuidv4(),
    name: 'Priya Sharma',
    email: 'priya.sharma@techcorp.in',
    phone: '+91 98765 43210',
    company: 'TechCorp India',
    status: 'Qualified',
    notes: 'Interested in enterprise plan. Follow up after Q3 budget approval.',
    createdAt: new Date('2024-11-15').toISOString(),
    updatedAt: new Date('2024-11-15').toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Rahul Mehta',
    email: 'rahul@startupx.io',
    phone: '+91 91234 56789',
    company: 'StartupX',
    status: 'Contacted',
    notes: 'Demo scheduled for next week.',
    createdAt: new Date('2024-11-20').toISOString(),
    updatedAt: new Date('2024-11-20').toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Anjali Patel',
    email: 'anjali.patel@innovate.com',
    phone: '+91 87654 32109',
    company: 'Innovate Solutions',
    status: 'Converted',
    notes: 'Signed 12-month contract. Onboarding complete.',
    createdAt: new Date('2024-10-10').toISOString(),
    updatedAt: new Date('2024-10-10').toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Vikram Singh',
    email: 'vikram@globaltech.co',
    phone: '+91 99887 76655',
    company: 'GlobalTech Co.',
    status: 'New',
    notes: 'Inbound inquiry from website contact form.',
    createdAt: new Date('2024-12-01').toISOString(),
    updatedAt: new Date('2024-12-01').toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Sneha Iyer',
    email: 'sneha.iyer@finserv.in',
    phone: '+91 93322 11445',
    company: 'FinServ India',
    status: 'Lost',
    notes: 'Went with competitor. Revisit in 6 months.',
    createdAt: new Date('2024-09-05').toISOString(),
    updatedAt: new Date('2024-09-05').toISOString(),
  },
];

const VALID_STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];


function validateLead(data, isUpdate = false) {
  const errors = [];
  if (!isUpdate) {
    if (!data.name?.trim()) errors.push('Name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    if (!data.phone?.trim()) errors.push('Phone is required');
    if (!data.company?.trim()) errors.push('Company is required');
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  return errors;
}


app.get('/api/leads', (req, res) => {
  let result = [...leads];

  // Search
  const { search, status, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.company.toLowerCase().includes(q)
    );
  }

  if (status && status !== 'All') {
    result = result.filter(l => l.status === status);
  }

 //sort
  const validSortFields = ['name', 'company', 'status', 'createdAt', 'updatedAt'];
  const field = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  result.sort((a, b) => {
    const aVal = a[field] || '';
    const bVal = b[field] || '';
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  // Pagination
  const total = result.length;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = result.slice(startIndex, startIndex + limitNum);

  res.json({
    leads: paginated,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});


app.get('/api/leads/stats', (req, res) => {
  const total = leads.length;
  const byStatus = VALID_STATUSES.reduce((acc, s) => {
    acc[s] = leads.filter(l => l.status === s).length;
    return acc;
  }, {});

  // Monthly trend (last 6 months)
  const now = new Date();
  const monthly = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    const count = leads.filter(l => {
      const ld = new Date(l.createdAt);
      return ld.getFullYear() === d.getFullYear() && ld.getMonth() === d.getMonth();
    }).length;
    monthly.push({ label, count });
  }

  const conversionRate = total > 0 ? ((byStatus['Converted'] / total) * 100).toFixed(1) : 0;

  res.json({ total, byStatus, monthly, conversionRate });
});

// ─── GET /api/leads/:id ────────────────────────────────────────────────────────
app.get('/api/leads/:id', (req, res) => {
  const lead = leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(lead);
});

// ─── POST /api/leads ───────────────────────────────────────────────────────────
app.post('/api/leads', (req, res) => {
  const errors = validateLead(req.body);
  if (errors.length) return res.status(400).json({ errors });

  if (leads.find(l => l.email === req.body.email)) {
    return res.status(409).json({ errors: ['A lead with this email already exists'] });
  }

  const lead = {
    id: uuidv4(),
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
    phone: req.body.phone.trim(),
    company: req.body.company.trim(),
    status: req.body.status || 'New',
    notes: req.body.notes?.trim() || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  leads.unshift(lead);
  res.status(201).json(lead);
});

// ─── PUT /api/leads/:id ────────────────────────────────────────────────────────
app.put('/api/leads/:id', (req, res) => {
  const idx = leads.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

  const errors = validateLead(req.body, true);
  if (errors.length) return res.status(400).json({ errors });

  // Check email collision (excluding current lead)
  if (req.body.email) {
    const emailConflict = leads.find(l => l.email === req.body.email && l.id !== req.params.id);
    if (emailConflict) return res.status(409).json({ errors: ['Email already in use by another lead'] });
  }

  leads[idx] = {
    ...leads[idx],
    ...req.body,
    id: leads[idx].id,
    createdAt: leads[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };

  res.json(leads[idx]);
});

// ─── DELETE /api/leads/:id ────────────────────────────────────────────────────
app.delete('/api/leads/:id', (req, res) => {
  const idx = leads.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Lead not found' });
  leads.splice(idx, 1);
  res.json({ message: 'Lead deleted successfully' });
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), totalLeads: leads.length });
});

app.listen(PORT, () => {
  console.log(`🚀 CRM API running at http://localhost:${PORT}`);
});
