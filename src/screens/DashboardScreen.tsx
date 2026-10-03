import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { useAppData } from '../store/AppDataContext';
import { formatCurrency } from '../lib/format';
import {
  bottomContentPadding,
  colors,
  radii,
  shadows,
  spacing,
  typography,
} from '../theme';

type Props = BottomTabScreenProps<MainTabParamList, 'Dashboard'>;

interface DashboardEntry {
  id: string;
  title: string;
  illustration: ImageSourcePropType;
  illustrationWidth: number;
  illustrationHeight: number;
  target?: keyof MainTabParamList;
  disabled?: boolean;
}

const ENTRIES: DashboardEntry[] = [
  {
    id: 'time',
    title: 'Time Management',
    illustration: require('../../design/figma/assets/illustration-128x114.png'),
    illustrationWidth: 128,
    illustrationHeight: 114,
    target: 'Time',
  },
  {
    id: 'money',
    title: 'Money Management',
    illustration: require('../../design/figma/assets/illustration-118x109.png'),
    illustrationWidth: 118,
    illustrationHeight: 109,
    target: 'Money',
  },
  {
    id: 'app',
    title: 'App Management',
    illustration: require('../../design/figma/assets/illustration-120x133.png'),
    illustrationWidth: 120,
    illustrationHeight: 133,
    disabled: true,
  },
  {
    id: 'food',
    title: 'Food Management',
    illustration: require('../../design/figma/assets/undraw-personal-site-xyd1.png'),
    illustrationWidth: 88,
    illustrationHeight: 130,
    disabled: true,
  },
];

interface DashboardCardProps {
  entry: DashboardEntry;
  onOpen: (entry: DashboardEntry) => void;
}

function DashboardCard({ entry, onOpen }: DashboardCardProps) {
  const body = (
    <>
      <Text style={styles.cardTitle}>{entry.title}</Text>
      <View style={styles.illustrationWrap}>
        <Image
          source={entry.illustration}
          style={{ width: entry.illustrationWidth, height: entry.illustrationHeight }}
          resizeMode="contain"
          accessible={false}
        />
      </View>
      {entry.disabled ? (
        <View style={styles.comingSoonPill}>
          <Text style={styles.comingSoonText}>coming soon</Text>
        </View>
      ) : null}
    </>
  );

  if (entry.disabled) {
    return (
      <Pressable
        testID={`dashboard-card-${entry.id}`}
        accessibilityRole="button"
        accessibilityLabel={`${entry.title} — coming soon`}
        accessibilityState={{ disabled: true }}
        disabled
        style={styles.card}
      >
        {body}
      </Pressable>
    );
  }

  return (
    <Pressable
      testID={`dashboard-card-${entry.id}`}
      accessibilityRole="button"
      accessibilityLabel={`Open ${entry.title}`}
      onPress={() => onOpen(entry)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {body}
    </Pressable>
  );
}

interface MetricCardProps {
  testID: string;
  label: string;
  value: string;
}

function MetricCard({ testID, label, value }: MetricCardProps) {
  return (
    <View
      testID={testID}
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={styles.metricCard}
    >
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export default function DashboardScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { transactions, appointments } = useAppData();
  const [query, setQuery] = useState('');

  const totalSpend = useMemo(
    () =>
      transactions.reduce((sum, transaction) => sum + (Number.isFinite(transaction.amount) ? transaction.amount : 0), 0),
    [transactions],
  );
  const upcomingCount = useMemo(
    () => appointments.filter((appointment) => appointment.status === 'upcoming').length,
    [appointments],
  );
  const totalEntries = transactions.length + appointments.length;

  const entries = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return ENTRIES;
    }
    return ENTRIES.filter((entry) => entry.title.toLowerCase().includes(needle));
  }, [query]);

  const openMenu = () => {
    navigation
      .getParent<NativeStackNavigationProp<RootStackParamList>>()
      ?.navigate('DashboardMenu');
  };

  const openEntry = (entry: DashboardEntry) => {
    if (entry.target) {
      navigation.navigate(entry.target);
    }
  };

  return (
    <View testID="screen-dashboard" style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.space1 }]}>
        <View style={styles.headerRow}>
          <Pressable
            testID="dashboard-menu-button"
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            hitSlop={11}
            onPress={openMenu}
            style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          >
            <Ionicons name="menu" size={18} color={colors.onSurface} />
          </Pressable>
          <Image
            source={require('../../design/figma/assets/noun-user-1335326.png')}
            style={styles.userIcon}
            resizeMode="contain"
            accessible
            accessibilityLabel="Profile"
          />
        </View>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomContentPadding + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchField}>
          <TextInput
            testID="dashboard-search-input"
            accessibilityLabel="Search"
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            placeholderTextColor={colors.mutedInput}
            style={styles.searchInput}
          />
          <Ionicons name="search" size={16} color={colors.fgBody} />
        </View>

        <View style={styles.metrics}>
          <MetricCard
            testID="dashboard-metric-spend"
            label="Total spend"
            value={formatCurrency(totalSpend)}
          />
          <MetricCard
            testID="dashboard-metric-appointments"
            label="Upcoming appointments"
            value={String(upcomingCount)}
          />
          <MetricCard
            testID="dashboard-metric-entries"
            label="Total entries"
            value={String(totalEntries)}
          />
        </View>

        <View style={styles.grid}>
          {entries.map((entry) => (
            <DashboardCard key={entry.id} entry={entry} onOpen={openEntry} />
          ))}
        </View>

        {entries.length === 0 ? (
          <Text style={styles.emptyText}>No results found</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    backgroundColor: colors.accent,
    paddingHorizontal: 18,
    paddingBottom: spacing.space4,
    ...shadows.header,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.space1,
  },
  pressed: {
    opacity: 0.7,
  },
  userIcon: {
    width: 27,
    height: 27,
  },
  headerTitle: {
    ...typography.text24,
    color: colors.onSurface,
    marginTop: spacing.space1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.space6,
  },
  searchField: {
    height: 43,
    marginHorizontal: spacing.space6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.space3,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  searchInput: {
    flex: 1,
    ...typography.text16Alt,
    color: colors.fg,
    paddingVertical: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.space6,
    marginTop: spacing.space6,
  },
  metrics: {
    paddingHorizontal: spacing.space6,
    marginTop: spacing.space6,
    gap: spacing.space3,
  },
  metricCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.space4,
    ...shadows.card,
  },
  metricLabel: {
    ...typography.text12,
    color: colors.fgStrong,
    textTransform: 'uppercase',
  },
  metricValue: {
    ...typography.text25,
    color: colors.fg,
    marginTop: spacing.space0,
  },
  card: {
    width: '48%',
    height: 280,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.space3,
    marginBottom: spacing.space4,
    ...shadows.card,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardTitle: {
    ...typography.text16,
    color: colors.fg,
  },
  illustrationWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonPill: {
    alignSelf: 'center',
    backgroundColor: colors.fg,
    borderRadius: radii.xs,
    paddingHorizontal: spacing.space1,
    paddingVertical: spacing.space0,
  },
  comingSoonText: {
    ...typography.text9,
    color: colors.onSurface,
    textTransform: 'uppercase',
  },
  emptyText: {
    ...typography.text12Alt,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.space4,
  },
});
