import React, { useEffect } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import LoginContent from "./components/LoginContent";
import { Analytics } from "@/helpers/analytics";

function LoginPage() {
  useEffect(() => {
    Analytics({ pageName: 'HomeLogin' });
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flexGrow: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <LoginContent />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default LoginPage;
