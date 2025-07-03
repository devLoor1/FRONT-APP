import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import { MyThemeProvider } from "./context/MyThemeContext";
import Routes from "./routes";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MyThemeProvider>
            <Routes />
          </MyThemeProvider>
        </Provider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
