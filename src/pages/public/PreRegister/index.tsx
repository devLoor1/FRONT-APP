import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import RegisterData from './pages/RegisterData';
import PasswordPage from './pages/Password';
import SuccessPage from './pages/Success';
import { useCustomStyles } from './style';
import ArrowIcon from '@/../assets/newSvgs/icons/arrow_back.svg';
import { useTheme } from '@/context/MyThemeContext';
import { RegisterRequest } from '@/models/new/auth/register.request';

export default function LeadPages() {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [registerPayload, setRegisterPayload] = useState<RegisterRequest>({
    email: '',
    full_name: '',
    phone: '',
    type: '',
  });

  function resetAll() {
    setCurrentPage(1);
    setRegisterPayload({
      email: '',
      full_name: '',
      phone: '',
      type: '',
    });
  }

  function handleRegisterData(data: RegisterRequest) {
    setRegisterPayload(data);
    setCurrentPage(2);
  }

  function handlePasswordComplete() {
    setCurrentPage(3);
  }

  let arrowColor = theme?.navigation?.colors?.text || '#39393A';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, flexGrow: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <TouchableOpacity
            onPress={() => (currentPage > 1 ? setCurrentPage(currentPage - 1) : navigation.replace('Login'))}
            style={styles.arrow}
          >
            <ArrowIcon color={arrowColor} />
          </TouchableOpacity>
          <View style={styles.container}>
            {currentPage === 1 && (
              <RegisterData
                registerPayload={registerPayload}
                setRegisterPayload={setRegisterPayload}
                onPress={handleRegisterData}
              />
            )}
            {currentPage === 2 && (
              <PasswordPage
                registerPayload={registerPayload}
                onPress={handlePasswordComplete}
              />
            )}
            {currentPage === 3 && <SuccessPage resetAll={resetAll} />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
