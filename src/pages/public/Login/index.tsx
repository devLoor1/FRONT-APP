import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import EnableAuthentication from "./components/EnableAuthentication";
import LoginContent from "./components/LoginContent";
import { useAppSelector } from "@/redux/hooks";
import { useAuth } from "@/context/auth";
import SecureStorage from "@/storages/secure-storage";
import { Analytics } from "@/helpers/analytics";

function LoginPage() {
  const refRBSheetAuth = useRef<any>(null);
  const { loginData } = useAppSelector((state) => state.auth);
  const [answerBiometry, setAnswerBiometry] = useState<boolean | null>(null);
  const { onSignIn, enableAuth } = useAuth();

  async function getStorage() {
    if (enableAuth) {
      const activeBiometry = await SecureStorage.GetLoginBiometry();
      setAnswerBiometry(activeBiometry ? activeBiometry === "true" : null);
    } else {
      setAnswerBiometry(false);
    }
  }

  useEffect(() => {
    Analytics({ pageName: 'HomeLogin' });
    getStorage();
  }, []);

  useEffect(() => {
    (async () => {
      if (loginData) {
        getStorage();
        const activeBiometry = await SecureStorage.GetLoginBiometry();
        
        if (enableAuth && activeBiometry === null) {
          refRBSheetAuth.current?.open();
        } else if (answerBiometry !== null) {
          onSignIn();
        }
      }
    })();
  }, [loginData]);

  function onClose() {
    // if (!loginData || loginData?.cryptoDeviceToken || answerBiometry === null) {
    //   onSignOut();
    //   dispatch(reset());
    // }
    getStorage();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flexGrow: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <LoginContent />
          <EnableAuthentication refRBSheet={refRBSheetAuth} onClose={onClose} />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default LoginPage;
