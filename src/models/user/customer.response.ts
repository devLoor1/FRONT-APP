export type CustomerResponse = {
  account: string | null;
  accountDigit: string | null;
  accountPayment: string | null;
  agency: string;
  agencyDigit: string;
  balance: number;
  bank: string;
  bankName: string;
  cellphone: string;
  cpf: string;
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
