import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type PublicTypes = {
  Login: undefined;
  Forget: undefined;
  Register: undefined;
};

export type PublicNavigation = NativeStackNavigationProp<PublicTypes>;
