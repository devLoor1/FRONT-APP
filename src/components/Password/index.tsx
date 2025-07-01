import { Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Input from '../Input';
import CommonValidators from '@/helpers/validators/common.validators';
import { TextInput } from 'react-native-paper';
import { useCustomStyles } from './style';
import { useTheme } from '@/context/MyThemeContext';
import EyeIcon from '@/../assets/newSvgs/icons/visibility.svg';
import EyeOffIcon from '@/../assets/newSvgs/icons/visibility_off.svg';
import ErrorIcon from '@/../assets/newSvgs/icons/close_small.svg';
import SuccessIcon from '@/../assets/newSvgs/icons/check_small.svg';

type PasswordProps = {
  password: string;
  labelPassword: string;
  secondPassword: string;
  labelSecondPassword: string;
  setPassword: (value: React.SetStateAction<string>) => void;
  setSecondPassword: (value: React.SetStateAction<string>) => void;
  setIsValidPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PasswordComp({
  password,
  labelPassword,
  setPassword,
  secondPassword,
  labelSecondPassword,
  setSecondPassword,
  setIsValidPassword,
}: PasswordProps) {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [errorHandle, setErrorHandle] = useState<{
    status: boolean;
    error: {
      minLenght: boolean;
      hasNumber: boolean;
      hasUppercase: boolean;
      specialCharacter: boolean;
    };
    msg: string;
  }>();
  const [error, setError] = useState({
    password: '',
    secondPassword: '',
  });
  const styles = useCustomStyles();
  const { theme } = useTheme();

  useEffect(() => {
    if (password.length > 5 || secondPassword.length > 5) {
      const passwordValidator = CommonValidators.isPasswordValidOnHandle(password);
      const confirmPasswordValidator = CommonValidators.isPasswordValidOnHandle(secondPassword);
      setError({
        password: passwordValidator.msg,
        secondPassword: confirmPasswordValidator.msg,
      });
      if (passwordValidator.status && confirmPasswordValidator.status) {
        setIsValidPassword(true);
      } else {
        setIsValidPassword(false);
      }
    } else {
      setIsValidPassword(false);
    }
  }, [password, secondPassword]);

  function togglePassword() {
    setHidePassword(!hidePassword);
  }

  function toggleConfirmPassword() {
    setHideConfirmPassword(!hideConfirmPassword);
  }

  function renderIcon(isError: boolean) {
    if (isError) {
      return (
        <View style={{ marginRight: 8 }}>
          <ErrorIcon color={theme.customColors.error.default} width={24} height={24} />
        </View>
      );
    } else {
      return (
        <View style={{ marginRight: 8 }}>
          <SuccessIcon color={theme.customColors.success.default} width={24} height={24} />
        </View>
      );
    }
  }

  return (
    <View>
      <Input
        value={password}
        placeholder={labelPassword}
        setValue={txt => {
          const passwordValidator = CommonValidators.isPasswordValidOnHandle(txt.toString());
          setErrorHandle(passwordValidator);
          setPassword(txt);
        }}
        secureTextEntry={hidePassword}
        error={!!error.password}
        txtError={error.password}
        right={
          <TextInput.Icon
            icon={() =>
              hidePassword ? (
                <EyeOffIcon
                  color={
                    theme.dark ? theme.customColors.neutrals[400] : theme.customColors.baseBlack
                  }
                />
              ) : (
                <EyeIcon
                  color={
                    theme.dark ? theme.customColors.neutrals[400] : theme.customColors.baseBlack
                  }
                />
              )
            }
            style={{ marginTop: 15 }}
            onPress={() => togglePassword()}
          />
        }
      />

      <Input
        secureTextEntry={hideConfirmPassword}
        value={secondPassword}
        placeholder={labelSecondPassword}
        setValue={setSecondPassword}
        error={!!error.secondPassword}
        txtError={error.secondPassword}
        right={
          <TextInput.Icon
            icon={() =>
              hideConfirmPassword ? (
                <EyeOffIcon
                  color={
                    theme.dark ? theme.customColors.neutrals[400] : theme.customColors.baseBlack
                  }
                />
              ) : (
                <EyeIcon
                  color={
                    theme.dark ? theme.customColors.neutrals[400] : theme.customColors.baseBlack
                  }
                />
              )
            }
            style={{ marginTop: 15 }}
            onPress={() => toggleConfirmPassword()}
          />
        }
      />

      <View style={styles.blockRequests}>
        <Text style={styles.requestsTitle}>Requisitos de uma senha segura</Text>
        <View style={styles.textRow}>
          {renderIcon(!errorHandle?.error.minLenght)}
          <Text
            style={{
              ...styles.inputText,
              color: !errorHandle?.error.minLenght
                ? theme.customColors.error.default
                : theme.customColors.success.default,
            }}>
            Deve conter no mínimo seis caracteres
          </Text>
        </View>
        <View style={styles.textRow}>
          {renderIcon(!errorHandle?.error.hasNumber)}
          <Text
            style={{
              ...styles.inputText,
              color: !errorHandle?.error.hasNumber
                ? theme.customColors.error.default
                : theme.customColors.success.default,
            }}>
            Pelo menos um número: "0123"
          </Text>
        </View>
        <View style={styles.textRow}>
          {renderIcon(!errorHandle?.error.hasUppercase)}
          <Text
            style={{
              ...styles.inputText,
              color: !errorHandle?.error.hasUppercase
                ? theme.customColors.error.default
                : theme.customColors.success.default,
            }}>
            Pelo menos uma letra maiúscula: "ABC"
          </Text>
        </View>
        <View style={styles.textRow}>
          {renderIcon(!errorHandle?.error.specialCharacter)}
          <Text
            style={{
              ...styles.inputText,
              color: !errorHandle?.error.specialCharacter
                ? theme.customColors.error.default
                : theme.customColors.success.default,
            }}>
            Um caractere especial
          </Text>
        </View>
      </View>
    </View>
  );
}
