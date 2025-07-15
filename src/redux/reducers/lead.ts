import { createSlice } from "@reduxjs/toolkit";
import { IdentifierResponse } from "@/models-old/mfa/identifier.response";
import { LeadResponse } from "@/models-old/lead/lead.response";
import { InvestimentAmountResponse } from "@/models-old/lead/investimentAmount.response";
import { AuthResponse } from "@/models/auth/auth.response";
import { LeadMissingResponse } from "@/models-old/lead/leadMissing.response";

const initialState = {
  hash: <LeadResponse | null>null,
  amountList: <InvestimentAmountResponse | null>null,
  identifierLeadData: <IdentifierResponse | null>null,
  confirmCellphone: <boolean | null>null,
  confirmEmail: <boolean | null>null,
  responsePassword: <AuthResponse | null>null,
  loading: false,
  loadingConfirm: false,
  loadingPost: false,
  loadingFields: false,
  requestError: <null | string>null,
  leadMissingFields: <LeadMissingResponse | null>null,
  cellphoneUser: <string | null>null,
  emailUser: <string | null>null,
  nameUser: <string | null>null,
  cpfUser: <string | null>null,
  birthUser: <string | null>null,
  isWpp: false,
};

const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {
    reset: () => initialState,
    setIsWpp(state, action: { payload: boolean }) {
      state.isWpp = action.payload;
    },
  },
});

export const { reset, setIsWpp } = leadSlice.actions;
export default leadSlice.reducer;
