export type NewcellRequest = {
  reason: 'ChangeDeviceCell' | 'ChangeDeviceEmail';
  cryptoDeviceToken: string;
  wpp: boolean
};
