import React from "react";
import AuthRoutes from "./auth.routes";
import { useAppSelector } from "@/redux/hooks";
import AppRoutes from "./app.routes";
import { useAuth } from "@/context/auth";
import LoadingScreen from "@/components/LoadingScreen";
import { RootStackParamList } from "@/models/routes/navigation.private";

function resolveFirstPage(user: any): keyof RootStackParamList {
  if (!user) return "Tabs";

  if (!user.has_completed_personal_information) {
    return "Register";
  }

  const faceMatchStatus = user.face_match?.status;
  if (!faceMatchStatus || faceMatchStatus === "denied") {
    return "FaceMatch";
  }

  return "Tabs";
}

export default function Routes() {
  const { isAuthenticated, loadingUser, user } = useAppSelector((state) => state.auth);
  const { isInitializing } = useAuth();

  if (isInitializing || loadingUser) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    const firstPage = resolveFirstPage(user);
    return <AppRoutes firstPage={firstPage} />;
  }

  return <AuthRoutes />;
}
