import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { GetUserPicture, GetUserStatus } from "@/services/user";
import { GetPublicTerms, GetPublicToken, GetRisks } from "@/services/common";
import { reset } from "@/redux/reducers/user";
import * as resetAuth from "@/redux/reducers/auth";
import { setUser as setAuthUser } from "@/redux/reducers/user";
import { hasAuth } from "@/helpers/auth/biometry";
import { ValidateBiometric } from "@/services-old/authBiometric";
import { resetBiometric } from "@/redux/reducers/authBiometric";
import DoBiometryValidation from "@/helpers/auth/doBiometry";
// import SecureStorage from '@/storages/secure-storage';
import { GetProfileStatus } from "@/services-old/investorProfile";
import { UserType } from "@/models-old/types/User";
import { Platform } from "react-native";
import { handleAnalyticsUserProfile } from "@/helpers/analytics";
// import * as SecureStore from 'expo-secure-store';

interface AuthContextData {
  user: UserType | null;
  onSignOut(): void;
  onSignIn(): Promise<void>;
  loadingSingIn: string;
  enableAuth: boolean;
  logoutMsg: string;
  deviceToken: string;
  setDeviceToken: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loadingSignIn, setloadingSignIn] = useState("");
  const [enableAuth, setEnableAuth] = useState(false);
  const [logoutMsg, setLogoutMsg] = useState("");
  const [deviceToken, setDeviceToken] = useState<string>("");
  const dispatch = useAppDispatch();
  const {
    userStatus,
    userStatusError,
    user: _user,
  } = useAppSelector((state) => state.user);
  const { succesBiometry } = useAppSelector((state) => state.authBiometric);

  async function onSignIn() {
    setloadingSignIn("Carregando perfil...");
    await dispatch(GetUserStatus(deviceToken));
    await dispatch(GetProfileStatus());
    await dispatch(GetUserPicture());
  }

  async function clearStates() {
    dispatch(resetAuth.reset());
    dispatch(reset());
    dispatch(
      setAuthUser({
        logged: false,
      })
    );
    await dispatch(GetPublicToken());
    setloadingSignIn("");
  }

  function onSignOut() {
    dispatch(resetAuth.reset());
    AsyncStorage.clear();
    clearStates();
    dispatch(
      setAuthUser({
        logged: false,
      })
    );
    if (Platform.OS !== "ios") {
      AsyncStorage.getAllKeys()
        .then(AsyncStorage.multiRemove)
        .then(() => {
          clearStates();
        });
    }
    handleAnalyticsUserProfile("signOut", {});
  }

  useEffect(() => {
    if (userStatus) {
      (async () => {
        await dispatch(
          setAuthUser({
            name: userStatus.valueFields.name,
            email: userStatus.valueFields.email,
            cellphone: userStatus.valueFields.cellphone || "",
            balance: userStatus.valueFields.balance || null,
            balanceBonus: userStatus.valueFields.balanceBonus || 0,
            balanceTot:
              userStatus.valueFields.balanceBonus +
                userStatus.valueFields.balance || 0,
            logged: true,
          })
        );
        await setloadingSignIn("");
      })();
    }
  }, [userStatus]);

  useEffect(() => {
    // TODO refatorar para remover o acesso ao usuário do contexto e acessá-lo somente pelo reducer
    setUser(_user);
  }, [dispatch, _user]);

  useEffect(() => {
    if (userStatusError) {
      onSignOut();
      setloadingSignIn("");
    }
  }, [userStatusError]);

  useEffect(() => {
    // onSingOut();
    // SecureStore.deleteItemAsync('LoorInvestorSecure_investBiometry');
    // SecureStore.deleteItemAsync('LoorInvestorSecure_loginBiometry');
    (async () => {
      /* try {
        await dispatch(GetPublicToken());
        await dispatch(GetRisks());
        await dispatch(GetPublicTerms());
        await setloadingSignIn("Carregando fontes...");
        const auth = await hasAuth();
        const verifyAuth = await DoBiometryValidation();

        if (auth) {
          setEnableAuth(auth);
        }

        if (verifyAuth === true) {
          await setloadingSignIn("Carregando perfil...");
          dispatch(
            ValidateBiometric({
              authenticationType: "FacialRecognition",
              isChangeBiometry: false,
              operation: "Login",
              deviceToken,
            })
          );
        } else {
          if (verifyAuth !== false) {
            setLogoutMsg(verifyAuth);
          }
          onSignOut();
          setloadingSignIn("");
        }
      } catch (error) {
        console.log("Error", error);
        onSignOut();
      } */
    })();
  }, []);

  useEffect(() => {
    if (logoutMsg) {
      setTimeout(() => {
        setLogoutMsg("");
      }, 3000);
    }
  }, [logoutMsg]);

  useEffect(() => {
    if (succesBiometry && !user?.logged) {
      onSignIn();
      dispatch(resetBiometric());
    }
  }, [succesBiometry]);

  return (
    <AuthContext.Provider
      value={{
        loadingSingIn: loadingSignIn,
        user,
        onSignIn,
        onSignOut,
        enableAuth,
        logoutMsg,
        deviceToken,
        setDeviceToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
