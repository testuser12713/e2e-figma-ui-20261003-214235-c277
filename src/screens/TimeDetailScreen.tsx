import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TimeDetail'>;

export default function TimeDetailScreen(_props: Props) {
  return (
    <View testID="screen-time-detail" style={styles.container}>
      <Text style={styles.title}>Appointment</Text>
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
