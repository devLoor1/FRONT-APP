import axios from "axios";
import Constants from "expo-constants";
import deviceData from "@/helpers/deviceData";
import AuthStorage from "@/storages/auth-storage";
import * as Updates from "expo-updates";
import Debug from "@/helpers/debug";
import { Platform } from "react-native";

const api = axios.create({
  baseURL:
    Constants?.expoConfig?.extra?.env?.baseUrl || "https://sua-url-padrao.com",
  headers: {
    "device-info": deviceData,
    "app-version": [
      Updates.channel,
      Constants.expoConfig?.extra?.env?.env,
      Constants.expoConfig?.extra?.version,
    ].join(" - "),
    "Content-Type": "application/json",
    "X-Client-Platform": Platform.OS === "ios" ? "ios" : "android",
  },
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    Debug.Capture(error);
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

api.interceptors.request.use(
  async (config) => {
    const token = await AuthStorage.GetPrivateToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

export default api;
