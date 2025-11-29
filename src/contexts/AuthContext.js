import React, { createContext, useEffect, useState } from 'react';
import { saveToken, getToken, removeToken, saveUser, getUser, removeUser } from '../utils/storage';
import * as authService from '../api/services/authService';
import { setAuthToken } from '../api/client';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      const u = await getUser();
      if (t) {
        setToken(t);
        setAuthToken(t);
      }
      if (u) setUser(u);
      setLoading(false);
    })();
  }, []);

  const signIn = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      const access_token = res.access_token;
      if (!access_token) throw new Error('No access token received');
      setToken(access_token);
      setAuthToken(access_token);
      await saveToken(access_token);
      // save minimal user info (email) until there's an endpoint for full profile
      const minimal = { email };
      setUser(minimal);
      await saveUser(minimal);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err?.response?.data || err.message };
    }
  };

  const signUp = async (name, email, password) => {
    try {
      const created = await authService.register(name, email, password);
      // after register, login to get token
      const loginRes = await authService.login(email, password);
      const access_token = loginRes.access_token;
      setToken(access_token);
      setAuthToken(access_token);
      await saveToken(access_token);
      setUser(created);
      await saveUser(created);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err?.response?.data || err.message };
    }
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    await removeToken();
    await removeUser();
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
