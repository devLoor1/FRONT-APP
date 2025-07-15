import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAvoidingView, Platform, View, TouchableOpacity } from 'react-native';
import { GetUserStatus } from '~/services/user';
import refreshToken from '~/helpers/refreshToken';
import { useAuth } from '~/context/auth';
import Steps from '~/components/Steps';
import PersonalDataOne from './pages/PersonalDataOne';
import { useCustomStyles } from './style';
import Snack from '~/components/Snack';
import PersonalDataTwo from './pages/PersonalDataTwo';
import Address from './pages/Address';
import Caf from './pages/Caf';
import Proof from './pages/Proof'; 
import SuccessPage from './pages/Success';
import { useTheme } from '~/context/MyThemeContext';
import { useNavigation } from '@react-navigation/native';
import ArrowBack from '~/../assets/newSvgs/icons/arrow_back.svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/models/routes/navigation';
import BankData from './pages/BankData';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const styles = useCustomStyles();
  const { userStatus } = useAppSelector(state => state.user);
  const { responseComplete, requestError } = useAppSelector(state => state.register);
  const [page, setPage] = useState(1);
  const { deviceToken } = useAuth();
  const [showSnack, setShowSnack] = useState(false);
  const [msgError, setMsgError] = useState('');
  const { theme } = useTheme();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { cafStatus } = useAppSelector(state => state.caf);

  useEffect(() => {
    setShowSnack(false);
    setMsgError('');

    if (userStatus) {
      const bankFields: ('BankNumber' | 'Bank' | 'AccountDigit' | 'AccountNumber' | 'AccountType' | 'Agency')[] = ['BankNumber', 'Bank', 'AccountDigit', 'AccountNumber', 'AccountType', 'Agency'];
      const hasEmptyBankFields = bankFields.some(field => userStatus.emptyFields.includes(field));

      if (
        userStatus.emptyFields.includes('Profession') ||
        userStatus.emptyFields.includes('Nationality') ||
        userStatus.emptyFields.includes('IsPep') ||
        userStatus.emptyFields.includes('BirthCity') ||
        userStatus.emptyFields.includes('Scholarity')
      ) {
        setPage(0);
      } else if (
        userStatus.emptyFields.includes('Gender') ||
        userStatus.emptyFields.includes('MaritalStatus') ||
        userStatus.emptyFields.includes('HasOwnResidence')
      ) {
        setPage(2);
      } else if (userStatus.emptyFields.includes('Caf')) {
        setPage(3);
      } else if (
        userStatus.emptyFields.includes('City') ||
        userStatus.emptyFields.includes('State') ||
        userStatus.emptyFields.includes('Country') ||
        userStatus.emptyFields.includes('Street') ||
        userStatus.emptyFields.includes('StreetNumber') ||
        userStatus.emptyFields.includes('PostalCode') ||
        userStatus.emptyFields.includes('Neighborhood')
      ) {
        setPage(4);
      } else if (userStatus.emptyFields.includes('UploadAddressDocument')) {
        setPage(5);
      } else if(hasEmptyBankFields) {
        setPage(1);
      } else {
        setPage(6);
      }
    }

  }, [userStatus]);

  useEffect(() => {
    if (responseComplete) {
      (async () => {
        await refreshToken();
        await dispatch(GetUserStatus(deviceToken));
      })();
    }
  }, [responseComplete]);

  useEffect(() => {
    if (requestError) {
      setMsgError(requestError);
      setShowSnack(true);
    }
  }, [requestError]);

  function renderContent() {
    switch (page) {
      case 1:
        return <BankData />;
      case 2:
        return <PersonalDataTwo />;
      case 3:
        return <Caf />;
      case 4:
        return <Address />;
      case 5:
        return <Proof />;
      case 6:
        return <SuccessPage />;
      default:
        return <PersonalDataOne />;
    }
  }

  if ((cafStatus === true && page === 3) || page > 4) {
    return (
      <>
        {renderContent()}
        <Snack visible={showSnack} txt={msgError} setShowSnack={setShowSnack} />
      </>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {/* <View style={{ paddingHorizontal: 16 }}>
          {!(page === 4) && <Steps qtd={3} index={page} />}
        </View> */}
        {!(cafStatus === true && page === 3) && (
          <View style={styles.btnBackBlock}>
            <TouchableOpacity onPress={() => { nav.navigate('Tabs', { screen: 'HomeTabs' }); }} style={styles.btnCancel}>
              <ArrowBack color={theme.colors.text} width={32} height={32} />
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          style={{ flex: 1, backgroundColor: theme.colors.background }}
          contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={[
              styles.container, styles.containerForm
            ]}
          >
            {renderContent()}
          </View>
        </ScrollView>
        <Snack visible={showSnack} txt={msgError} setShowSnack={setShowSnack} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
