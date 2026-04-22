import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models/routes/navigation.private';
import { useAppDispatch } from '@/redux/hooks';
import { fetchUserData } from '@/redux/reducers/auth';
import Proof from '@/pages/private/Register/pages/Proof';

export default function FaceMatchPage() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  async function handleContinue() {
    await dispatch(fetchUserData());
    nav.replace('Tabs', { screen: 'HomeTabs' });
  }

  return (
    <Proof
      onContinue={handleContinue}
      hideRetakeIcon={false}
      onPrev={() => nav.replace('Tabs', { screen: 'HomeTabs' })}
    />
  );
}
