export type PaymentMethodAvailableResponse = {
  pix: {
    status: 'Available' | 'TemporarilyUnavailable' | 'Unavailable';
  };
  ted: {
    status: 'Available' | 'TemporarilyUnavailable' | 'Unavailable';
    limit: string;
  };
  isHoliday: boolean;
  currentDate: string;
};
