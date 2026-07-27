import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, fetchUserData } from "@/redux/reducers/auth";
import { fetchPersonalInformation } from "@/redux/reducers/user";
import { postLogout } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import AuthStorage from "@/storages/auth-storage";
import { handleAnalyticsUserProfile } from "@/helpers/analytics";
import { Platform } from "react-native";
import { safeLogger } from "@/helpers/observability";

interface AuthContextData {
  // Device Token (para autenticação biométrica e identificação do dispositivo)
  deviceToken: string;
  setDeviceToken: (token: string) => Promise<void>;
  
  // Logout
  onSignOut: () => Promise<void>;
  logoutLoading: boolean;
  
  // Estado de autenticação
  enableAuth: boolean;
  setEnableAuth: (enabled: boolean) => void;
  
  // Estado de verificação inicial
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const DEVICE_TOKEN_KEY = "@WiseInvestor:deviceToken";
const ENABLE_AUTH_KEY = "@WiseInvestor:enableAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [deviceToken, setDeviceTokenState] = useState<string>("");
  const [enableAuth, setEnableAuthState] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);

  const {
    mutateAsync: logoutMutation,
    isPending: logoutLoading,
  } = useMutation({
    mutationKey: [postLogout.name],
    mutationFn: postLogout,
  });

  // Verificar autenticação ao iniciar o app
  useEffect(() => {
    const checkAuthOnStart = async () => {
      try {
        setIsInitializing(true);
        
        // Carregar dados salvos
        const [storedToken, storedEnableAuth] = await Promise.all([
          AsyncStorage.getItem(DEVICE_TOKEN_KEY),
          AsyncStorage.getItem(ENABLE_AUTH_KEY),
        ]);

        if (storedToken) {
          setDeviceTokenState(storedToken);
        }

        if (storedEnableAuth) {
          setEnableAuthState(storedEnableAuth === "true");
        }

        // Se há token no Redux (persistido), configurar na API
        if (token) {
          api.defaults.headers.Authorization = `Bearer ${token}`;
          await AuthStorage.SetPrivateToken(token);
          
          // Buscar dados do usuário se não estiver autenticado
          if (!isAuthenticated) {
            await dispatch(fetchUserData());
            // Também buscar dados pessoais
            await dispatch(fetchPersonalInformation());
          }
        }
      } catch (error) {
        safeLogger.error("Authentication bootstrap failed", error);
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuthOnStart();
  }, []);

  const setDeviceToken = async (token: string) => {
    setDeviceTokenState(token);
    await AsyncStorage.setItem(DEVICE_TOKEN_KEY, token);
  };

  const setEnableAuth = async (enabled: boolean) => {
    setEnableAuthState(enabled);
    await AsyncStorage.setItem(ENABLE_AUTH_KEY, enabled.toString());
  };

  async function onSignOut() {
    try {
      // Chamar o serviço de logout
      await logoutMutation();
    } catch (error) {
      safeLogger.error("Remote logout failed", error);
      // Mesmo se falhar, continuar com o logout local
    } finally {
      // Limpar dados locais
      await AsyncStorage.clear();
      dispatch(logout());
      
      // Limpar headers da API
      delete api.defaults.headers.Authorization;
      
      if (Platform.OS !== "ios") {
        AsyncStorage.getAllKeys()
          .then(AsyncStorage.multiRemove)
          .then(() => {
            dispatch(logout());
          });
      }
      
      handleAnalyticsUserProfile("signOut");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        deviceToken,
        setDeviceToken,
        onSignOut,
        logoutLoading,
        enableAuth,
        setEnableAuth,
        isInitializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
