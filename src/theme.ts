import { Platform } from 'react-native';

export const colors = {
  bg: '#F4F5FA',
  bgAlt: '#F4F4F4',
  bgTint: '#ECF1FA',
  surface: '#FFFFFF',
  surfaceTint: '#DCE5F4',
  onSurface: '#FFFFFF',
  fg: '#23233C',
  fgBody: '#1C1C1C',
  fgStrong: '#000000',
  muted: '#A5A5A5',
  muted2: '#898888',
  mutedInput: '#8D8D8D',
  border: '#707070',
  borderSoft: '#1C1C1C',
  accent: '#6CC57C',
  accentSoft: '#61D27C',
  accentStrong: '#179F2F',
  accent15: '#6CC57C26',
  accent85: '#6CC57CD9',
  accent64: '#6CC57CA3',
  accent47: '#6CC57C78',
  onAccent: '#FFFFFF',
  barExpenses: '#6CC57C',
  barDeposit: '#2B2B2B',
  tabInactive: '#BBC7DB',
  navInk: '#181461',
  track: '#F4F4F4',
  shadowSoft: '#00000014',
  shadowBlue: '#60719329',
  shadowStrong: '#00000029',
} as const;

export const colours = colors;

export const spacing = {
  space0: 4,
  space1: 8,
  space2: 12,
  space3: 16,
  space4: 20,
  space5: 24,
  space6: 40,
} as const;

export const radii = {
  xs: 3,
  sm: 5,
  md: 8,
  mdAlt: 10,
  lg: 12,
  xl: 18,
  xxl: 20,
  pill: 999,
} as const;

export const fonts = {
  inter: 'Inter_400Regular',
  interThin: 'Inter_100Thin',
  interMedium: 'Inter_500Medium',
  interBold: 'Inter_700Bold',
  aleo: 'Aleo_700Bold',
  aleoRegular: 'Aleo_400Regular',
  ubuntu: 'Ubuntu_400Regular',
  ubuntuBold: 'Ubuntu_700Bold',
} as const;

export const fontAssets = {
  Inter_100Thin: require('@expo-google-fonts/inter/100Thin/Inter_100Thin.ttf'),
  Inter_400Regular: require('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
  Inter_500Medium: require('@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf'),
  Inter_700Bold: require('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf'),
  Aleo_400Regular: require('@expo-google-fonts/aleo/400Regular/Aleo_400Regular.ttf'),
  Aleo_700Bold: require('@expo-google-fonts/aleo/700Bold/Aleo_700Bold.ttf'),
  Ubuntu_400Regular: require('@expo-google-fonts/ubuntu/400Regular/Ubuntu_400Regular.ttf'),
  Ubuntu_700Bold: require('@expo-google-fonts/ubuntu/700Bold/Ubuntu_700Bold.ttf'),
} as const;

export const typography = {
  text25: { fontFamily: fonts.aleo, fontWeight: '700' as const, fontSize: 25, lineHeight: 30 },
  text24: { fontFamily: fonts.aleo, fontWeight: '700' as const, fontSize: 24, lineHeight: 29 },
  text20: { fontFamily: fonts.aleo, fontWeight: '700' as const, fontSize: 20, lineHeight: 25 },
  text16: { fontFamily: fonts.aleo, fontWeight: '700' as const, fontSize: 16, lineHeight: 19 },
  text16Alt: { fontFamily: fonts.inter, fontWeight: '400' as const, fontSize: 16, lineHeight: 19 },
  text14: { fontFamily: fonts.aleo, fontWeight: '700' as const, fontSize: 14, lineHeight: 17 },
  text14Alt: { fontFamily: fonts.inter, fontWeight: '400' as const, fontSize: 14, lineHeight: 18 },
  text12: { fontFamily: fonts.interThin, fontWeight: '100' as const, fontSize: 12, lineHeight: 15, letterSpacing: 2.4 },
  text12Alt: { fontFamily: fonts.inter, fontWeight: '400' as const, fontSize: 12, lineHeight: 14 },
  text10: { fontFamily: fonts.inter, fontWeight: '400' as const, fontSize: 10, lineHeight: 13 },
  text9: { fontFamily: fonts.interThin, fontWeight: '100' as const, fontSize: 9, lineHeight: 11, letterSpacing: 1.8 },
  text7: { fontFamily: fonts.aleo, fontWeight: '700' as const, fontSize: 7, lineHeight: 9 },
} as const;

export const shadows = {
  card: {
    shadowColor: colors.fgStrong,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  header: {
    shadowColor: colors.fgStrong,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  tabBar: {
    shadowColor: '#607193',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
  fab: {
    shadowColor: colors.fgStrong,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 40,
    elevation: 10,
  },
} as const;

export const tabBarHeight = 64;

export const bottomContentPadding = 118;

export const isWeb = Platform.OS === 'web';

export const theme = { colors, colours, spacing, radii, typography, fonts, shadows, tabBarHeight, bottomContentPadding };
export default theme;
