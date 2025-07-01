export type PixResponse = {
  account: string;
  accountType: string;
  agency: string;
  bank: string;
  created: string;
  idKey: number;
  key: string;
  keyType: 'CPF' | 'Cellphone' | 'Email' | 'Random';
}[];
