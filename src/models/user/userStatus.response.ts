export type UserStatusResponse = {
  status: 'Pendente' | 'Reprovado' | 'Aprovado';
  waitIdWall: boolean;
  waitCaf: boolean;
  hasCaf: boolean;
  emptyFields: [
    | 'UploadAddressDocument'
    | 'IdWall'
    | 'Caf'
    | 'CPF'
    | 'Cellphone'
    | 'BirthCity'
    | 'BankNumber'
    | 'Bank'
    | 'AccountDigit'
    | 'AccountNumber'
    | 'AccountType'
    | 'Agency'
    | 'DateOfBirth'
    | 'MaritalStatus'
    | 'Gender'
    | 'IsPep'
    | 'IsUnitedStatesResident'
    | 'Nationality'
    | 'Profession'
    | 'City'
    | 'Country'
    | 'State'
    | 'Street'
    | 'StreetNumber'
    | 'Neighborhood'
    | 'PostalCode'
    | 'NewTerms'
    | 'ConfirmCellphone'
    | 'ConfirmEmail'
    | 'Scholarity'
    | 'HasOwnResidence'
  ];
  valueFields: {
    account: string | null;
    accountDigit: string | null;
    accountPayment: string | null;
    agency: string;
    agencyDigit: string;
    balance: number;
    balanceBonus: number;
    bank: string;
    bankName: string;
    cellphone: string;
    cpf: string;
    profileImage?: string;
    destination: {
      account: string;
      accountType: string;
      agency: string;
      bank: string;
    };
    email: string;
    name: string;
    taxeWithdraw: number;
  };
  refreshToken: boolean;
  hash: string;
  hasTransactions: boolean;
};
