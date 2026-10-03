import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Props = BottomTabScreenProps<MainTabParamList, 'Dashboard'>;

export default function DashboardScreen(_props: Props) {
  return (
    <View testID="screen-dashboard" style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    padding: spacing.space4,
  },
  title: {
    ...typography.text24,
    color: colors.fg,
  },
});
