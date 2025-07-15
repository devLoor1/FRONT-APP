import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const getTokenDocuments = createAsyncThunk('caf/getTokens', async () => {
  const response = await api
    .post(`/kyc/caf/token`)
    .then((response) => response.data)
    .catch(error => {
      return error.response.data;
    });

  return response;
});

export const sendDocuments = createAsyncThunk(
  'caf/documentoscopy',
  async (documentResult: {
    trackingId: string | null;
    type: string;
    captures: {
      imagePath: string;
      imageUrl: string;
      label: string;
      quality: number;
    }[];
  }) => {
    try {
      const response = await api.post('/kyc/caf/documentoscopy', {
        trackingId: documentResult.trackingId,
        type: documentResult.type,
        captures: documentResult.captures.map(capture => ({
          imagePath: capture.imagePath,
          imageUrl: capture.imageUrl,
          label: capture.label,
          quality: capture.quality,
        })),
      });
      return response.data;
    } catch (error: any) {
      return error.response?.data || error.message;
    }
  }
);

export const sendSignedResponse = createAsyncThunk('CAF/sendSignedResponse', async (request: string) => {
  const response = await api
    .post(`/kyc/caf/liveness`, { SignedToken: request })
    .then(() => true)
    .catch(error => {
      return error.response.data;
    });

  return response;
});