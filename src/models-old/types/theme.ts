interface ColorVariations {
  default: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000: string;
}

interface ColorVariationsSmall {
  default: string;
  100: string;
  200: string;
  300: string;
}

export interface Colors {
  baseWhite: string;
  baseBlack: string;
  primary: ColorVariations;
  secondary: ColorVariations;
  neutrals: ColorVariations;
  success: ColorVariationsSmall;
  warning: ColorVariationsSmall;
  error: ColorVariationsSmall;
  placeholder: string;
  inputBg: string;
  desc: string;
  risk: ColorVariationsSmall;
  hyperlink: string;
}
