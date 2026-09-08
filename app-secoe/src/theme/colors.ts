export const colors = {
  navy: '#1B2A47',
  navyDark: '#111C33',
  teal: '#0E7C6B',
  tealLight: '#12A98F',
  lime: '#C7DB2E',
  red: '#E53935',
  redLight: '#FBD9D7',
  orange: '#F2994A',
  background: '#F4F5F7',
  surface: '#FFFFFF',
  surfaceMuted: '#E7E9EC',
  border: '#D9DCE1',
  text: '#1B2A47',
  textMuted: '#7A8194',
  textInverse: '#FFFFFF',
  placeholder: '#9AA1B2',
  success: '#0E7C6B',
  danger: '#E53935',
  disabled: '#C4C8D0',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 20, fontWeight: '700' as const, color: colors.navy },
  subtitle: { fontSize: 16, fontWeight: '600' as const, color: colors.navy },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.text },
  label: { fontSize: 14, fontWeight: '400' as const, color: colors.textMuted },
  small: { fontSize: 12, fontWeight: '400' as const, color: colors.textMuted },
};
