import axios from "axios";
import Constants from "expo-constants";
import deviceData from "@/helpers/deviceData";
import AuthStorage from "@/storages/auth-storage";
import * as Updates from "expo-updates";
import Debug from "@/helpers/debug";

const isWeb = typeof window !== "undefined";

const getBaseURL = () => {
  if (isWeb && process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  return Constants?.expoConfig?.extra?.env?.baseUrl || "https://sua-url-padrao.com";
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "device-info": deviceData,
    "app-version": isWeb
      ? "web"
      : [
          Updates.channel,
          Constants.expoConfig?.extra?.env?.env,
          Constants.expoConfig?.extra?.version,
        ].join(" - "),
    "Content-Type": "application/json",
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
