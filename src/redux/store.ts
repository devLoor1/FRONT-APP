import { configureStore } from '@reduxjs/toolkit';
import auth from './reducers/auth';
import authBiometric from './reducers/authBiometric';
import user from './reducers/user';
import forget from './reducers/forget';
import register from './reducers/register';
import lead from './reducers/lead';
import investor from './reducers/investorProfile';
import wallet from './reducers/wallet';
import resume from './reducers/resume';
import opportunities from './reducers/opportunities';
import opportunitiePJ from './reducers/opportunitiePJ';
import payment from './reducers/payment';
import investment from './reducers/investment';
import faq from './reducers/faq';
import recommendation from './reducers/recommendation';
import excerpt from './reducers/excerpt';
import bank from './reducers/bank';
import password from './reducers/password';
import pix from './reducers/pix';
import notifications from './reducers/notifications';
import indicators from './reducers/indicators';
import terms from './reducers/terms';
import caf from './reducers/caf';
import anticipate from './reducers/anticipate';
import billingCenter from './reducers/billingCenter';
import generalStatus from './reducers/generalStatus';
import common from './reducers/common';
import analytic from './reducers/analytic';
import error from './reducers/errorState';
import contact from './reducers/contact';
import deepLink from './reducers/deepLink';
import onboarding from './reducers/onboarding';
import removeAccount from './reducers/removeAccount';
import avaliation from './reducers/avaliation';
import profitability from './reducers/profitability';
// import { logoutMiddleware } from './middlewares/logout';

const store = configureStore({
  reducer: {
    auth,
    authBiometric,
    user,
    forget,
    register,
    lead,
    investor,
    wallet,
    resume,
    opportunities,
    opportunitiePJ,
    payment,
    investment,
    faq,
    recommendation,
    excerpt,
    bank,
    password,
    pix,
    notifications,
    indicators,
    terms,
    caf,
    anticipate,
    billingCenter,
    generalStatus,
    common,
    analytic,
    error,
    contact,
    deepLink,
    onboarding,
    removeAccount,
    avaliation,
    profitability,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
