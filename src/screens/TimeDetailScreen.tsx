import React, { useContext, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { Appointment, Category } from '../data/types';
import AppDataContext from '../store/AppDataContext';
import { bottomContentPadding, colors, fonts, radii, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TimeDetail'>;

const backIcon = require('../../design/figma/assets/noun-back-1227057.png');
const chevronLeft = require('../../design/figma/assets/icon-8x14-2.png');
const chevronRight = require('../../design/figma/assets/icon-8x14.png');
const chevronDown = require('../../design/figma/assets/icon-10x6.png');

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function parseIso(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) {
    return null;
  }
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function toIso(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + amount);
  return next;
}

function startOfWeek(date: Date): Date {
  return addDays(date, -date.getDay());
}

function dayLabel(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function rangeLabel(start: Date, end: Date): string {
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()}-${end.getDate()} ${MONTHS[start.getMonth()]} ${start.getFullYear()}`;
  }
  return `${start.getDate()} ${MONTHS[start.getMonth()]} - ${end.getDate()} ${MONTHS[end.getMonth()]} ${end.getFullYear()}`;
}

function parseTime(time: string): { hours: number; minutes: number } {
  const [rawHours, rawMinutes] = time.split(':');
  const hours = Number(rawHours);
  const minutes = Number(rawMinutes);
  return {
    hours: Number.isFinite(hours) ? hours : 0,
    minutes: Number.isFinite(minutes) ? minutes : 0,
  };
}

function hourLabel(time: string): string {
  const { hours } = parseTime(time);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12} ${suffix}`;
}

function clockLabel(totalMinutes: number): string {
  const hour = Math.floor(totalMinutes / 60) % 24;
  const minute = totalMinutes % 60;
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}${minute ? `:${pad(minute)}` : ''}${suffix}`;
}

function rangeLabelFor(time: string, durationMin: number): string {
  const { hours, minutes } = parseTime(time);
  const start = hours * 60 + minutes;
  const duration = Number.isFinite(durationMin) && durationMin > 0 ? durationMin : 0;
  return `${clockLabel(start)} - ${clockLabel(start + duration)}`;
}

export default function TimeDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const context = useContext(AppDataContext);
  const appointments = context?.appointments ?? [];
  const categories = context?.categories ?? [];

  const appointment = useMemo(
    () => appointments.find((item) => item.id === route.params.appointmentId),
    [appointments, route.params.appointmentId],
  );

  const anchor = useMemo(() => {
    const parsed = appointment ? parseIso(appointment.date) : null;
    return parsed ?? new Date();
  }, [appointment]);

  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(anchor));
  const [selectedIso, setSelectedIso] = useState<string>(() => toIso(anchor));
  const [expanded, setExpanded] = useState(true);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
    [weekStart],
  );

  const selectedDate = useMemo(() => parseIso(selectedIso) ?? anchor, [selectedIso, anchor]);

  const dayAppointments = useMemo(
    () =>
      appointments
        .filter((item) => item.date === selectedIso)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, selectedIso],
  );

  const categoryOf = (item: Appointment): Category | undefined =>
    categories.find((category) => category.id === item.categoryId);

  const shiftWeek = (amount: number) => {
    setWeekStart((previous) => addDays(previous, amount));
    setSelectedIso((previous) => {
      const date = parseIso(previous);
      return date ? toIso(addDays(date, amount)) : previous;
    });
  };

  const selectDay = (date: Date) => {
    setSelectedIso(toIso(date));
  };

  return (
    <View testID="screen-time-detail" style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + spacing.space1 }]}>
          <Pressable
            testID="time-detail-back"
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={styles.hitSlop}
          >
            <Image source={backIcon} style={styles.backIcon} />
          </Pressable>
          <Text style={styles.detailTitle}>My Appointments</Text>

          <View style={styles.rangeRow}>
            <Pressable
              testID="time-detail-prev-week"
              accessibilityRole="button"
              accessibilityLabel="Previous week"
              onPress={() => shiftWeek(-7)}
              style={styles.weekArrow}
              hitSlop={styles.hitSlop}
            >
              <Image source={chevronLeft} style={styles.chevron} />
            </Pressable>
            <Text style={styles.rangeText}>{rangeLabel(weekDays[0], weekDays[6])}</Text>
            <Pressable
              testID="time-detail-next-week"
              accessibilityRole="button"
              accessibilityLabel="Next week"
              onPress={() => shiftWeek(7)}
              style={styles.weekArrow}
              hitSlop={styles.hitSlop}
            >
              <Image source={chevronRight} style={styles.chevron} />
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {WEEKDAY_LETTERS.map((letter, index) => (
              <View key={`${letter}-${index}`} style={styles.weekCell}>
                <Text style={styles.weekday}>{letter}</Text>
              </View>
            ))}
          </View>

          <View style={styles.weekRow}>
            {weekDays.map((date) => {
              const iso = toIso(date);
              const isSelected = iso === selectedIso;
              return (
                <View key={iso} style={styles.weekCell}>
                  <Pressable
                    testID={`time-detail-day-${iso}`}
                    accessibilityRole="button"
                    accessibilityLabel={dayLabel(date)}
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => selectDay(date)}
                    style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
                  >
                    <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
                      {date.getDate()}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.panel}>
          <Pressable
            testID="time-detail-toggle"
            accessibilityRole="button"
            accessibilityLabel={expanded ? 'Collapse schedule' : 'Expand schedule'}
            onPress={() => setExpanded((previous) => !previous)}
            style={styles.handle}
            hitSlop={styles.hitSlop}
          >
            <Image
              source={chevronDown}
              style={[styles.handleIcon, !expanded && styles.handleIconCollapsed]}
            />
          </Pressable>

          {expanded ? (
            <View style={styles.schedule}>
              <Text style={styles.dayLabel}>{dayLabel(selectedDate)}</Text>
              {dayAppointments.length === 0 ? (
                <Text style={styles.emptyText}>No appointments on this day.</Text>
              ) : (
                dayAppointments.map((item) => {
                  const category = categoryOf(item);
                  return (
                    <View key={item.id} testID={`time-detail-card-${item.id}`} style={styles.cardRow}>
                      <View style={styles.hourColumn}>
                        <Text style={styles.hourLabel}>{hourLabel(item.time)}</Text>
                        <View style={styles.hourLine} />
                      </View>
                      <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        {category ? (
                          <Text style={styles.cardSubtitle}>{category.label}</Text>
                        ) : null}
                        <View style={styles.cardTimeRow}>
                          <Ionicons name="time-outline" size={11} color={colors.fg} />
                          <Text style={styles.cardTime}>
                            {rangeLabelFor(item.time, item.durationMin)}
                          </Text>
                        </View>
                        {category?.image ? (
                          <Image source={category.image} style={styles.cardAvatar} />
                        ) : (
                          <View style={[styles.cardAvatar, styles.cardAvatarFallback]} />
                        )}
                        <View style={styles.cardRule} />
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          ) : null}
        </View>
      </ScrollView>
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
    paddingBottom: bottomContentPadding,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.space6,
    paddingBottom: spacing.space5,
  },
  backButton: {
    width: 27,
    height: 27,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  hitSlop: { top: 11, bottom: 11, left: 11, right: 11 },
  backIcon: {
    width: 11,
    height: 18,
    resizeMode: 'contain',
  },
  detailTitle: {
    fontFamily: fonts.ubuntuBold,
    fontWeight: '700',
    fontSize: 17,
    lineHeight: 20,
    color: colors.fgStrong,
    textAlign: 'center',
    marginTop: spacing.space3,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.space6,
    marginTop: spacing.space6,
  },
  weekArrow: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    width: 8,
    height: 14,
    resizeMode: 'contain',
  },
  rangeText: {
    fontFamily: fonts.ubuntu,
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 15,
    color: colors.fgStrong,
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    marginTop: spacing.space2,
  },
  weekCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekday: {
    fontFamily: fonts.ubuntu,
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.4,
    color: colors.fgStrong,
  },
  dayButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonSelected: {
    backgroundColor: colors.accent,
  },
  dayNumber: {
    fontFamily: fonts.ubuntu,
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.4,
    color: colors.fgStrong,
  },
  dayNumberSelected: {
    color: colors.onAccent,
  },
  panel: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    paddingHorizontal: 34,
    paddingBottom: spacing.space5,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleIcon: {
    width: 12,
    height: 6,
    resizeMode: 'contain',
  },
  handleIconCollapsed: {
    transform: [{ rotate: '180deg' }],
  },
  schedule: {
    marginTop: spacing.space2,
  },
  dayLabel: {
    fontFamily: fonts.ubuntuBold,
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 12,
    letterSpacing: 0.3,
    color: colors.fgStrong,
    opacity: 0.44,
  },
  emptyText: {
    ...typography.text12Alt,
    color: colors.muted,
    marginTop: spacing.space4,
  },
  cardRow: {
    flexDirection: 'row',
    marginTop: spacing.space4,
  },
  hourColumn: {
    width: 60,
    paddingTop: spacing.space0 + 4,
  },
  hourLabel: {
    fontFamily: fonts.aleo,
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 12,
    letterSpacing: 0.3,
    color: colors.fgStrong,
  },
  hourLine: {
    width: 22,
    height: 1,
    marginTop: spacing.space5,
    backgroundColor: colors.border,
    opacity: 0.18,
  },
  card: {
    flex: 1,
    minHeight: 118,
    borderRadius: radii.md,
    backgroundColor: colors.accent64,
    paddingTop: spacing.space3,
    paddingLeft: spacing.space4,
    paddingRight: 76,
    overflow: 'hidden',
  },
  cardTitle: {
    fontFamily: fonts.ubuntuBold,
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 12,
    color: colors.fg,
  },
  cardSubtitle: {
    fontFamily: fonts.ubuntu,
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 12,
    color: colors.fgStrong,
    opacity: 0.42,
    marginTop: spacing.space2,
  },
  cardTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.space1,
  },
  cardTime: {
    fontFamily: fonts.ubuntuBold,
    fontWeight: '700',
    fontSize: 7,
    lineHeight: 10,
    color: colors.fg,
    marginLeft: spacing.space0,
  },
  cardAvatar: {
    position: 'absolute',
    top: spacing.space1,
    right: 15,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.onSurface,
  },
  cardAvatarFallback: {
    backgroundColor: colors.accent,
  },
  cardRule: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: '#C48B30',
    opacity: 0.18,
  },
});
