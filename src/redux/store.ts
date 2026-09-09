import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from "./reducers/auth";
import authBiometric from "./reducers/authBiometric";
import user from "./reducers/user";
import error from "./reducers/errorState";

// Configuração do persist para o reducer de autenticação
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  // O token fica exclusivamente no SecureStore; Redux persiste somente estado não sensível.
  whitelist: ['isAuthenticated', 'personalInformationFilled', 'user'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, auth);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    authBiometric,
    user,
    error,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
