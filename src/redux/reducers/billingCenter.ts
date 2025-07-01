import { createSlice } from '@reduxjs/toolkit';
import { BillingDetailResponse } from '@/models/billingCenter/detail.response';
import { BillingListResponse } from '@/models/billingCenter/list.response';
import { GetBillingDetail, GetBillingList } from '@/services/billingCenter';

const initialState = {
  listBilling: <BillingListResponse | null>null,
  detailBilling: <BillingDetailResponse | null>null,
  loadingDetail: false,
  loadingList: <boolean>false,
  requestError: <null | string>null,
  moreBilling: <boolean>true,
};

const billingCenterSlice = createSlice({
  name: 'billingCenter',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(GetBillingList.pending, state => {
        state.loadingList = true;
        state.requestError = null;
        state.listBilling = null;
      })
      .addCase(GetBillingList.fulfilled, (state, { payload }) => {
        state.loadingList = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else if (payload.length === 0) {
            state.moreBilling = false;
          } else {
            state.listBilling = payload;
          }
        }
      })
      .addCase(GetBillingDetail.pending, state => {
        state.loadingDetail = true;
        state.requestError = null;
        state.detailBilling = null;
      })
      .addCase(GetBillingDetail.fulfilled, (state, { payload }) => {
        state.loadingDetail = false;
        if (payload) {
          if (payload.message) {
            state.requestError = payload.message;
          } else {
            state.detailBilling = payload;
          }
        }
      });
  },
});

export const { reset } = billingCenterSlice.actions;
export default billingCenterSlice.reducer;
