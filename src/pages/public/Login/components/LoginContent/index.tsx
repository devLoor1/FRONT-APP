import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCustomStyles } from './style';
import Input from '@/components/Input';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CommonValidators from '@/helpers/validators/common.validators';
import { Login } from '@/services/auth';
import { PublicNavigation } from '@/models/routes/navigation.public';
import { reset } from '@/redux/reducers/auth';
import { Analytics, handleAnalyticsUserProfile } from '@/helpers/analytics';
import Version from '@/helpers/version/version';
import NeedHelp from '@/components/NeedHelp';
import { useTheme } from '@/context/MyThemeContext';
import LogoDark from '@/../assets/newSvgs/LogoEscuro.svg';
import Logo from '@/../assets/newSvgs/LogoClaro.svg';
import BtnDefault from '@/components/BtnDefault';
import { TextInput } from 'react-native-paper';
import Snack from '@/components/Snack';
import EyeIcon from '@/../assets/newSvgs/icons/visibility.svg';
import EyeOffIcon from '@/../assets/newSvgs/icons/visibility_off.svg';
import { Dimensions } from 'react-native';

export default function LoginContent() {
  const { theme } = useTheme();
  

  const styles = useCustomStyles();
  const [hidePassword, setHidePassword] = useState(true);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { loginError, loading } = useAppSelector(state => state.auth);
  const nav = useNavigation<PublicNavigation>();
  const [showSnack, setShowSnack] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);

  const emailValidator = CommonValidators.isEmailValid(email);
  const passwordValidator = CommonValidators.isPasswordValid(password);
  const isFormValid = emailValidator.status && passwordValidator.status;

  const screenWidth = Dimensions.get('window').width;
  const horizontalMargin = 50;
  const maxLogoWidth = screenWidth - horizontalMargin * 2;

  async function handleSingIn() {
    setEmailError(emailValidator.error);
    setPasswordError(passwordValidator.error);
    if (isFormValid) {
      await dispatch(
        Login({
          grantType: 'password',
          identifier: email.toLowerCase(),
          password,
          scopes:
            'signup.api, mfa.api, member.api, agreements.api, loan.api, kyc.api, investment.api, payment.api',
        })
      );
    }
  }

  function togglePassword() {
    setHidePassword(!hidePassword);
  }

  useEffect(() => {
    return () => {
      setEmail('');
      setPassword('');
    };
  }, []);

  useEffect(() => {
    if (loginError) {
      setShowSnack(true);
    }
  }, [loginError]);

  return (
    <>
      <View style={styles.container}>
        <View style={{ paddingHorizontal: horizontalMargin }}>
          <View style={styles.logo}>
            {theme?.navigation?.dark ?
              <Logo width={maxLogoWidth} height={maxLogoWidth * 0.25} /> :
              <LogoDark width={maxLogoWidth} height={maxLogoWidth * 0.25} />
            }
          </View>
        </View>
        <Input
          placeholder="Login *"
          value={email.toLowerCase()}
          autoCapitalize="none"
          setValue={setEmail}
          autoComplete="email"
          keyboardType="email-address"
          error={!!emailError}
          txtError={emailError}
        />

        <Input
          autoComplete="password"
          placeholder="Senha *"
          secureTextEntry={hidePassword}
          value={password}
          setValue={setPassword}
          error={!!passwordError}
          txtError={passwordError}
          textContentType={focusPassword ? 'oneTimeCode' : undefined}
          onFocus={() => setFocusPassword(true)}
          onPressOut={() => setFocusPassword(false)}
          right={
            <TextInput.Icon
              icon={() =>
                hidePassword ? (
                  <EyeOffIcon
                    color={
                      theme?.navigation?.dark ? theme?.customColors?.neutrals?.[400] || '#969595' : theme?.customColors?.baseBlack || '#000000'
                    }
                  />
                ) : (
                  <EyeIcon
                    color={
                      theme?.navigation?.dark ? theme?.customColors?.neutrals?.[400] || '#969595' : theme?.customColors?.baseBlack || '#000000'
                    }
                  />
                )
              }
              style={{ marginTop: 15 }}
              onPress={() => togglePassword()}
            />
          }
        />
        <TouchableOpacity
          onPress={() => {
            Analytics({ eventName: 'HomeLogin_EsqueciSenha' });
            nav.navigate('Forget');
          }}
          style={styles.forgot}>
          <Text style={styles.forgotTxt}>Esqueci minha senha</Text>
        </TouchableOpacity>
        <BtnDefault
          label={loading ? 'Entrando...' : 'Entrar'}
          disabled={loading || !isFormValid}
          onPress={() => {
            handleAnalyticsUserProfile('signOut', {})
            Analytics({ eventName: 'HomeLogin_Entrar' });
            handleSingIn();
          }}
        />
        <View style={styles.register}>
          <Text style={styles.registerTxt}>Não tem uma conta? </Text>
          <TouchableOpacity
            onPress={() => {
              handleAnalyticsUserProfile('signOut', {})
              Analytics({ eventName: 'HomeLogin_CriarConta' });
              nav.navigate('PreRegister' as never);
            }}>
            <Text style={{ ...styles.registerTxt, fontFamily: theme?.fonts?.bold || 'NunitoSans_700Bold' }}>Criar conta</Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center' }}>
          <NeedHelp
            marginTop={80}
            onPress={() => Analytics({ eventName: 'HomeLogin_PrecisaDeAjuda' })}
          />
        </View>
      </View>
      <Text style={styles.version}>Versão {Version()}</Text>
      <Snack visible={showSnack} txt={loginError} setShowSnack={setShowSnack} reset={reset} />
    </>
  );
}
