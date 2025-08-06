import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [assinatura, setAssinatura] = useState(null);
  const [assinaturaLoading, setAssinaturaLoading] = useState(false);

  const fetchSubscription = useCallback(async () => {
    if (user?.tipoUsuario !== "EMPRESA") {
      setAssinatura(null);
      return;
    }

    setAssinaturaLoading(true);
    try {
      const { data } = await api.get("/pagamentos/assinatura-atual");
      setAssinatura(data);
    } catch (error) {
      console.error("Não foi possível buscar a assinatura da empresa.", error);
      setAssinatura(null);
    } finally {
      setAssinaturaLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const bootstrapAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedUser = jwtDecode(token);
          if (decodedUser.exp * 1000 > Date.now()) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setUser(decodedUser);
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Token inválido:", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    bootstrapAuth();
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const login = async (email, senha) => {
    try {
      const response = await api.post("/auth/login", { email, senha });
      if (response.data && response.data.token) {
        const { token } = response.data;
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        return decodedUser;
      }
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      setAssinatura(null);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setAssinatura(null);
    window.location.href = "/login";
  };

  const authContextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    assinatura,
    assinaturaLoading,
    refreshSubscription: fetchSubscription,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
