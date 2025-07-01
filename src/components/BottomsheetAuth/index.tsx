import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import {
  CodeField, 
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { GetCode, SendCode } from '@/services/opportunities';
import Snack from '@/components/Snack';
import { CodeRequest } from '@/models/opportunities/code.request';
import SecureStorage from '@/storages/secure-storage';
import { biometricsAuth } from '@/helpers/auth/biometry';
import { ValidateBiometric } from '@/services/authBiometric';
import { resetBiometric } from '@/redux/reducers/authBiometric';
import { useAuth } from '@/context/auth';
import BtnDefault from '../BtnDefault';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import CommonMask from '@/helpers/masks';
import BottomSheet from '../BottomSheet';
import { useCustomStyles } from './style';
import { useTheme } from '@/context/MyThemeContext';
import FingerIcon from '@/../assets/newSvgs/icons/Biometria.svg';
import ArrowRightIcon from '@/../assets/newSvgs/icons/keyboard_arrow_right.svg';
import EnvelopeIcon from '@/../assets/newSvgs/icons/mail.svg';
import PhoneIcon from '@/../assets/newSvgs/icons/call.svg';
import WhatsappIcon from '@/../assets/newSvgs/icons/whatsapp_logo.svg';
import { resetCode } from '@/redux/reducers/opportunities';
import { Analytics } from '@/helpers/analytics';
import CountdownTimer from '../CountdownTimer';

type authProps = {
  refRBSheet: React.RefObject<RBSheet>;
  pageHasAuth?: boolean;
  confirm(): void;
  setFinishedAnimation: React.Dispatch<React.SetStateAction<boolean>>;
  valueToTransfer?: number;
  textAnimation?: string;
  titleTxt: string;
  operation?: 'WithdrawTED' | 'WithdrawPix' | 'ApplyInvestment' | 'Login';
  analytics?: string;
};

const CELL_COUNT = 6;

export default function BottomsheetAuth({
  refRBSheet,
  confirm,
  pageHasAuth,
  setFinishedAnimation,
  valueToTransfer,
  textAnimation,
  titleTxt,
  operation,
  analytics,
}: authProps) {
  const dispatch = useAppDispatch();
  const { succesGetCode, requestError, returnSendCode, loading } = useAppSelector(
    state => state.opportunities
  );
  const { succesBiometry } = useAppSelector(state => state.authBiometric);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [value, setValue] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [hasBiometric, setHasBiometric] = useState(false);
  const [isWpp, setIsWpp] = useState(false)
  const [reason, setReason] = useState<CodeRequest['reason']>('SecureCell');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [showSnack, setShowSnack] = useState(false);
  const { theme } = useTheme();
  const [validBiometric, setValidBiometric] = useState(false);
  const { enableAuth, user } = useAuth();
  const offset = useSharedValue(0);
  const secondOpacity = useSharedValue(0.04);
  const thirdOpacity = useSharedValue(0.04);
  const styles = useCustomStyles();
  const { deviceToken } = useAuth();

  async function getCode(r: CodeRequest['reason'], wpp: boolean = false) {
    if (r !== reason) {
      await setReason(r);
    }

    setIsWpp(wpp)

    await dispatch(GetCode({ reason: r, wpp: wpp }));
  }

  async function sendCode() {
    Analytics({
      eventName: `${analytics}_${reason === 'SecureCell' ? 'SMS' : 'Email'}_EnviarValor`,
    });
    await dispatch(SendCode({ code: value, reason }));
  }

  const getTitleCode = () => {
    if (reason === 'SecureEmail') {
      return 'Validar E-mail'
    }

    return isWpp ? 'Validar Whatsapp' : 'Validar SMS'
  }

  const getSubtitleCode = () => {
    if (reason === 'SecureEmail') {
      return 'para o e-mail'
    }

    return isWpp ? 'via Whatsapp para o número' : 'via SMS para o número'
  }

  const getAnalyticsReenviar = () => {
    if (reason === 'SecureEmail') {
      return 'Email'
    }

    isWpp ? 'Whatsapp' : 'SMS'
  }

  const getTextNewCode = () => {
    if (reason === 'SecureEmail') {
      return 'Um novo código foi enviado para seu e-mail!'
    }

    return `Um novo código foi enviado via ${isWpp ? 'Whatsapp' : 'SMS'} para seu celular!`
  }


  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(offset.value, {
            damping: 20,
            stiffness: 90,
          }),
        },
      ],
    };
  });

  const animatedSecondTxtStyles = useAnimatedStyle(() => {
    return {
      opacity: withSpring(secondOpacity.value, {
        damping: 20,
        stiffness: 90,
      }),
    };
  });

  const animatedThirdTxtStyles = useAnimatedStyle(() => {
    return {
      opacity: withSpring(thirdOpacity.value, {
        damping: 20,
        stiffness: 90,
      }),
    };
  });

  useEffect(() => {
    if (succesGetCode) {
      setStep(2);
    }
  }, [succesGetCode]);

  useEffect(() => {
    if (returnSendCode || succesBiometry) {
      setStep(3);
      confirm();
      setTimeout(() => {
        secondOpacity.value = 1;
        offset.value = -100;
      }, 1500);
      setTimeout(() => {
        thirdOpacity.value = 1;
        offset.value = -220;
      }, 3000);
      setTimeout(() => {
        setFinishedAnimation(true);
        refRBSheet.current?.close();
        dispatch(resetCode());
        dispatch(resetBiometric());
        setValidBiometric(false);
      }, 4500);
    }
  }, [returnSendCode, succesBiometry]);

  useEffect(() => {
    if (requestError) {
      setError(requestError);
      setShowSnack(true);
    }
  }, [requestError]);

  useEffect(() => {
    Analytics({ pageName: analytics ?? '' });
    if (pageHasAuth && enableAuth) {
      (async () => {
        const investBiometry = await SecureStorage.GetInvestBiometry();
        setHasBiometric(investBiometry === 'true');
      })();
    }
  }, []);

  async function validateBiometry() {
    const authBiometric = await biometricsAuth();
    if (authBiometric && authBiometric.success) {
      setValidBiometric(authBiometric.success);
    }
  }

  useEffect(() => {
    if (validBiometric && operation) {
      dispatch(
        ValidateBiometric({
          authenticationType: 'FacialRecognition',
          isChangeBiometry: false,
          operation: operation,
          deviceToken
        })
      );
    }
  }, [validBiometric]);

  const ButtonChangeMethod = () => {
    if (reason === 'SecureEmail') {
      return (
        <>
          <TouchableOpacity
            style={styles.change}
            onPress={() => {
              Analytics({
                eventName: `${analytics}_SMS_TrocarEmail`,
              });
              setError(
                'Um novo código foi enviado via SMS para seu celular'
              );
              setShowSnack(true);
              return getCode('SecureCell');
            }}>
            <>
              <PhoneIcon color={theme.customColors.baseWhite} width={18} height={18} />
              <Text style={styles.changeTxt}>Trocar para SMS</Text>
            </>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.change, { marginBottom: 30 }]}
            onPress={() => {
              Analytics({
                eventName: `${analytics}_Whatsapp_TrocarEmail`,
              });
              setError(
                'Um novo código foi enviado via Whatsapp para seu celular'
              );
              setShowSnack(true);
              return getCode('SecureCell', true);
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
              eventName: `${analytics}_${isWpp ? 'Email_TrocarWhatsapp' : 'Email_TrocarSMS'}`,
            });
            setError(
              'Um novo código foi enviado para o seu E-mail'
            );
            setShowSnack(true);
            return getCode('SecureEmail');
          }}>
          <>
            <EnvelopeIcon color={theme.customColors.baseWhite} width={18} height={18} />
            <Text style={styles.changeTxt}>Trocar para E-mail</Text>
          </>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.change, { marginBottom: 30 }]}
          onPress={() => {
            Analytics({
              eventName: `${analytics}_${isWpp ? 'Sms_TrocarWhatsapp' : 'Whatsapp_TrocarSMS'}`,
            });
            setError(
              `Um novo código foi enviado via ${isWpp ? 'SMS' : 'Whatsapp'} para seu celular`
            );
            setShowSnack(true);
            return getCode('SecureCell', !isWpp);
          }}>
          <>
            {isWpp ? (
              <PhoneIcon color={theme.customColors.baseWhite} width={18} height={18} />
            ) : (
              <WhatsappIcon color={theme.customColors.baseWhite} width={18} height={18} />
            )}
            <Text style={styles.changeTxt}>{isWpp ? 'Tocar para SMS' : 'Trocar para Whatsapp'}</Text>
          </>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <BottomSheet
      refRBSheet={refRBSheet}
      height={hasBiometric ? 640 : 530}
      background={step === 3 ? theme.customColors.secondary.default : undefined}
      onClose={() => {
        setStep(1);
        offset.value = 0;
        secondOpacity.value = 0.04;
        thirdOpacity.value = 0.04;
        setValue('');
        setFinishedAnimation(false);
        setValidBiometric(false);
        {
          hasBiometric && dispatch(resetBiometric());
        }
        dispatch(resetCode());
      }}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      {step === 1 && (
        <View>
          <Text style={styles.title}>{titleTxt}</Text>
          <Text style={styles.desc}>
            Para confirmar essa ação, precisamos da{' '}
            <Text style={{ fontFamily: theme.fonts.bold }}>sua autenticação</Text>. Como deseja
            continuar?
          </Text>
          {hasBiometric && (
            <TouchableOpacity
              onPress={() => {
                Analytics({ eventName: `${analytics}_Biometria` });
                validateBiometry();
              }}
              style={styles.option}>
              <FingerIcon color={theme.colors.text} width={18} height={18} />
              <View style={{ flex: 1 }}>
                <Text style={{ ...styles.optionDesc, marginBottom: 0 }}>
                  Confirmar com Biometria
                </Text>
              </View>
              <ArrowRightIcon color={theme.colors.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              Analytics({ eventName: `${analytics}_Email` });
              getCode('SecureEmail');
            }}
            style={styles.option}>
            <EnvelopeIcon color={theme.colors.text} width={18} height={18} />
            <View style={{ flex: 1 }}>
              <Text style={styles.optionDesc}>Enviar código de confirmação para o E-mail:</Text>
              <Text style={styles.optionValue}>{CommonMask.email(user?.email || '')}</Text>
            </View>
            <ArrowRightIcon color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Analytics({ eventName: `${analytics}_SMS` });
              getCode('SecureCell');
            }}
            style={styles.option}>
            <PhoneIcon color={theme.colors.text} width={18} height={18} />
            <View style={{ flex: 1 }}>
              <Text style={styles.optionDesc}>Enviar código de confirmação via SMS:</Text>
              <Text style={styles.optionValue}>{CommonMask.hidePhone(user?.cellphone || '')}</Text>
            </View>
            <ArrowRightIcon color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Analytics({ eventName: `${analytics}_Whatsapp` });
              getCode('SecureCell', true);
            }}
            style={styles.option}>
            <WhatsappIcon color={theme.colors.text} width={18} height={18} />
            <View style={{ flex: 1 }}>
              <Text style={styles.optionDesc}>Enviar código de confirmação via Whatsapp:</Text>
              <Text style={styles.optionValue}>{CommonMask.hidePhone(user?.cellphone || '')}</Text>
            </View>
            <ArrowRightIcon color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      )}
      {step === 2 && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flexGrow: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {getTitleCode()}
              </Text>
              <Text style={{ ...styles.desc, marginBottom: 0 }}>
                Digite abaixo o{' '}
                <Text style={{ fontFamily: theme.fonts.bold }}>código de 6 dígitos</Text> que
                enviamos {getSubtitleCode()}
              </Text>
              <Text style={{ ...styles.desc, fontFamily: theme.fonts.bold }}>
                {reason === 'SecureEmail'
                  ? CommonMask.email(user?.email || '')
                  : CommonMask.hidePhone(user?.cellphone || '')}
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
                        eventName: `${analytics}_${getAnalyticsReenviar()}_Reenviar`,
                      });
                      setError(getTextNewCode());
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
            <BtnDefault
              label={
                loading
                  ? 'Carregando...'
                  : valueToTransfer
                    ? `Enviar - R$ ${CommonMask.currency(valueToTransfer.toFixed(2).toString())}`
                    : 'Confirmar Código'
              }
              white={!theme.dark}
              disabled={value.length < 6 || loading}
              onPress={sendCode}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
      {step === 3 && (
        <>
          {Analytics({
            pageName: `${analytics}_${textAnimation ?? 'ConfirmacaoTransacao'}`,
          })}
          <View style={styles.animationContainer}>
            <Text style={styles.animationTitle}>
              Confirmando {textAnimation ? textAnimation : 'PIX'}...
            </Text>
            <View style={{ overflow: 'hidden' }}>
              <Animated.View style={[animatedStyles]}>
                <Animated.View>
                  <Text style={styles.animationText}>Conferindo Transação...</Text>
                </Animated.View>
                <Animated.View style={[animatedSecondTxtStyles]}>
                  <Text style={styles.animationText}>Processando Transação...</Text>
                </Animated.View>
                <Animated.View style={[animatedThirdTxtStyles]}>
                  <Text style={styles.animationText}>Obtendo Informações...</Text>
                </Animated.View>
              </Animated.View>
            </View>
          </View>
        </>
      )}
      <Snack visible={showSnack} txt={error} type={'information'} setShowSnack={setShowSnack} />
    </BottomSheet>
  );
}
