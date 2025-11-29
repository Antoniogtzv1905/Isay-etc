import { api } from '../client';

export async function login(email, password) {
  const body = new URLSearchParams();
  body.append('username', email);
  body.append('password', password);

  const res = await api.post('/auth/login', body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return res.data;
}

export async function register(name, email, password) {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
}
