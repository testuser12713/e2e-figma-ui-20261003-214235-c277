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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import AppDataContext from '../store/AppDataContext';
import { categories as seedCategories } from '../data/categories';
import type { NewAppointment } from '../data/types';
import { formatDate } from '../lib/format';
import { colors, fonts, radii, shadows, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AddAppointment'>;

const quickAddImage = require('../../design/figma/assets/image-69x69.png');
const calendarIcon = require('../../design/figma/assets/icon-15x16.png');
const collapseIcon = require('../../design/figma/assets/icon-10x6.png');

const MONTH_NAMES = [
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

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface CalendarDay {
  iso: string;
  day: number;
  inMonth: boolean;
}

interface QuickAddPreset {
  id: string;
  title: string;
  subtitle: string;
  categoryId: string;
}

const QUICK_ADD_PRESETS: QuickAddPreset[] = [
  { id: 'gym', title: 'Gym', subtitle: 'Customize Plan', categoryId: 'home' },
  { id: 'work', title: 'Work', subtitle: 'Normal Day', categoryId: 'home' },
  { id: 'birthday', title: 'Birthday', subtitle: 'Friend', categoryId: 'food' },
  { id: 'doctor', title: 'Dr. Jeff Smiths', subtitle: 'Dermatologist', categoryId: 'health' },
];

function toIsoDate(date: Date): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildMonthDays(year: number, month: number): CalendarDay[] {
  const firstOfMonth = new Date(year, month, 1);
  const start = new Date(year, month, 1 - firstOfMonth.getDay());
  const days: CalendarDay[] = [];
  for (let index = 0; index < 42; index += 1) {
    const current = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
    days.push({
      iso: toIsoDate(current),
      day: current.getDate(),
      inMonth: current.getMonth() === month,
    });
  }
  return days;
}

function ComingSoon() {
  return (
    <View style={styles.comingSoon}>
      <Text style={styles.comingSoonText}>coming soon</Text>
    </View>
  );
}

export default function AddAppointmentScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const context = useContext(AppDataContext);

  const categories = context?.categories ?? seedCategories;
  const addAppointment = context?.addAppointment;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<'name' | 'description' | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  const monthDays = useMemo(
    () => buildMonthDays(visibleMonth.year, visibleMonth.month),
    [visibleMonth],
  );

  const shiftMonth = (delta: number) => {
    setVisibleMonth((current) => {
      const next = current.month + delta;
      if (next < 0) {
        return { year: current.year - 1, month: 11 };
      }
      if (next > 11) {
        return { year: current.year + 1, month: 0 };
      }
      return { year: current.year, month: next };
    });
  };

  const pickPreset = (preset: QuickAddPreset) => {
    setTitle(preset.title);
    setSelectedPresetId(preset.id);
    setError(null);
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle === '') {
      setError('Please enter a name for the appointment.');
      return;
    }

    const preset = QUICK_ADD_PRESETS.find((item) => item.id === selectedPresetId);
    const input: NewAppointment = {
      title: trimmedTitle,
      categoryId: preset?.categoryId ?? categories[0]?.id ?? 'home',
      date: selectedDate ?? toIsoDate(new Date()),
      time: '09:00',
      durationMin: 60,
    };

    if (addAppointment) {
      addAppointment(input);
    }
    navigation.goBack();
  };

  const openPicker = () => {
    setVisibleMonth(() => {
      if (selectedDate) {
        const parsed = new Date(`${selectedDate}T00:00:00`);
        if (!Number.isNaN(parsed.getTime())) {
          return { year: parsed.getFullYear(), month: parsed.getMonth() };
        }
      }
      const today = new Date();
      return { year: today.getFullYear(), month: today.getMonth() };
    });
    setPickerOpen(true);
  };

  const selectDay = (day: CalendarDay) => {
    setSelectedDate(day.iso);
    setPickerOpen(false);
  };

  return (
    <View testID="screen-add-appointment" style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.headerTop}>
          <Pressable
            testID="add-appointment-menu"
            accessibilityRole="button"
            accessibilityLabel="Menu"
            hitSlop={styles.hitSlop}
            onPress={() => navigation.navigate('DashboardMenu')}
            style={[styles.headerControl, styles.headerControlLeft]}
          >
            <View style={styles.menuIcon}>
              <View style={styles.menuBar} />
              <View style={styles.menuBar} />
              <View style={styles.menuBar} />
            </View>
          </Pressable>
          <Pressable
            testID="add-appointment-cancel"
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={styles.hitSlop}
            onPress={() => navigation.goBack()}
            style={[styles.headerControl, styles.headerControlRight]}
          >
            <Image source={collapseIcon} style={styles.collapseIcon} />
          </Pressable>
        </View>
        <Text style={styles.headerTitle}>Add an appointment</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.field, focusedField === 'name' && styles.fieldFocused]}>
          <View style={styles.fieldIcon}>
            <Ionicons name="search" size={16} color={colors.fg} />
          </View>
          <TextInput
            testID="add-appointment-name"
            accessibilityLabel="Appointment name"
            style={styles.fieldInput}
            value={title}
            onChangeText={(value) => {
              setTitle(value);
              if (error) {
                setError(null);
              }
            }}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            placeholder="Name"
            placeholderTextColor={colors.fgBody}
            returnKeyType="next"
          />
        </View>
        {error ? (
          <Text testID="add-appointment-error" style={styles.errorText}>
            {error}
          </Text>
        ) : null}

        <View
          style={[
            styles.field,
            styles.fieldSpaced,
            focusedField === 'description' && styles.fieldFocused,
          ]}
        >
          <View style={styles.fieldIcon}>
            <Ionicons name="location-outline" size={18} color={colors.fg} />
          </View>
          <TextInput
            testID="add-appointment-description"
            accessibilityLabel="Appointment description"
            style={styles.fieldInput}
            value={description}
            onChangeText={setDescription}
            onFocus={() => setFocusedField('description')}
            onBlur={() => setFocusedField(null)}
            placeholder="Beschreibung"
            placeholderTextColor={colors.fgBody}
          />
        </View>

        <Pressable
          testID="add-appointment-date"
          accessibilityRole="button"
          accessibilityLabel="Select Date"
          onPress={openPicker}
          style={[styles.field, styles.fieldSpaced]}
        >
          <View style={styles.fieldIcon}>
            <Image source={calendarIcon} style={styles.calendarIcon} />
          </View>
          <Text style={[styles.fieldInput, !selectedDate && styles.fieldPlaceholder]}>
            {selectedDate ? formatDate(selectedDate) : 'Select Date'}
          </Text>
        </Pressable>

        <Pressable
          testID="add-appointment-submit"
          accessibilityRole="button"
          accessibilityLabel="Add Appointment"
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
        >
          <Text style={styles.primaryLabel}>Add Appointment</Text>
        </Pressable>

        <View style={styles.quickAddsHeader}>
          <Text style={styles.quickAddsTitle}>Quick Adds</Text>
          <View style={styles.quickAddsFilter}>
            <Pressable
              testID="add-appointment-filter"
              accessibilityRole="button"
              accessibilityLabel="Filter suggestions, coming soon"
              accessibilityState={{ disabled: true }}
              disabled
              style={styles.filterButton}
            >
              <Ionicons name="filter-outline" size={22} color={colors.fg} />
            </Pressable>
            <ComingSoon />
          </View>
        </View>

        {QUICK_ADD_PRESETS.map((preset) => (
          <View key={preset.id} style={styles.row}>
            <Pressable
              testID={`add-appointment-quickadd-${preset.id}`}
              accessibilityRole="button"
              accessibilityLabel={`Use ${preset.title} preset`}
              onPress={() => pickPreset(preset)}
              style={styles.rowMain}
            >
              <Image source={quickAddImage} style={styles.rowImage} />
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle}>{preset.title}</Text>
                <Text style={styles.rowSubtitle}>{preset.subtitle}</Text>
              </View>
            </Pressable>
            <View style={styles.rowSide}>
              <Pressable
                testID={`add-appointment-quickadd-menu-${preset.id}`}
                accessibilityRole="button"
                accessibilityLabel="More options, coming soon"
                accessibilityState={{ disabled: true }}
                disabled
                style={styles.dotsButton}
              >
                <View style={styles.dotsColumn}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
              </Pressable>
              <ComingSoon />
            </View>
          </View>
        ))}
      </ScrollView>

      {pickerOpen ? (
        <View style={styles.pickerOverlay}>
          <Pressable
            testID="add-appointment-date-backdrop"
            accessibilityRole="button"
            accessibilityLabel="Dismiss date picker"
            onPress={() => setPickerOpen(false)}
            style={styles.pickerBackdrop}
          />
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Pressable
                testID="add-appointment-date-prev"
                accessibilityRole="button"
                accessibilityLabel="Previous month"
                hitSlop={styles.hitSlop}
                onPress={() => shiftMonth(-1)}
                style={styles.pickerNav}
              >
                <Ionicons name="chevron-back" size={18} color={colors.fg} />
              </Pressable>
              <Text style={styles.pickerMonth}>
                {MONTH_NAMES[visibleMonth.month]} {visibleMonth.year}
              </Text>
              <Pressable
                testID="add-appointment-date-next"
                accessibilityRole="button"
                accessibilityLabel="Next month"
                hitSlop={styles.hitSlop}
                onPress={() => shiftMonth(1)}
                style={styles.pickerNav}
              >
                <Ionicons name="chevron-forward" size={18} color={colors.fg} />
              </Pressable>
            </View>
            <View style={styles.pickerWeekdays}>
              {WEEKDAY_LABELS.map((label, index) => (
                <View key={`${label}-${index}`} style={styles.pickerCell}>
                  <Text style={styles.pickerWeekday}>{label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.pickerGrid}>
              {monthDays.map((day) => {
                const selected = day.iso === selectedDate;
                return (
                  <Pressable
                    key={day.iso}
                    testID={`add-appointment-date-day-${day.iso}`}
                    accessibilityRole="button"
                    accessibilityLabel={formatDate(day.iso)}
                    accessibilityState={{ selected }}
                    onPress={() => selectDay(day)}
                    style={styles.pickerCell}
                  >
                    <View style={[styles.pickerDay, selected && styles.pickerDaySelected]}>
                      <Text
                        style={[
                          styles.pickerDayText,
                          !day.inMonth && styles.pickerDayTextMuted,
                          selected && styles.pickerDayTextSelected,
                        ]}
                      >
                        {day.day}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    paddingBottom: 20,
    ...shadows.header,
  },
  headerTop: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerControl: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerControlLeft: {
    alignItems: 'flex-start',
  },
  headerControlRight: {
    alignItems: 'flex-end',
  },
  hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
  menuIcon: {
    width: 18,
    height: 15,
    justifyContent: 'space-between',
  },
  menuBar: {
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.navInk,
  },
  collapseIcon: {
    width: 14,
    height: 8,
    resizeMode: 'contain',
  },
  headerTitle: {
    ...typography.text24,
    color: colors.fg,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 40,
    paddingTop: 23,
    paddingBottom: 40,
  },
  field: {
    height: 43,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    ...shadows.card,
  },
  fieldSpaced: {
    marginTop: 20,
  },
  fieldFocused: {
    borderWidth: 1,
    borderColor: colors.accent,
  },
  fieldIcon: {
    width: 18,
    alignItems: 'center',
    marginRight: 4,
  },
  calendarIcon: {
    width: 15,
    height: 16,
    resizeMode: 'contain',
  },
  fieldInput: {
    flex: 1,
    ...typography.text16Alt,
    color: colors.fg,
    padding: 0,
  },
  fieldPlaceholder: {
    color: colors.fgBody,
  },
  errorText: {
    ...typography.text12Alt,
    color: colors.fgStrong,
    marginTop: 6,
  },
  primaryButton: {
    height: 43,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    ...shadows.card,
  },
  primaryButtonPressed: {
    backgroundColor: '#5BB56B',
  },
  primaryLabel: {
    ...typography.text16Alt,
    color: colors.onAccent,
  },
  quickAddsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 35,
    marginBottom: 16,
  },
  quickAddsTitle: {
    ...typography.text16Alt,
    color: colors.fgBody,
  },
  quickAddsFilter: {
    alignItems: 'flex-end',
  },
  filterButton: {
    width: 25,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoon: {
    marginTop: 2,
    paddingHorizontal: 6,
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
  row: {
    minHeight: 90,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${colors.borderSoft}33`,
  },
  rowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rowImage: {
    width: 69,
    height: 69,
    borderRadius: radii.md,
  },
  rowBody: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  rowTitle: {
    ...typography.text14,
    color: colors.fgBody,
  },
  rowSubtitle: {
    ...typography.text12Alt,
    color: colors.fgBody,
    opacity: 0.4,
    marginTop: 2,
  },
  rowSide: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dotsButton: {
    width: 44,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsColumn: {
    height: 14,
    justifyContent: 'space-between',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.fg,
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  pickerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `${colors.fgStrong}59`,
  },
  pickerCard: {
    width: 320,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 20,
    ...shadows.card,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pickerNav: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerMonth: {
    ...typography.text16,
    color: colors.fg,
  },
  pickerWeekdays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  pickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pickerCell: {
    width: `${100 / 7}%`,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerWeekday: {
    fontFamily: fonts.ubuntu,
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    color: colors.fgStrong,
  },
  pickerDay: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerDaySelected: {
    backgroundColor: colors.accent,
  },
  pickerDayText: {
    fontFamily: fonts.ubuntu,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    color: colors.fgStrong,
  },
  pickerDayTextMuted: {
    color: colors.muted,
  },
  pickerDayTextSelected: {
    color: colors.onAccent,
  },
});
