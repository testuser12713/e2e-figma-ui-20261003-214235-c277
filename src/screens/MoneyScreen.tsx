import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { useAppData } from '../store/AppDataContext';
import { formatCurrency, formatDate } from '../lib/format';
import { bottomContentPadding, colors, fonts, radii, spacing, typography } from '../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Money'>,
  NativeStackScreenProps<RootStackParamList>
>;

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const CATEGORY_ICONS: Record<string, IconName> = {
  home: 'home-outline',
  food: 'silverware-fork-knife',
  travel: 'briefcase-outline',
  shopping: 'shopping-outline',
  movie: 'movie-outline',
  health: 'heart-outline',
};

const FALLBACK_ICON: IconName = 'circle-outline';

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function formatBookingDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) {
    return formatDate(iso);
  }
  const [, year, month, day] = match;
  const weekday = WEEKDAY_NAMES[
    new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))).getUTCDay()
  ];
  return `${day}- ${weekday}`;
}

export default function MoneyScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { profile, transactions, categories } = useAppData();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const visibleTransactions = useMemo(
    () => (activeCategory ? transactions.filter((tx) => tx.categoryId === activeCategory) : transactions),
    [activeCategory, transactions],
  );

  const total = useMemo(
    () => transactions.reduce((sum, tx) => sum + tx.amount, 0),
    [transactions],
  );

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

  const initial = (profile.name.trim()[0] ?? 'R').toUpperCase();
  const headerTop = Math.max(insets.top, 25);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Dashboard');
    }
  };

  return (
    <View testID="screen-money" style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { paddingTop: headerTop }]}>
          <Image
            source={require('../../design/figma/assets/illustration-525x387.png')}
            style={styles.heroArt}
            resizeMode="cover"
          />
          <Pressable
            testID="money-back"
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={12}
            onPress={handleBack}
            style={[styles.backButton, { top: headerTop }]}
          >
            <Image
              source={require('../../design/figma/assets/noun-back-1227057.png')}
              style={styles.backIcon}
            />
          </Pressable>
          <View
            style={[styles.avatar, { top: headerTop + 52 }]}
            accessible
            accessibilityLabel={`${profile.name} profile`}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.heroText}>
            <Text style={styles.eyebrow}>MONTHLY EXPENSES</Text>
            <Text style={styles.total}>{formatCurrency(total)}</Text>
          </View>
        </View>

        <View style={styles.quickCard}>
          <Text style={[styles.eyebrow, styles.quickTitle]}>QUICK CATEGORIES</Text>
          <View style={styles.chipGrid}>
            {categories.map((category) => {
              const selected = activeCategory === category.id;
              return (
                <Pressable
                  key={category.id}
                  testID={`money-chip-${category.id}`}
                  accessibilityRole="button"
                  accessibilityLabel={category.label}
                  accessibilityState={{ selected }}
                  onPress={() =>
                    setActiveCategory((previous) => (previous === category.id ? null : category.id))
                  }
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <MaterialCommunityIcons
                    name={CATEGORY_ICONS[category.id] ?? FALLBACK_ICON}
                    size={34}
                    color={colors.fgStrong}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.list}>
          {visibleTransactions.map((tx) => (
            <Pressable
              key={tx.id}
              testID={`money-row-${tx.id}`}
              accessibilityRole="button"
              accessibilityLabel={`${tx.title}, ${formatCurrency(tx.amount)}`}
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
          {visibleTransactions.length === 0 ? (
            <Text style={styles.emptyText}>No bookings in this category yet.</Text>
          ) : null}
        </View>
      </ScrollView>

      <Pressable
        testID="fab-add-expense"
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
  hero: {
    height: 406,
    backgroundColor: colors.surface,
    paddingHorizontal: 49,
    justifyContent: 'flex-end',
    paddingBottom: 51,
    overflow: 'hidden',
  },
  heroArt: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 22,
    top: 25,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    width: 11,
    height: 18,
  },
  avatar: {
    position: 'absolute',
    right: 67,
    top: 77,
    width: 51,
    height: 51,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.fgStrong,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarText: {
    ...typography.text20,
    fontSize: 32,
    lineHeight: 41,
    color: colors.onAccent,
  },
  heroText: {
    alignItems: 'flex-start',
  },
  eyebrow: {
    ...typography.text12,
    color: colors.fgStrong,
    textTransform: 'uppercase',
  },
  total: {
    fontFamily: fonts.interMedium,
    fontWeight: '500',
    fontSize: 45,
    lineHeight: 57,
    color: colors.fgStrong,
    textTransform: 'uppercase',
  },
  quickCard: {
    alignSelf: 'center',
    width: 330,
    marginTop: 47,
    borderRadius: radii.xxl,
    backgroundColor: colors.surface,
    paddingTop: 34,
    paddingHorizontal: 24,
    paddingBottom: 52,
  },
  quickTitle: {
    textAlign: 'center',
  },
  chipGrid: {
    marginTop: 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 37,
  },
  chip: {
    width: 55,
    height: 55,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.fgStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    borderStyle: 'solid',
    borderColor: colors.accent,
    backgroundColor: colors.accent15,
  },
  list: {
    marginTop: 24,
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
