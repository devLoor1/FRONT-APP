import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type PublicTypes = {
  Login: undefined;
  Forget: undefined;
  Register: undefined;
  Opportunities: undefined;
  Contact: undefined;
  Analyzing: undefined;
  Refused: undefined;
  Chat: undefined;
};

export type PublicNavigation = NativeStackNavigationProp<PublicTypes>;
