import { createSlice } from "@reduxjs/toolkit";
import { IdentifierResponse } from "@/models-old/mfa/identifier.response";
import { CepResponse } from "@/models/register/cep.response";
import { ListBanksResponse } from "@/models/register/listBanks.response";
import { VerifyDocResponse } from "@/models/register/verifyDoc.response";
import { PatchIdentifierResponse } from "@/models-old/mfa/patch.identifier.response";
import { ProfessionListResponse } from "@/models/register/professionList.response";

const initialState = {
  identifierData: <IdentifierResponse | null>null,
  newIdentifierData: <PatchIdentifierResponse | null>null,
  sendDocument: <boolean | null>null,
  isntPublicPerson: <boolean | null>null,
  completeAddress: <CepResponse | null>null,
  listBanks: <ListBanksResponse | null>null,
  docResponse: <boolean | null>null,
  docStatus: <VerifyDocResponse | null>null,
  responseComplete: <boolean | null>null,
  loading: false,
  loadingDoc: false,
  loadingConfirm: false,
  loadingBanks: false,
  requestError: <null | string>null,
  professionList: <ProfessionListResponse | null>null,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    reset: () => initialState,
    resetDocs: (state) => {
      state.loadingDoc = false;
      state.docResponse = null;
      state.docStatus = null;
    },
    resetIdentifier: (state) => {
      state.newIdentifierData = null;
      state.identifierData = null;
    },
  },
});

export const { reset, resetDocs, resetIdentifier } = registerSlice.actions;
export default registerSlice.reducer;
