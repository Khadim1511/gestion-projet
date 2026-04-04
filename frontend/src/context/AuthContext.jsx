import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      const payload = parseJwt(token);
      if (payload && payload.exp * 1000 > Date.now()) {
        try {
          if (savedUser && savedUser !== 'undefined') {
            setUser(JSON.parse(savedUser));
          } else {
            localStorage.clear();
          }
        } catch {
          localStorage.clear();
        }
      } else {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem('token', token);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.clear();
    setUser(null);
  };

  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.profil);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
