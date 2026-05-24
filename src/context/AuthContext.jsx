import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('medagency_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
      } catch (e) {
        localStorage.removeItem('medagency_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('medagency_user', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const register = async (name, email, password, role = 'owner') => {
    const { data } = await axios.post('/api/auth/register', { name, email, password, role });
    setUser(data);
    localStorage.setItem('medagency_user', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medagency_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
