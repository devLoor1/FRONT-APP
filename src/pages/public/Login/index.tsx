import React, { useEffect, useRef, useState } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import EnableAuthentication from './components/EnableAuthentication';
import { useAuth } from '@/context/auth';
import SecureStorage from '@/storages/secure-storage';
import NewDevice from './components/NewDevice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { reset } from '@/redux/reducers/auth';
import { ScrollView } from 'react-native-gesture-handler';
import LoginContent from './components/LoginContent';
import { KeyboardAvoidingView, Platform } from 'react-native';
// import { Analytics } from '@/helpers/analytics';

function LoginPage() {
  const refRBSheetAuth = useRef<RBSheet>(null);
  const refRBSheetNewDevice = useRef<RBSheet>(null);
  const [newDevicePage, setNewDevicePage] = useState(1);
  const [reopen, setReopen] = useState(false);
  const { loginData } = useAppSelector(state => state.auth);
  const [answerBiometry, setAnswerBiometry] = useState<boolean | null>(null);
  const { onSignIn, enableAuth, onSignOut } = useAuth();
  const dispatch = useAppDispatch();

  async function getStorage() {
    if (enableAuth) {
      const activeBiometry = await SecureStorage.GetLoginBiometry();
      setAnswerBiometry(activeBiometry ? activeBiometry === 'true' : null);
    } else {
      setAnswerBiometry(false);
    }
  }

  useEffect(() => {
    // Analytics({ pageName: 'HomeLogin' });
    getStorage();
  }, []);

  useEffect(() => {
    (async () => {
      if (loginData) {
        getStorage();
        const activeBiometry = await SecureStorage.GetLoginBiometry();
        if (loginData.cryptoDeviceToken) {
          if (!reopen) {
            setNewDevicePage(1)
          }
          refRBSheetNewDevice.current?.open();
        } else if (enableAuth && activeBiometry === null) {
          refRBSheetNewDevice.current?.close();
          refRBSheetAuth.current?.open();
        }
        if (answerBiometry !== null && !loginData.cryptoDeviceToken) {
          onSignIn();
        }
      } else {
        // refRBSheetNewDevice.current?.close();
        // refRBSheetAuth.current?.close();
      }
    })();
  }, [loginData]);

  function onClose() {
    if (!loginData || loginData?.cryptoDeviceToken || answerBiometry === null) {
      onSignOut();
      dispatch(reset());
    }
    getStorage();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flexGrow: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <LoginContent />
          <NewDevice
            refRBSheet={refRBSheetNewDevice}
            setNewDevicePage={setNewDevicePage}
            newDevicePage={newDevicePage}
            onClose={onClose}
            setReopen={setReopen}
          />
          <EnableAuthentication refRBSheet={refRBSheetAuth} onClose={onClose} />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default LoginPage;
