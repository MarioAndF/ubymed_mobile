import {
  Text as DefaultText,
  useColorScheme,
  View as DefaultView,
  FlatList as DefaultFlatList,
  ActivityIndicator as DefaultActivityIndicator,
  SectionList as DefaultSectionList
} from 'react-native';

import Colors from '../constants/Colors';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type FlatListProps<T> = ThemeProps & DefaultFlatList<T>['props'];
export type SectionListProps<T> = ThemeProps & DefaultSectionList<T>['props'];
export type ActivityIndicatorProps = ThemeProps & DefaultActivityIndicator['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function FlatList<T>(props: FlatListProps<T>) {
  const { lightColor, darkColor, style, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultFlatList<T> style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function SectionList<T>(props: SectionListProps<T>) {
  const { lightColor, darkColor, style, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultSectionList<T> style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function ActivityIndicator(props: ActivityIndicatorProps) {
  const { lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultActivityIndicator color={color} {...otherProps} />;
}