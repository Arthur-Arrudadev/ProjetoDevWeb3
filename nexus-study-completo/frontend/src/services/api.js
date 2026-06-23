const BASE_URL = import.meta.env.VITE_API_URL || "http://backend:4000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erro ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  register: (data) => request('/users/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/users/auth', { method: 'POST', body: JSON.stringify(data) }),

  // Questions
  getQuestions: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.discipline) qs.set('discipline', params.discipline);
    if (params.year) qs.set('year', params.year);
    if (params.limit) qs.set('limit', params.limit);
    return request(`/questions?${qs.toString()}`);
  },
  getQuestionFilters: () => request('/questions/filters'),
  getQuestion: (id) => request(`/questions/${id}`),
  answerQuestion: (id, data) => request(`/questions/${id}/answer`, { method: 'POST', body: JSON.stringify(data) }),
  markReview: (id, data) => request(`/questions/${id}/review`, { method: 'POST', body: JSON.stringify(data) }),
  createStudySession: (userId, data) => request(`/users/${userId}/sessions`, { method: 'POST', body: JSON.stringify(data) }),

  // User
  getDashboard: (userId, params = {}) => {
    const qs = new URLSearchParams();
    if (params.discipline) qs.set('discipline', params.discipline);
    if (params.period) qs.set('period', params.period);
    return request(`/users/${userId}/dashboard?${qs.toString()}`);
  },
  getWeeklyEvolution: (userId, params = {}) => {
    const qs = new URLSearchParams();
    if (params.discipline) qs.set('discipline', params.discipline);
    if (params.period) qs.set('period', params.period);
    return request(`/users/${userId}/weekly-evolution?${qs.toString()}`);
  },
  getDisciplines: (userId) => request(`/users/${userId}/disciplines`),

  // Recuperação de senha
  requestPasswordReset: (email) => request('/users/password-reset/request', { method: 'POST', body: JSON.stringify({ email }) }),
  confirmPasswordReset: (token, newPassword) => request('/users/password-reset/confirm', { method: 'POST', body: JSON.stringify({ token, newPassword }) }),

  // Perfil (nome, foto, senha)
  updateProfile: (userId, data) => request(`/users/${userId}/profile`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Admin
export const adminApi = {
  checkHash: () => request('/users/admin/check-hash'),
};
