import React from "react";
import AuthRoutes from "./auth.routes";
import { useAppSelector } from "@/redux/hooks";
import AppRoutes from "./app.routes";
import { useAuth } from "@/context/auth";
import LoadingScreen from "@/components/LoadingScreen";
import { getInvestorAccessStage } from "@/features/investor-access/investorAccess";

export default function Routes() {
  const { isAuthenticated, loadingUser, user } = useAppSelector((state) => state.auth);
  const { isInitializing } = useAuth();

  if (isInitializing || loadingUser) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    if (!user) {
      return <LoadingScreen />;
    }

    if (getInvestorAccessStage(user) !== "ready") {
      return <AppRoutes firstPage="Register" />;
    }
    
    return <AppRoutes firstPage="Tabs" />;
  }

  return <AuthRoutes />;
}
