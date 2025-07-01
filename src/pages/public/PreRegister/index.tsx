import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GeneralPage from './pages/GeneralPage';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { reset } from '@/redux/reducers/lead';
import { LeadRequest } from '@/models/lead/lead.request';
import LoadingComp from '@/components/Loading';
import * as Clipboard from 'expo-clipboard';
import { GetLeadMissing } from '@/services/lead';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import ConfirmCellphonePage from './pages/ConfirmCellphone';
import Snack from '@/components/Snack';
import DataIntroduction from './pages/DataIntroduction';
import PersonalData from './pages/PersonalData';
import ConfirmEmailPage from './pages/ConfirmEmail';
import PasswordPage from './pages/Password';
import EnableNotification from './pages/EnableNotification';
import SuccessPage from './pages/Success';
import { useCustomStyles } from './style';
import ArrowIcon from '@/../assets/newSvgs/icons/arrow_back.svg';
import { useTheme } from '@/context/MyThemeContext';

export default function LeadPages() {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const nav = useNavigation();
  const dispatch = useAppDispatch();
  const {
    hash,
    responsePassword,
    loadingPost,
    leadMissingFields,
    confirmCellphone,
    confirmEmail,
    loadingFields,
    requestError,
  } = useAppSelector(state => state.lead);
  const [generalInfos, setGeneralInfos] = useState<LeadRequest>({
    email: '',
    name: '',
    inviteCode: '',
    cellphone: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showSnack, setShowSnack] = useState(false);
  const [msgAlert, setAlertMsg] = useState('');
  const [msgType, setMsgType] = useState<'warning' | 'error' | 'information'>('error');

  function resetAll() {
    dispatch(reset());
    setCurrentPage(1);
    setShowSnack(false);
    setGeneralInfos({
      email: '',
      name: '',
      inviteCode: '',
      cellphone: '',
      birth: undefined,
      deviceToken: undefined,
      document: undefined,
      hash: undefined,
      amountToInvest: '0',
    });
  }

  useEffect(() => {
    return () => {
      resetAll();
    };
  }, []);

  useEffect(() => {
    if (hash && !loadingFields) {
      dispatch(GetLeadMissing(hash.hash));
    }
  }, [hash, confirmCellphone, confirmEmail]);

  useEffect(() => {
    setShowSnack(false);
    setAlertMsg('');

    if (leadMissingFields) {
      if (leadMissingFields.includes('cellphone')) {
        setCurrentPage(1);
      } else if (leadMissingFields.includes('confirmCellphone')) {
        setCurrentPage(2);
      } else if (leadMissingFields.includes('email')) {
        setCurrentPage(3);
      } else if (leadMissingFields.includes('confirmEmail')) {
        setCurrentPage(5);
      } else {
        setCurrentPage(6);
      }
    }
  }, [leadMissingFields]);

  useEffect(() => {
    if (responsePassword) {
      setCurrentPage(8);
    }
  }, [responsePassword]);

  async function handleGetInitialInvite() {
    const initialUrl = await Clipboard.getStringAsync();

    if (initialUrl && initialUrl.includes('code')) {
      const inviteCode = await initialUrl.replace('code', '');
      setGeneralInfos({ ...generalInfos, inviteCode });
    }
  }

  useEffect(() => {
    handleGetInitialInvite();
  }, []);

  useEffect(() => {
    if (requestError) {
      setAlertMsg(requestError);
      setShowSnack(true);
    }
  }, [requestError]);

  if (loadingPost) {
    <LoadingComp />;
  }

  if (currentPage === 8) {
    return <SuccessPage resetAll={resetAll} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, flexGrow: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <TouchableOpacity
              onPress={() => (currentPage > 1 ? setCurrentPage(currentPage - 1) : nav.goBack())}
              style={styles.arrow}
              disabled={currentPage === 3 ||  currentPage === 6}
              >
              <ArrowIcon 
                color={ 
                  currentPage === 3 ||  currentPage === 6 ? 
                  theme?.navigation?.dark ? theme?.customColors?.neutrals?.[900] || '#1A1A1A' : theme?.customColors?.neutrals?.[100] || '#F5F5F5' : theme?.navigation?.colors?.text || '#39393A'
                }
              />
               
            </TouchableOpacity>
          <View style={styles.container}>
            {currentPage === 1 && (
              <GeneralPage
                generalInfos={generalInfos}
                setGeneralInfos={setGeneralInfos}
                setShowSnack={setShowSnack}
                setAlertMsg={setAlertMsg}
              />
            )}
            {currentPage === 2 && (
              <ConfirmCellphonePage
                cellphone={generalInfos.cellphone || ''}
                setShowSnack={setShowSnack}
                setAlertMsg={setAlertMsg}
                setMsgType={setMsgType}
              />
            )}
            {currentPage === 3 && <DataIntroduction setPage={setCurrentPage} />}
            {currentPage === 4 && (
              <PersonalData generalInfos={generalInfos} setGeneralInfos={setGeneralInfos} />
            )}
            {currentPage === 5 && (
              <ConfirmEmailPage
                email={generalInfos.email || ''}
                setShowSnack={setShowSnack}
                setAlertMsg={setAlertMsg}
                setMsgType={setMsgType}
              />
            )}
            {currentPage === 6 && <PasswordPage />}
            {currentPage === 7 && <EnableNotification setPage={setCurrentPage} />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Snack visible={showSnack} txt={msgAlert} setShowSnack={setShowSnack} type={msgType} />
    </SafeAreaView>
  );
}
