import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Props = BottomTabScreenProps<MainTabParamList, 'Money'>;

export default function MoneyScreen(_props: Props) {
  return (
    <View testID="screen-money" style={styles.container}>
      <Text style={styles.title}>Money Management</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgAlt,
    padding: spacing.space4,
  },
  title: {
    ...typography.text24,
    color: colors.fg,
  },
});
