export type validateBiometricRequest = {
  operation: 'Login' | 'ApplyInvestment' | 'WithdrawPix' | 'WithdrawTED';
  authenticationType: 'Fingerprint' | 'FacialRecognition';
  isChangeBiometry: boolean;
};
