import { GestureResponderEvent } from 'react-native';

export type BtnType = {
  txt: string;
  margin?: string;
  width?: string;
  loading?: boolean;
  disable?: boolean;
  blue?: boolean;
  height?: string;
  onPress?: (event: GestureResponderEvent) => void;
};
