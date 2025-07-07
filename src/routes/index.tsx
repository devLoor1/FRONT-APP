import React from "react";
import AuthRoutes from "./auth.routes";
import { useAppSelector } from "@/redux/hooks";
import AppRoutes from "./app.routes";

export default function Routes() {
  const loginData = useAppSelector((state) => state.auth.loginData);

  if (!!loginData?.data.token) return <AppRoutes firstPage="Tabs" />;

  return <AuthRoutes />;
}
