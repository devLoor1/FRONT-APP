import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCustomStyles } from './style';
import GeneralPage from './components/GeneralPage';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { GetIdentifier } from '~/services/register';
import ConfirmEmailPage from './components/ConfirmEmail';
import Password from './components/Password';
import ConfirmationPage from './components/Confirmation';
import { reset } from '~/redux/reducers/forget';
import * as registerReset from '~/redux/reducers/register';
import Snack from '~/components/Snack';
import { useNavigation } from '@react-navigation/native';
import { PublicNavigation } from '~/models/routes/navigation.public';
import Steps from '~/components/Steps';

export default function ForgetPage() {
  const dispatch = useAppDispatch();
  const { identifierData, newIdentifierData, requestError } = useAppSelector(
    state => state.register
  );
  const { responseNewPassword } = useAppSelector(state => state.forget);
  const navigation = useNavigation<PublicNavigation>();
  const { userHash, requestError: userError } = useAppSelector(state => state.user);
  const [email, setEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSnack, setShowSnack] = useState(false);
  const [msgError, setMsgError] = useState('');
  const styles = useCustomStyles();

  async function getIdentifier() {
    if (email && userHash) {
      const { hash, name } = userHash;
      await dispatch(
        GetIdentifier({
          hash,
          reason: 'ChangePasswordEmail',
          identifier: email,
          name,
        })
      );
    }
  }

  useEffect(() => {
    if (userHash) {
      getIdentifier();
    }
  }, [userHash]);

  useEffect(() => {
    if (identifierData) {
      setCurrentPage(2);
    }
  }, [identifierData]);

  useEffect(() => {
    if (newIdentifierData?.token) {
      setCurrentPage(3);
    }
  }, [newIdentifierData]);

  useEffect(() => {
    if (responseNewPassword) {
      setCurrentPage(4);
    }
  }, [responseNewPassword]);

  useEffect(() => {
    return () => {
      dispatch(reset());
      dispatch(registerReset.reset());
      setCurrentPage(1);
    };
  }, []);

  function confirmRegister() {
    dispatch(reset());
    dispatch(registerReset.reset());
    setCurrentPage(1);
    navigation.navigate('Login');
  }

  useEffect(() => {
    if (requestError) {
      setMsgError(requestError);
      setShowSnack(true);
    }
  }, [requestError]);

  useEffect(() => {
    if (userError) {
      setMsgError(userError);
      setShowSnack(true);
    }
  }, [userError]);

  function renderContent() {
    switch (currentPage) {
      case 2:
        return <ConfirmEmailPage getIdentifier={getIdentifier} email={email} />;
      case 3:
        return <Password setShowSnack={setShowSnack} reset={reset} />;
      default:
        return <GeneralPage email={email} setEmail={setEmail} />;
    }
  }

  if (currentPage === 4) {
    return <ConfirmationPage confirmRegister={confirmRegister} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <View style={styles.container}>
          {currentPage !== 4 && <Steps qtd={3} index={currentPage} />}

          {renderContent()}
        </View>
      </KeyboardAvoidingView>
      <Snack visible={showSnack} txt={msgError} setShowSnack={setShowSnack} reset={reset} />
    </SafeAreaView>
  );
}
