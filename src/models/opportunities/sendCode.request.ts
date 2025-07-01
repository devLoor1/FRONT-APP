export type SendCodeRequest = {
  reason: 'SecureCell' | 'SecureEmail';
  code: string;
};
