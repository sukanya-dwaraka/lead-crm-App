const BASE = '/api';

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  if (!res.ok) {
    const msg = data.errors?.join(', ') || data.error || 'Request failed';
    throw new Error(msg);
  }
  return data;
}

export const api = {
  getLeads: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    ).toString();
    return request('GET', `/leads${qs ? `?${qs}` : ''}`);
  },
  getStats: () => request('GET', '/leads/stats'),
  getLead:  (id) => request('GET', `/leads/${id}`),
  createLead: (data) => request('POST', '/leads', data),
  updateLead: (id, data) => request('PUT', `/leads/${id}`, data),
  deleteLead: (id) => request('DELETE', `/leads/${id}`),
};
