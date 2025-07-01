export type UserDetailsResponse = {
  accountDigit?: string;
  accountNumber?: string;
  accountType?: string;
  address?: {
    city: string;
    complement?: string;
    country: string;
    neighborhood: string;
    postalCode: string;
    state: string;
    street: string;
    streetNumber: string;
  };
  agency?: string;
  bank?: string;
  bankNumber?: string;
  birthCity?: string;
  cpf: string;
  dateOfBirth: string;
  gender?: string;
  isPep?: number;
  maritalStatus?: string;
  nationality?: string;
  profession?: string;
  scholarity?: string;
  hasOwnResidence?: boolean;
  spouse?: string;
};
