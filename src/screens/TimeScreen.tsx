import React, { useContext, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import AppDataContext from '../store/AppDataContext';
import { formatDate } from '../lib/format';
import {
  bottomContentPadding,
  colors,
  fonts,
  radii,
  shadows,
  spacing,
  typography,
} from '../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Time'>,
  NativeStackScreenProps<RootStackParamList>
>;

type TabKey = 'upcoming' | 'past';

const backIcon = require('../../design/figma/assets/noun-back-1227057.png');
const userIcon = require('../../design/figma/assets/noun-user-1335326.png');
const pencilIcon = require('../../design/figma/assets/noun-pencil-2174975.png');
const infoIcon = require('../../design/figma/assets/noun-info-1174604.png');

function ComingSoon() {
  return (
    <View style={styles.comingSoon}>
      <Text style={styles.comingSoonText}>coming soon</Text>
    </View>
  );
}

function formatTime(time: string): string {
  const [rawHours, rawMinutes] = time.split(':');
  const hours = Number(rawHours);
  const minutes = Number(rawMinutes);
  const safeHours = Number.isFinite(hours) ? hours : 0;
  const safeMinutes = Number.isFinite(minutes) ? minutes : 0;
  const suffix = safeHours >= 12 ? 'PM' : 'AM';
  const hour12 = safeHours % 12 === 0 ? 12 : safeHours % 12;
  return `${hour12}${safeMinutes ? `:${String(safeMinutes).padStart(2, '0')}` : ''} ${suffix}`;
}

export default function TimeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const context = useContext(AppDataContext);
  const appointments = context?.appointments ?? [];
  const categories = context?.categories ?? [];
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<TabKey>('upcoming');

  const canGoBack = navigation.canGoBack();

  const visibleAppointments = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return appointments
      .filter((appointment) => appointment.status === tab)
      .filter((appointment) =>
        needle === '' ? true : appointment.title.toLowerCase().includes(needle),
      )
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  }, [appointments, query, tab]);

  const openAppointment = (appointmentId: string) => {
    navigation.navigate('TimeDetail', { appointmentId });
  };

  const openAddAppointment = () => {
    navigation.navigate('AddAppointment');
  };

  const categoryLabel = (categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.label ?? '';

  return (
    <View testID="screen-time" style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top, paddingBottom: bottomContentPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable
            testID="time-header-back"
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityState={{ disabled: !canGoBack }}
            disabled={!canGoBack}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
            style={[styles.headerControl, !canGoBack && styles.headerControlDisabled]}
            hitSlop={styles.hitSlop}
          >
            <Image source={backIcon} style={styles.backIcon} />
          </Pressable>
          <Pressable
            testID="time-header-user"
            accessibilityRole="button"
            accessibilityLabel="Profile, coming soon"
            accessibilityState={{ disabled: true }}
            disabled
            style={[styles.headerControl, styles.headerControlDisabled]}
            hitSlop={styles.hitSlop}
          >
            <Image source={userIcon} style={styles.userIcon} />
          </Pressable>
        </View>
        <View style={styles.headerNote}>
          <ComingSoon />
        </View>

        <Text style={styles.screenTitle}>My Appointments</Text>

        <View style={styles.searchField}>
          <TextInput
            testID="time-search-input"
            accessibilityLabel="Search appointments"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            placeholderTextColor={`${colors.fgBody}33`}
            returnKeyType="search"
          />
          <Ionicons name="search" size={16} color={colors.fgBody} />
        </View>

        <View style={styles.tabsRow}>
          <Pressable
            testID="time-tab-upcoming"
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === 'upcoming' }}
            onPress={() => setTab('upcoming')}
            style={styles.tabItem}
          >
            <Text style={[styles.tabText, tab === 'upcoming' ? styles.tabActive : styles.tabInactive]}>
              Upcoming
            </Text>
            <View style={[styles.tabUnderline, tab !== 'upcoming' && styles.tabUnderlineHidden]} />
          </Pressable>
          <Pressable
            testID="time-tab-past"
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === 'past' }}
            onPress={() => setTab('past')}
            style={styles.tabItem}
          >
            <Text style={[styles.tabText, tab === 'past' ? styles.tabActive : styles.tabInactive]}>
              Past
            </Text>
            <View style={[styles.tabUnderline, tab !== 'past' && styles.tabUnderlineHidden]} />
          </Pressable>
        </View>
        <View style={styles.tabsRule} />

        {visibleAppointments.length === 0 ? (
          <View style={styles.emptyBlock}>
            <Text style={styles.emptyText}>No appointments found.</Text>
          </View>
        ) : (
          visibleAppointments.map((appointment) => (
            <Pressable
              key={appointment.id}
              testID={`time-row-${appointment.id}`}
              accessibilityRole="button"
              accessibilityLabel={`${appointment.title}, ${formatDate(appointment.date)}`}
              onPress={() => openAppointment(appointment.id)}
              style={styles.row}
            >
              <View style={styles.rowMain}>
                <Text style={styles.rowDate}>{formatDate(appointment.date)}</Text>
                <View style={styles.rowTitleLine}>
                  <Text style={styles.rowTitle}>{appointment.title}</Text>
                  <Image source={infoIcon} style={styles.rowInfoIcon} />
                </View>
                <Text style={styles.rowMeta}>
                  {categoryLabel(appointment.categoryId)}
                  {categoryLabel(appointment.categoryId) ? ' · ' : ''}
                  {formatTime(appointment.time)}
                </Text>
              </View>
              <View style={styles.rowSide}>
                <Pressable
                  testID={`time-modify-${appointment.id}`}
                  accessibilityRole="button"
                  accessibilityLabel="Modify, coming soon"
                  accessibilityState={{ disabled: true }}
                  disabled
                  style={styles.modify}
                >
                  <Image source={pencilIcon} style={styles.pencilIcon} />
                  <Text style={styles.modifyText}>Modify</Text>
                </Pressable>
                <ComingSoon />
              </View>
            </Pressable>
          ))
        )}

        <Pressable
          testID="time-add-appointment"
          accessibilityRole="button"
          accessibilityLabel="Add a new appointment"
          onPress={openAddAppointment}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryLabel}>Add a new appointment</Text>
        </Pressable>

        <Pressable
          testID="time-overview"
          accessibilityRole="button"
          accessibilityLabel="Overview, coming soon"
          accessibilityState={{ disabled: true }}
          disabled
          style={styles.secondaryButton}
        >
          <Text style={styles.primaryLabel}>Overview</Text>
        </Pressable>
        <View style={styles.overviewNote}>
          <ComingSoon />
        </View>
      </ScrollView>

      <View pointerEvents="box-none" style={styles.fabWrap}>
        <Pressable
          testID="time-fab-add"
          accessibilityRole="button"
          accessibilityLabel="Add appointment"
          onPress={openAddAppointment}
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        >
          <LinearGradient
            colors={[colors.accent, colors.accentStrong]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.fabGradient}
          >
            <View style={styles.plus}>
              <View style={styles.plusVertical} />
              <View style={styles.plusHorizontal} />
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 39,
  },
  headerRow: {
    height: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerControl: {
    width: 27,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerControlDisabled: {
    opacity: 0.35,
  },
  hitSlop: { top: 11, bottom: 11, left: 11, right: 11 },
  backIcon: {
    width: 11,
    height: 18,
    resizeMode: 'contain',
  },
  userIcon: {
    width: 27,
    height: 27,
    resizeMode: 'contain',
  },
  headerNote: {
    alignItems: 'flex-end',
    marginTop: spacing.space0,
  },
  screenTitle: {
    ...typography.text16,
    color: colors.fgBody,
    marginTop: spacing.space5 + spacing.space0,
  },
  searchField: {
    height: 43,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.space3,
    marginTop: spacing.space3 + 1,
    ...shadows.card,
  },
  searchInput: {
    flex: 1,
    ...typography.text16Alt,
    color: colors.fg,
    padding: 0,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.space6,
  },
  tabItem: {
    paddingBottom: 0,
  },
  tabText: {
    ...typography.text16,
  },
  tabActive: {
    color: colors.fg,
    fontFamily: fonts.aleo,
  },
  tabInactive: {
    color: colors.fgBody,
    ...typography.text16Alt,
  },
  tabUnderline: {
    height: 2,
    width: 51,
    backgroundColor: colors.fg,
    marginTop: spacing.space3,
  },
  tabUnderlineHidden: {
    backgroundColor: 'transparent',
  },
  tabsRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderSoft,
    opacity: 0.2,
  },
  emptyBlock: {
    paddingVertical: spacing.space5,
  },
  emptyText: {
    ...typography.text12Alt,
    color: colors.muted,
  },
  row: {
    minHeight: 57,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.space1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${colors.borderSoft}33`,
  },
  rowMain: {
    flex: 1,
    paddingRight: spacing.space1,
  },
  rowDate: {
    fontFamily: fonts.inter,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 22,
    color: colors.fgBody,
    opacity: 0.4,
  },
  rowTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowTitle: {
    ...typography.text14,
    color: colors.fgBody,
  },
  rowMeta: {
    ...typography.text12Alt,
    color: colors.fgBody,
    opacity: 0.4,
    marginTop: 2,
  },
  rowInfoIcon: {
    width: 12,
    height: 12,
    marginLeft: spacing.space0,
    resizeMode: 'contain',
  },
  rowSide: {
    alignItems: 'flex-end',
  },
  modify: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.4,
  },
  pencilIcon: {
    width: 12,
    height: 12,
    marginRight: spacing.space0,
    resizeMode: 'contain',
  },
  modifyText: {
    ...typography.text14,
    color: colors.fg,
  },
  comingSoon: {
    marginTop: spacing.space0,
    paddingHorizontal: spacing.space0 + 2,
    paddingVertical: 2,
    borderRadius: radii.xs,
    backgroundColor: colors.fg,
  },
  comingSoonText: {
    color: colors.onAccent,
    fontFamily: fonts.interThin,
    fontWeight: '100',
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  primaryButton: {
    height: 43,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.space6,
    ...shadows.card,
  },
  primaryLabel: {
    ...typography.text16Alt,
    color: colors.onAccent,
  },
  secondaryButton: {
    height: 43,
    borderRadius: radii.md,
    backgroundColor: colors.accent85,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.space5,
    opacity: 0.4,
    ...shadows.card,
  },
  overviewNote: {
    alignItems: 'flex-end',
    marginTop: spacing.space1,
  },
  fabWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing.space3,
    alignItems: 'center',
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: radii.pill,
    ...shadows.fab,
  },
  fabPressed: {
    transform: [{ scale: 0.96 }],
  },
  fabGradient: {
    flex: 1,
    borderRadius: radii.pill,
    borderWidth: 4,
    borderColor: colors.onSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusVertical: {
    position: 'absolute',
    width: 3,
    height: 20,
    borderRadius: 2,
    backgroundColor: colors.onAccent,
  },
  plusHorizontal: {
    position: 'absolute',
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.onAccent,
  },
});
