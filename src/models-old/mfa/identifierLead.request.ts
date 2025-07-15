export type IdentifierLeadRequest = {
  hash: string;
  reason: 'ConfirmEmail' | 'ConfirmCell';
  wpp?: boolean
};
