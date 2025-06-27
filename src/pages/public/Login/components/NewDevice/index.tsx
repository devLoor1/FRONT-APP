import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import React, { useEffect, useState } from 'react';
import BottomSheet from '../../../../../components/BottomSheet';
import { useCustomStyles } from './style';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useTheme } from '~/context/MyThemeContext';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import Snack from '~/components/Snack';
import { GetNewDeviceCode, PostNewDeviceCode } from '~/services/auth';
import { NewcellRequest } from '~/models/auth/newphone.request';
import Envelope from '~/../assets/newSvgs/icons/mail.svg';
import Phone from '~/../assets/newSvgs/icons/call.svg';
import WhatsappIcon from '~/../assets/newSvgs/icons/whatsapp_logo.svg';
import ArrowIcon from '~/../assets/newSvgs/icons/keyboard_arrow_right.svg';
import { Analytics } from '~/helpers/analytics';
import CountdownTimer from '~/components/CountdownTimer';

type Props = {
  refRBSheet: any;
  newDevicePage: number;
  setNewDevicePage: React.Dispatch<React.SetStateAction<number>>;
  onClose(): void;
  setReopen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CELL_COUNT = 6;

export default function RegisterNewPhone({
  newDevicePage,
  setNewDevicePage,
  refRBSheet,
  onClose,
  setReopen
}: Props) {
  const dispatch = useAppDispatch();
  const { loginData, succesGetCode, loading, requestError } = useAppSelector(state => state.auth);
  const [error, setError] = useState('');
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const [value, setValue] = useState('');
  const [isWpp, setIsWpp] = useState(false)
  const [canResend, setCanResend] = useState(false);
  const [reason, setReason] = useState<NewcellRequest['reason']>('ChangeDeviceCell');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [showSnack, setShowSnack] = useState(false);
  const [token, setToken] = useState('');

  async function getCode(r: NewcellRequest['reason'], wpp: boolean = false) {
    setValue('');
    if (r !== reason) {
      await setReason(r);
    }

    setIsWpp(wpp)

    await dispatch(GetNewDeviceCode({ reason: r, cryptoDeviceToken: token, wpp: wpp }));
  }

  async function sendCode() {
    Analytics({
      eventName:
        reason === 'ChangeDeviceCell'
          ? 'NovoDeviceSMS_ConfirmarCodigo'
          : 'NovoDeviceEmail_ConfirmarCodigo',
    });

    await dispatch(
      PostNewDeviceCode({
        request: { reason, cryptoDeviceToken: token },
        code: value,
      })
    );
  }

  const getTitleCode = () => {
    if (reason === 'ChangeDeviceEmail') {
      return 'Validar E-mail'
    }

    return isWpp ? 'Validar Whatsapp' : 'Validar SMS'
  }

  const getSubtitleCode = () => {
    if (reason === 'ChangeDeviceEmail') {
      return 'para o e-mail'
    }

    return isWpp ? 'via Whatsapp para o número' : 'via SMS para o número'
  }

  const getAnalyticsReenviar = () => {
    if (reason === 'ChangeDeviceEmail') {
      return 'Email'
    }

    isWpp ? 'Whatsapp' : 'SMS'
  }

  const getTextNewCode = () => {
    if (reason === 'ChangeDeviceEmail') {
      return 'Um novo código foi enviado para seu e-mail!'
    }

    return `Um novo código foi enviado via ${isWpp ? 'Whatsapp' : 'SMS'} para seu celular!`
  }

  const reopenBottomSheet = async () => {
    if (newDevicePage === 2) { return }
    setNewDevicePage(2);

    setReopen(true)
    refRBSheet.current?.close()
    setTimeout(() => {
      refRBSheet.current?.open();
    }, 400);
  };


  useEffect(() => {
    if (succesGetCode) { return }
    setNewDevicePage(1);
  }, []);

  useEffect(() => {
    if (value.length < 6) { return }

    sendCode()

  }, [value]);

  useEffect(() => {
    if (loginData && loginData.cryptoDeviceToken) {
      setToken(loginData.cryptoDeviceToken);
    }
  }, [loginData]);

  useEffect(() => {
    if (!succesGetCode) { return }
    reopenBottomSheet();
  }, [succesGetCode]);

  useEffect(() => {
    if (requestError) {
      setError(requestError);
      setShowSnack(true);
    }
  }, [requestError]);

  const ButtonChangeMethod = () => {
    if (reason === 'ChangeDeviceEmail') {
      return (
        <>
          <TouchableOpacity
            style={styles.change}
            onPress={() => {
              Analytics({
                eventName: 'NovoDeviceSMS_ConfirmarCodigo',
              });
              setError(
                'Um novo código foi enviado via SMS para seu celular'
              );
              setShowSnack(true);
              return getCode('ChangeDeviceCell');
            }}>
            <>
              <Phone color={theme.customColors.baseWhite} width={18} height={18} />
              <Text style={styles.changeTxt}>Trocar para SMS</Text>
            </>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.change, { marginBottom: 30 }]}
            onPress={() => {
              Analytics({
                eventName: 'NovoDeviceWhatsapp_ConfirmarCodigo',
              });
              setError(
                'Um novo código foi enviado via Whatsapp para seu celular'
              );
              setShowSnack(true);
              return getCode('ChangeDeviceCell', true);
            }}>
            <>
              <WhatsappIcon color={theme.customColors.baseWhite} width={18} height={18} />
              <Text style={styles.changeTxt}>Trocar para Whatsapp</Text>
            </>
          </TouchableOpacity>
        </>
      );
    }

    return (
      <>
        <TouchableOpacity
          style={styles.change}
          onPress={() => {
            Analytics({
              eventName: 'NovoDeviceEmail_ConfirmarCodigo',
            });
            setError(
              'Um novo código foi enviado para o seu E-mail'
            );
            setShowSnack(true);
            return getCode('ChangeDeviceEmail');
          }}>
          <>
            <Envelope color={theme.customColors.baseWhite} width={18} height={18} />
            <Text style={styles.changeTxt}>Trocar para E-mail</Text>
          </>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.change, { marginBottom: 30 }]}
          onPress={() => {
            Analytics({
              eventName: `${isWpp ? 'NovoDeviceSMS_ConfirmarCodigo' : 'NovoDeviceWhatsapp_ConfirmarCodigo'}`,
            });
            setError(
              `Um novo código foi enviado via ${isWpp ? 'SMS' : 'Whatsapp'} para seu celular`
            );
            setShowSnack(true);
            return getCode('ChangeDeviceCell', !isWpp);
          }}>
          <>
            <WhatsappIcon color={theme.customColors.baseWhite} width={18} height={18} />
            <Text style={styles.changeTxt}>{isWpp ? 'Tocar para SMS' : 'Trocar para Whatsapp'}</Text>
          </>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <BottomSheet
      refRBSheet={refRBSheet}
      height={newDevicePage === 1 ? 530 : 430}
      onClose={onClose}
      onOpen={() => setReopen(false)}
    >
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      {newDevicePage === 1 && (
        <>
          {Analytics({ pageName: 'NovoDevice' })}

          <View>
            <Text style={styles.title}>Registar novo dispositivo</Text>
            <Text style={styles.desc}>
              Para confirmar essa ação, precisamos da{' '}
              <Text style={{ fontFamily: theme.fonts.bold }}>sua autenticação</Text>. Como deseja
              continuar?
            </Text>
            <TouchableOpacity
              onPress={() => {
                Analytics({ eventName: 'NovoDevice_ValidarEmail' });
                getCode('ChangeDeviceEmail');
              }}
              style={styles.option}>
              <Envelope color={theme.colors.text} width={18} height={18} />
              <View style={{ flex: 1 }}>
                <Text style={styles.optionDesc}>Enviar código de confirmação para o seu Email</Text>
              </View>
              <ArrowIcon color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Analytics({ eventName: 'NovoDevice_ValidarSMS' });
                getCode('ChangeDeviceCell');
              }}
              style={styles.option}>
              <Phone color={theme.colors.text} width={18} height={18} />
              <View style={{ flex: 1 }}>
                <Text style={styles.optionDesc}>Enviar código de confirmação via SMS</Text>
              </View>
              <ArrowIcon color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Analytics({ eventName: 'NovoDevice_ValidarWhatsapp' });
                getCode('ChangeDeviceCell', true);
              }}
              style={styles.option}>
              <WhatsappIcon color={theme.colors.text} width={18} height={18} />
              <View style={{ flex: 1 }}>
                <Text style={styles.optionDesc}>Enviar código de confirmação via Whatsapp</Text>
              </View>
              <ArrowIcon color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </>
      )}
      {newDevicePage === 2 && (
        <>
          {Analytics({ pageName: 'NovoDeviceSMS' })}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flexGrow: 1 }}>
            <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
              <View style={{ flexGrow: 1 }}>
                <Text style={styles.title}>
                  {getTitleCode()}
                </Text>
                <Text style={{ ...styles.desc }}>
                  Digite abaixo o{' '}
                  <Text style={{ fontFamily: theme.fonts.bold }}>código de 6 dígitos</Text> que
                  enviamos{' '}
                  {getSubtitleCode()}
                </Text>
                <ButtonChangeMethod />
                <CodeField
                  ref={ref}
                  {...props}
                  value={value}
                  onChangeText={setValue}
                  cellCount={CELL_COUNT}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
                  renderCell={({ index, symbol, isFocused }) => (
                    <View
                      key={index}
                      style={[styles.cell, isFocused && styles.focusCell]}
                      onLayout={getCellOnLayoutHandler(index)}>
                      <Text style={[styles.cellTxt]}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    </View>
                  )}
                />
                <View style={styles.sendAgainRow}>
                  <CountdownTimer
                    initialTime={50}
                    onTimerEnd={() => setCanResend(true)}
                    style={styles.timer}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (canResend) {
                        Analytics({
                          eventName: `${getAnalyticsReenviar()}_Reenviar`,
                        });
                        setError(
                          getTextNewCode()
                        );
                        setShowSnack(true);
                        setCanResend(false);
                        return getCode(reason);
                      }
                    }}
                    disabled={!canResend}>
                    <Text
                      style={[
                        styles.sendAgainTxt,
                        !canResend && { color: theme.customColors.neutrals[500] },
                      ]}>
                      {' '}
                      Enviar novamente
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      )}
      <Snack visible={showSnack} txt={error} setShowSnack={setShowSnack} />
    </BottomSheet>
  );
}
