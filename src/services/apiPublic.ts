import axios from "axios";
import Constants from "expo-constants";
import deviceData from "@/helpers/deviceData";
import * as Updates from "expo-updates";
import Debug from "@/helpers/debug";

const isWeb = typeof window !== "undefined";

const getBaseURL = () => {
  if (isWeb && process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  return Constants?.expoConfig?.extra?.env?.baseUrl || "https://backend-homolog-debt.onrender.com/";
};

const getBasicAuth = () => {
  if (isWeb && process.env.BASIC_AUTH) {
    return process.env.BASIC_AUTH;
  }
  return Constants?.expoConfig?.extra?.env?.basicAuth || "";
};

const apiPublic = axios.create({
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
    Authorization: getBasicAuth(),
  },
});

apiPublic.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    Debug.Capture(error);
    return Promise.reject(error);
  }
);

export default apiPublic;
