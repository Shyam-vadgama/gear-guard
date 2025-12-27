const API_URL = '/api';

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token: string) => localStorage.setItem('token', token);
export const removeAuthToken = () => localStorage.removeItem('token');

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.detail || 'API Request Failed', response.status);
  }

  return response.json();
}

export const api = {
  auth: {
    login: async (username: string, password: string) => {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      const res = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    },
    me: () => fetchApi('/users/me'),
    forgotPassword: (email: string) => fetchApi('/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (token: string, newPassword: string) => fetchApi('/reset-password', { method: 'POST', body: JSON.stringify({ token, new_password: newPassword }) }),
  },
  users: {
    list: () => fetchApi('/users/'),
    create: (data: any) => fetchApi('/users/', { method: 'POST', body: JSON.stringify(data) }),
  },
  equipment: {
    list: () => fetchApi('/equipment/'),
    create: (data: any) => fetchApi('/equipment/', { method: 'POST', body: JSON.stringify(data) }),
  },
  spareParts: {
    list: () => fetchApi('/parts/'), // We need to create this endpoint in backend too!
  },
  requests: {
    list: () => fetchApi('/requests/'),
    create: (data: any) => fetchApi('/requests/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi(`/requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
};
