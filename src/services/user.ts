import api from "./api";
import { Platform } from "react-native";

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
  const response = await api.get<PersonalInformationResponse | { data: PersonalInformationResponse }>("/investors/personal-information");
  const body = response.data;
  if ("data" in body && typeof body.data === "object" && body.data !== null && "cpf" in body.data) {
    return body.data as PersonalInformationResponse;
  }
  return body as PersonalInformationResponse;
};

export const postPersonalInformation = async (request: PersonalInformationRequest) => {
  const response = await api.post<PersonalInformationResponse>(
    "/investors/personal-information",
    request
  );
  return response.data;
};

export const submitFaceMatch = async (document: any, selfie: any) => {
  const formData = new FormData();

  if (Platform.OS === 'web') {
    // Web: document/selfie have a .file property (File object) or .uri (blob URL)
    if (document.file instanceof File) {
      formData.append('document', document.file, document.file.name);
    } else if (document.uri) {
      const resp = await fetch(document.uri);
      const blob = await resp.blob();
      formData.append('document', blob, 'document.jpg');
    }

    if (selfie.file instanceof File) {
      formData.append('selfie', selfie.file, selfie.file.name);
    } else if (selfie.uri) {
      const resp = await fetch(selfie.uri);
      const blob = await resp.blob();
      formData.append('selfie', blob, 'selfie.jpg');
    }
  } else {
    // Native (iOS/Android): objects have uri, type, name
    const documentFileName = (document.uri || '').split('/').pop() || 'document.jpg';
    formData.append('document', {
      uri: document.uri,
      type: 'image/jpeg',
      name: documentFileName,
    } as any);

    const selfieFileName = (selfie.uri || '').split('/').pop() || 'selfie.jpg';
    formData.append('selfie', {
      uri: selfie.uri,
      type: 'image/jpeg',
      name: selfieFileName,
    } as any);
  }

  const response = await api.post('/investors/face-match', formData, {
    headers: Platform.OS === 'web' ? {} : { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};
