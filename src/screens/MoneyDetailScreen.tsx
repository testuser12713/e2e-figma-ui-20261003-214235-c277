import React, { useContext, useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import AppDataContext from '../store/AppDataContext';
import { transactions as seedTransactions } from '../data/transactions';
import { categories as seedCategories } from '../data/categories';
import { formatCurrency } from '../lib/format';
import { formatBookingDate } from './MoneyScreen';
import { bottomContentPadding, colors, fonts, radii, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MoneyDetail'>;

export default function MoneyDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const context = useContext(AppDataContext);

  const transactions = context?.transactions ?? seedTransactions;
  const categories = context?.categories ?? seedCategories;
  const { transactionId } = route.params;

  const categoryLabels = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((category) => {
      map[category.id] = category.label;
    });
    return map;
  }, [categories]);

  const categoryImages = useMemo(() => {
    const map: Record<string, number> = {};
    categories.forEach((category) => {
      map[category.id] = category.image as number;
    });
    return map;
  }, [categories]);

  const headerTop = Math.max(insets.top, 25);

  return (
    <View testID="screen-money-detail" style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.panel, { paddingTop: headerTop + 30 }]}>
          <View style={styles.headerRow}>
            <Pressable
              testID="money-detail-back"
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={6}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Image
                source={require('../../design/figma/assets/icon-32x32.png')}
                style={styles.backIcon}
              />
            </Pressable>
            <Text style={styles.title}>WEEKLY REPORT</Text>
          </View>

          <Image
            source={require('../../design/figma/assets/illustration-256x218.png')}
            style={styles.chart}
            resizeMode="contain"
          />

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: colors.barExpenses }]} />
              <Text style={styles.legendLabel}>EXPENSES</Text>
            </View>
            <View style={[styles.legendItem, styles.legendItemSpaced]}>
              <View style={[styles.legendSwatch, { backgroundColor: colors.barDeposit }]} />
              <Text style={styles.legendLabel}>DEPOSIT</Text>
            </View>
          </View>
        </View>

        <View style={styles.list}>
          {transactions.map((tx) => (
            <Pressable
              key={tx.id}
              testID={`money-detail-row-${tx.id}`}
              accessibilityRole="button"
              accessibilityLabel={`${tx.title}, ${formatCurrency(tx.amount)}`}
              accessibilityState={{ selected: tx.id === transactionId }}
              onPress={() => navigation.navigate('MoneyDetail', { transactionId: tx.id })}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <Image
                source={categoryImages[tx.categoryId] ?? categoryImages[categories[0]?.id]}
                style={styles.thumb}
              />
              <View style={styles.rowBody}>
                <Text style={styles.rowCategory}>
                  {categoryLabels[tx.categoryId] ?? tx.categoryId}
                </Text>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {tx.title}
                </Text>
                <Text style={styles.rowDate}>{formatBookingDate(tx.date)}</Text>
              </View>
              <Text style={styles.rowAmount}>{formatCurrency(tx.amount)}</Text>
            </Pressable>
          ))}
          {transactions.length === 0 ? (
            <Text style={styles.emptyText}>No bookings yet.</Text>
          ) : null}
        </View>
      </ScrollView>

      <Pressable
        testID="money-detail-fab"
        accessibilityRole="button"
        accessibilityLabel="Add expense"
        onPress={() => navigation.navigate('AddExpense')}
        style={({ pressed }) => [
          styles.fabWrap,
          { bottom: spacing.space2 },
          pressed && styles.fabPressed,
        ]}
      >
        <LinearGradient
          colors={[colors.accent, colors.accentStrong]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.fab}
        >
          <View style={styles.fabPlusVertical} />
          <View style={styles.fabPlusHorizontal} />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgAlt,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: bottomContentPadding,
  },
  panel: {
    height: 407,
    backgroundColor: colors.surface,
    paddingHorizontal: 47,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    marginLeft: -6,
    marginRight: -6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 32,
    height: 32,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.interThin,
    fontWeight: '100',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 2.8,
    color: colors.fgStrong,
    textTransform: 'uppercase',
  },
  chart: {
    alignSelf: 'flex-start',
    width: 256,
    height: 218,
    marginTop: 31,
    marginLeft: 27,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginLeft: 27,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendItemSpaced: {
    marginLeft: 21,
  },
  legendSwatch: {
    width: 13,
    height: 13,
    borderRadius: radii.xs,
  },
  legendLabel: {
    ...typography.text9,
    color: colors.fgStrong,
    textTransform: 'uppercase',
    marginLeft: spacing.space2,
  },
  list: {
    marginTop: 29,
    paddingHorizontal: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 83,
    paddingVertical: 15,
  },
  rowPressed: {
    opacity: 0.6,
  },
  thumb: {
    width: 53,
    height: 53,
    borderRadius: radii.md,
  },
  rowBody: {
    flex: 1,
    marginLeft: 22,
    marginRight: spacing.space2,
  },
  rowCategory: {
    ...typography.text9,
    color: colors.fgStrong,
    textTransform: 'uppercase',
  },
  rowTitle: {
    ...typography.text12,
    letterSpacing: 0,
    color: colors.fgStrong,
  },
  rowDate: {
    ...typography.text9,
    color: colors.fgStrong,
    textTransform: 'uppercase',
  },
  rowAmount: {
    ...typography.text14Alt,
    color: colors.fgStrong,
    textAlign: 'right',
  },
  emptyText: {
    ...typography.text12Alt,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: spacing.space5,
  },
  fabWrap: {
    position: 'absolute',
    left: '50%',
    marginLeft: -32,
    width: 64,
    height: 64,
  },
  fabPressed: {
    transform: [{ scale: 0.96 }],
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: radii.pill,
    borderWidth: 4,
    borderColor: colors.onAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPlusVertical: {
    position: 'absolute',
    width: 3,
    height: 20,
    backgroundColor: colors.onAccent,
  },
  fabPlusHorizontal: {
    position: 'absolute',
    width: 20,
    height: 3,
    backgroundColor: colors.onAccent,
  },
});
