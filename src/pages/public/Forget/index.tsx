import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import GeneralPage from "./components/GeneralPage";
import ConfirmationPage from "./components/Confirmation";
import { PublicNavigation } from "@/models/routes/navigation.public";
import { useCustomStyles } from "./style";

export default function ForgetPage() {
  const styles = useCustomStyles();
  const navigation = useNavigation<PublicNavigation>();

  const [currentPage, setCurrentPage] = useState(1);

  if (currentPage === 4) {
    return (
      <ConfirmationPage
        confirmRegister={() => {
          setCurrentPage(1);
          navigation.navigate("Login");
        }}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <GeneralPage
            onSuccess={() => {
              setCurrentPage(4);
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
