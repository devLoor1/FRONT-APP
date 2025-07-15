import { configureStore } from "@reduxjs/toolkit";
import auth from "./reducers/auth";
import authBiometric from "./reducers/authBiometric";
import user from "./reducers/user";
import forget from "./reducers/forget";
import register from "./reducers/register";
import lead from "./reducers/lead";
import error from "./reducers/errorState";
// import { logoutMiddleware } from './middlewares/logout';

const store = configureStore({
  reducer: {
    auth,
    authBiometric,
    user,
    forget,
    register,
    lead,
    error,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
