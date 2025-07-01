import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ErrorState = { errorMessage: string; isVisible: boolean; customErrorMessage: string };

const errorSlice = createSlice({
  name: 'error',
  initialState: {
    errorMessage: '',
    isVisible: false,
    customErrorMessage: '',
  } as ErrorState,
  reducers: {
    displayError: (state, action: PayloadAction<string>) => {
      state.isVisible = true;
      state.errorMessage = action.payload;
    },
    displayCustomError: (state, action: PayloadAction<string>) => {
      state.customErrorMessage = action.payload;
    },
    hideCustomError: state => {
      state.customErrorMessage = '';
    },
    hideError: state => {
      state.isVisible = false;
    },
  },
});

export const { displayError, hideError, displayCustomError, hideCustomError } = errorSlice.actions;

export default errorSlice.reducer;
