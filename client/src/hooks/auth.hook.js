import { useState, useCallback, useEffect } from 'react';

const storageName = 'userData';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [ready, setReady] = useState(false);

  console.log('token',token)
  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);
    console.log(2222);
    localStorage.setItem(storageName, JSON.stringify({
      userId: id, token: jwtToken
    }));
    console.log(3333);
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      login(data.token, data.id);
    }
    setReady(true);
  }, [login])

  return { login, logout, token, userId, ready };
}