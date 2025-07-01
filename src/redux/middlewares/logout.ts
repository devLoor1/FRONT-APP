import { AnyAction, AsyncThunkAction, Dispatch, Middleware } from '@reduxjs/toolkit';
import { reset as resetAuth } from '@/redux/reducers/auth';
import { reset as resetUser } from '@/redux/reducers/user';
// import { GetPublicToken, GetRisks, GetPublicTerms } from '@/services/common';

export const logoutMiddleware: Middleware = store => next => async (action: unknown) => {
  if ((action as AnyAction).type === 'LOGOUT') {
    const dispatch = store.dispatch as Dispatch<AnyAction> &
      ((action: AsyncThunkAction<any, void, any>) => Promise<any>);
    dispatch(resetAuth());
    dispatch(resetUser());
    // await dispatch(GetPublicToken());
    // await dispatch(GetRisks());
    // await dispatch(GetPublicTerms());
  }

  next(action);
};
