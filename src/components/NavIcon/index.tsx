import React, { SVGProps } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { useCustomStyles } from './style';
import { useTheme } from '@/context/MyThemeContext';
import Svg from 'react-native-svg';

const NavIcon: React.FC<
  Omit<TouchableOpacityProps, 'children'> & { Icon: React.FC<SVGProps<Svg>>; label: string }
> = ({ label, Icon, ...props }) => {
  const { theme } = useTheme();
  const styles = useCustomStyles();

  return (
    <TouchableOpacity
      {...props}
      style={[{ opacity: props.disabled ? 0.3 : 1 }, props.style]}
      activeOpacity={props.disabled ? 1 : 0.2}>
      <View style={styles.navIcon}>
        <Icon
          width={24}
          height={24}
          color={theme.dark ? '#fff' : theme.customColors.neutrals[500]}
        />
      </View>
      <Text style={styles.navTxt}>{label}</Text>
    </TouchableOpacity>
  );
};

export default NavIcon;
