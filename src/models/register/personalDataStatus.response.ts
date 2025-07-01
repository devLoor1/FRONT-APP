export type PersonalDataStatusResponse = {
  status: 'Pending' | 'Concluded';
  emptyFields: string[] | null;
};
