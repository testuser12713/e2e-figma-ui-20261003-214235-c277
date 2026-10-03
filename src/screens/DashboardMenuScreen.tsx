import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DashboardMenu'>;

export default function DashboardMenuScreen(_props: Props) {
  return (
    <View testID="screen-dashboard-menu" style={styles.container}>
      <Text style={styles.title}>Menu</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgTint,
    padding: spacing.space4,
  },
  title: {
    ...typography.text24,
    color: colors.fg,
  },
});
