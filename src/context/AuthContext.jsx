import { createContext, useState, useCallback, useEffect } from 'react';
import { CONFIG } from '../config';
import { authService } from '../services';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingVerification, setPendingVerification] = useState(null); // Email pendiente de verificar

  // Cargar usuario desde localStorage al montar y validar token
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem(CONFIG.TOKEN_STORAGE_KEY);
      const savedUser = localStorage.getItem(CONFIG.USER_STORAGE_KEY);

      if (!savedToken || !savedUser) {
        setLoading(false);
        return;
      }

      setToken(savedToken);
      try {
        const response = await authService.perfil();
        const profile = response.data ?? response.datos ?? response;
        setUser(profile);
        localStorage.setItem(CONFIG.USER_STORAGE_KEY, JSON.stringify(profile));
      } catch (err) {
        localStorage.removeItem(CONFIG.TOKEN_STORAGE_KEY);
        localStorage.removeItem(CONFIG.USER_STORAGE_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      const payload = response.data ?? response.datos ?? response;
      const { usuario, token: newToken } = payload;

      setUser(usuario);
      setToken(newToken);
      setPendingVerification(null);
      localStorage.setItem(CONFIG.TOKEN_STORAGE_KEY, newToken);
      localStorage.setItem(CONFIG.USER_STORAGE_KEY, JSON.stringify(usuario));

      return { success: true };
    } catch (err) {
      const errorMsg = err.data?.mensaje || 'Error al iniciar sesión';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (nombre, email, password, aceptaTerminos) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.registro(nombre, email, password, aceptaTerminos);
      const payload = response.data ?? response.datos ?? response;
      const { usuario, emailEnviado, codigoDev, errorDev, mensaje } = payload;

      setUser(usuario);
      setPendingVerification(email);
      // No establecemos token aún, el usuario debe verificar primero
      
      return { success: true, email, emailEnviado, codigoDev, errorDev, mensaje };
    } catch (err) {
      const errorMsg = err.data?.mensaje || 'Error al registrarse';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (email, codigo) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.verificarCorreo(email, codigo);
      setPendingVerification(null);
      return { success: true };
    } catch (err) {
      const errorMsg = err.data?.mensaje || 'Error al verificar correo';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const resendCode = useCallback(async (email) => {
    try {
      const response = await authService.reenviarCodigo(email);
      const payload = response.data ?? response.datos ?? response;
      return { success: true, ...payload };
    } catch (err) {
      const errorMsg = err.data?.mensaje || 'Error al reenviar código';
      return { success: false, error: errorMsg };
    }
  }, []);

  const recuperarPassword = useCallback(async (email) => {
    try {
      const response = await authService.recuperar(email);
      const payload = response.data ?? response.datos ?? response;
      return { success: true, ...payload };
    } catch (err) {
      const errorMsg = err.data?.mensaje || 'Error al solicitar recuperación';
      return { success: false, error: errorMsg };
    }
  }, []);

  const resetearPassword = useCallback(async (email, codigo, nuevaPassword) => {
    try {
      await authService.resetPassword(email, codigo, nuevaPassword);
      return { success: true };
    } catch (err) {
      const errorMsg = err.data?.mensaje || 'Error al restablecer contraseña';
      return { success: false, error: errorMsg };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setPendingVerification(null);
    localStorage.removeItem(CONFIG.TOKEN_STORAGE_KEY);
    localStorage.removeItem(CONFIG.USER_STORAGE_KEY);
  }, []);

  const updateProfile = useCallback(async (data) => {
    try {
      const response = await authService.actualizarPerfil(data);
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      localStorage.setItem(CONFIG.USER_STORAGE_KEY, JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      const errorMsg = err.data?.mensaje || 'Error al actualizar perfil';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [user]);

  const value = {
    user,
    token,
    loading,
    error,
    pendingVerification,
    isAuthenticated: !!token,
    login,
    register,
    verifyEmail,
    resendCode,
    recuperarPassword,
    resetearPassword,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}