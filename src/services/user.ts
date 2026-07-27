import api from "./api";

import { 
  MeResponse,
  PersonalInformationRequest, 
  PersonalInformationResponse 
} from "@/models/user";


export const getMe = async () => {
  const response = await api.get<MeResponse>("/auth/investor/me");
  return response.data.data;
};

export const getPersonalInformation = async () => {
  const response = await api.get<PersonalInformationResponse>("/investors/profile/personal-information");
  return response.data;
};

export const postPersonalInformation = async (request: PersonalInformationRequest) => {
  const response = await api.post<PersonalInformationResponse>(
    "/investors/profile/personal-information",
    request
  );
  return response.data;
};

export const submitFaceMatch = async (document: any, selfie: any) => {
  const formData = new FormData();
  
  // Adicionar documento
  const documentFileName = document.uri.split('/').pop();
  formData.append('document', {
    uri: document.uri,
    type: 'image/jpeg',
    name: documentFileName,
  } as any);
  
  // Adicionar selfie
  const selfieFileName = selfie.uri.split('/').pop();
  formData.append('selfie', {
    uri: selfie.uri,
    type: 'image/jpeg',
    name: selfieFileName,
  } as any);

  const response = await api.post('/investors/face-match', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};


// export const GetUserStatus = createAsyncThunk(
//   "user/GetUserStatus",
//   async (deviceToken: string) => {
//     const response = await api
//       .get(`/signup/user/investor/onboarding/status?isNewApp=true`, {
//         headers: {
//           "X-Device-Token": deviceToken,
//         },
//       })
//       .then((r): UserStatusResponse => {
//         const { name, email } = r.data.valueFields;
//         Debug.SetUser({ email, name });
//         LogRocketHelper.SetUser({ email, name });
//         const cpf = response?.valueFields?.cpf;
//         const cellphone = `+55${r.data.valueFields?.cellphone}`;
//         const status = r.data.status;
//         handleAnalyticsUserProfile("", {
//           Email: email,
//           Name: name,
//           CPF: cpf,
//           Phone: cellphone,
//           JaFezLogin: true,
//           Status: status,
//         });
//         return r.data;
//       })
//       .catch((error) => {
//         return error.response.data;
//       });

//     return response;
//   }
// );

// export const GetPixAvailable = createAsyncThunk(
//   "user/pixAvailable",
//   async () => {
//     const response = await api
//       .get(`/payment/Pix/available`)
//       .then((r): PixAvailableResponse => r.data)
//       .catch((error) => {
//         return error.response.data;
//       });
//     return response;
//   }
// );

// export const GetPaymentMethodAvailable = createAsyncThunk(
//   "user/GetPaymentMethodAvailable",
//   async () => {
//     const response = await api
//       .get(`/payment/payment-method/availability`)
//       .then((r): PaymentMethodAvailableResponse => r.data)
//       .catch((error) => {
//         return error.response.data;
//       });
//     return response;
//   }
// );

// export const GetHash = createAsyncThunk(
//   "user/GetHash",
//   async (email: string) => {
//     const response = await api
//       .get(`/member/user/hash/${email}`)
//       .then((r): GetHashResponse => r.data)
//       .catch((error) => {
//         return error.response.data;
//       });
//     return response;
//   }
// );

// export const GetStoreVersion = createAsyncThunk(
//   "user/GetStoreVersion",
//   async () => {
//     const response = await api
//       .get(`/signup/app/version`)
//       .then((r): GetVersionResponse => r.data)
//       .catch((error) => {
//         return error.response.data;
//       });
//     return response;
//   }
// );

// export const GetUserDetails = createAsyncThunk(
//   "user/GetUserDetails",
//   async () => {
//     const response = await api
//       .get(`/signup/user/investor`)
//       .then((r): UserDetailsResponse => r.data)
//       .catch((error) => {
//         return error.response.data;
//       });
//     return response;
//   }
// );

// export const ChangeUserDetails = createAsyncThunk(
//   "user/ChangeUserDetails",
//   async (request: CompleteRequest) => {
//     const response = await api
//       .put(`/signup/user/investor`, request)
//       .then(() => true)
//       .catch((error) => {
//         return error.response.data;
//       });
//     return response;
//   }
// );

// export const ChangeUserPicture = createAsyncThunk(
//   "user/ChangeUserPicture",
//   async (request: any) => {
//     const response = await api
//       .patch(`/member/user/profile/image`, request, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })
//       .then(() => true)
//       .catch((error) => {
//         return error.response.data;
//       });
//     return response;
//   }
// );

// export const GetUserPicture = createAsyncThunk(
//   "user/GetUserPicture",
//   async () => {
//     const response = await api
//       .get(`/member/user/profile/image`)
//       .then((r): UserPictureResponse => {
//         return r.data;
//       })
//       .catch((error) => {
//         return error.response.data;
//       });
//     return response;
//   }
// );


