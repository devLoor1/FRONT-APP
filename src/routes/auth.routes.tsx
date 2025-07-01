import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PreRegister from '@/pages/public/PreRegister';
import ForgetPage from '@/pages/public/Forget';
import LoginPage from '@/pages/public/Login';
import OnboardingPages from '@/pages/public/Onboarding';

const AuthStack = createNativeStackNavigator();

export default function AuthRoutes() {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen name="Login" component={LoginPage} />
      <AuthStack.Screen name="Forget" component={ForgetPage} />
      <AuthStack.Screen name="PreRegister" component={PreRegister} />
      <AuthStack.Screen name="Onboarding" component={OnboardingPages} />
    </AuthStack.Navigator>
  );
}