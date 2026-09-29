const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Automatically sends HTTP-only session cookies
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || `HTTP error ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  getMe: () => apiRequest('/auth/me'),

  // Public/Admin Common
  getProfile: () => apiRequest('/profile'),
  updateProfile: (data: any) => apiRequest('/admin/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Navigation
  getNavigation: () => apiRequest('/admin/navigation'),
  createNavigation: (data: any) => apiRequest('/admin/navigation', { method: 'POST', body: JSON.stringify(data) }),
  updateNavigation: (id: string, data: any) => apiRequest(`/admin/navigation/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNavigation: (id: string) => apiRequest(`/admin/navigation/${id}`, { method: 'DELETE' }),

  // Skills & Categories
  getSkillCategories: () => apiRequest('/admin/skills/categories'),
  createSkillCategory: (data: any) => apiRequest('/admin/skills/categories', { method: 'POST', body: JSON.stringify(data) }),
  createSkill: (data: any) => apiRequest('/admin/skills', { method: 'POST', body: JSON.stringify(data) }),
  deleteSkill: (id: string) => apiRequest(`/admin/skills/${id}`, { method: 'DELETE' }),

  // Services
  getServices: () => apiRequest('/services'),
  createService: (data: any) => apiRequest('/admin/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id: string, data: any) => apiRequest(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id: string) => apiRequest(`/admin/services/${id}`, { method: 'DELETE' }),

  // Experience
  getExperience: () => apiRequest('/experience'),
  createExperience: (data: any) => apiRequest('/admin/experience', { method: 'POST', body: JSON.stringify(data) }),
  updateExperience: (id: string, data: any) => apiRequest(`/admin/experience/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExperience: (id: string) => apiRequest(`/admin/experience/${id}`, { method: 'DELETE' }),

  // Education
  getEducation: () => apiRequest('/education'),
  createEducation: (data: any) => apiRequest('/admin/education', { method: 'POST', body: JSON.stringify(data) }),
  updateEducation: (id: string, data: any) => apiRequest(`/admin/education/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEducation: (id: string) => apiRequest(`/admin/education/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: () => apiRequest('/projects'),
  createProject: (data: any) => apiRequest('/admin/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) => apiRequest(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: string) => apiRequest(`/admin/projects/${id}`, { method: 'DELETE' }),

  // AI Lab
  getAILab: () => apiRequest('/ai-lab'),
  createAILab: (data: any) => apiRequest('/admin/ai-lab', { method: 'POST', body: JSON.stringify(data) }),
  deleteAILab: (id: string) => apiRequest(`/admin/ai-lab/${id}`, { method: 'DELETE' }),

  // Social Links
  getSocialLinks: () => apiRequest('/social-links'),
  createSocialLink: (data: any) => apiRequest('/admin/social-links', { method: 'POST', body: JSON.stringify(data) }),
  deleteSocialLink: (id: string) => apiRequest(`/admin/social-links/${id}`, { method: 'DELETE' }),

  // Resume
  getResume: () => apiRequest('/resume'),
  createResume: (data: any) => apiRequest('/admin/resume', { method: 'POST', body: JSON.stringify(data) }),
  deleteResume: (id: string) => apiRequest(`/admin/resume/${id}`, { method: 'DELETE' }),

  // Messages (Inbox)
  getMessages: (status?: string) => apiRequest(`/admin/contact/messages${status ? `?status=${status}` : ''}`),
  updateMessageStatus: (id: string, status: string) =>
    apiRequest(`/admin/contact/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteMessage: (id: string) => apiRequest(`/admin/contact/messages/${id}`, { method: 'DELETE' }),

  // Media
  getMedia: () => apiRequest('/admin/media'),
  uploadMedia: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const url = `${API_BASE}/admin/media/upload`;
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.error || 'Upload failed');
    }
    return data;
  },
  deleteMedia: (id: string) => apiRequest(`/admin/media/${id}`, { method: 'DELETE' }),
};
