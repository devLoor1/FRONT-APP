import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import {
  useFonts,
  NunitoSans_200ExtraLight,
  NunitoSans_300Light,
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
  NunitoSans_900Black,
} from "@expo-google-fonts/nunito-sans";
import store, { persistor } from "./redux/store";
import { MyThemeProvider } from "./context/MyThemeContext";
import { AuthProvider } from "./context/auth";
import Routes from "./routes";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CommonProvider } from "./context/CommonContext";
import LoadingScreen from "./components/LoadingScreen";

const queryClient = new QueryClient();

export default function App() {
  let [fontsLoaded] = useFonts({
    NunitoSans_200ExtraLight,
    NunitoSans_300Light,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
    NunitoSans_900Black,
  });

  if (!fontsLoaded)
    return (
      <MyThemeProvider>
        <LoadingScreen />
      </MyThemeProvider>
    );
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={<LoadingScreen />} persistor={persistor}>
            <MyThemeProvider>
              <AuthProvider>
                <CommonProvider>
                  <Routes />
                </CommonProvider>
              </AuthProvider>
            </MyThemeProvider>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
