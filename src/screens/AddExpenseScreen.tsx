import React, { useContext, useState } from 'react';
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
import { colors, fonts, radii, shadows, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AddExpense'>;

const backButtonIcon = require('../../design/figma/assets/icon-32x32.png');
const calendarIcon = require('../../design/figma/assets/icon-15x16.png');

const DEFAULT_CATEGORY_ID = 'home';

type FieldKey = 'name' | 'amount' | 'date';

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function normalizeDate(raw: string): string | null {
  const value = raw.trim();
  if (!value) {
    return null;
  }
  let year: number;
  let month: number;
  let day: number;
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value);
  const european = /^(\d{1,2})[./](\d{1,2})[./](\d{4})$/.exec(value);
  if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
  } else if (european) {
    day = Number(european[1]);
    month = Number(european[2]);
    year = Number(european[3]);
  } else {
    return null;
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return `${year}-${pad(month)}-${pad(day)}`;
}

function parseAmount(raw: string): number | null {
  const value = Number(raw.replace(',', '.').trim());
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return value;
}

interface FieldProps {
  testID: string;
  accessibilityLabel: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  placeholder: string;
  icon: React.ReactNode;
  keyboardType?: 'default' | 'numeric';
  error?: string;
}

function Field({
  testID,
  accessibilityLabel,
  value,
  onChangeText,
  onBlur,
  placeholder,
  icon,
  keyboardType = 'default',
  error,
}: FieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <View
        style={[styles.field, focused && styles.fieldFocused, error ? styles.fieldError : null]}
      >
        <View style={styles.fieldIcon}>{icon}</View>
        <TextInput
          testID={testID}
          accessibilityLabel={accessibilityLabel}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.fgBody}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {error ? <Text style={styles.fieldErrorText}>{error}</Text> : null}
    </View>
  );
}

export default function AddExpenseScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const context = useContext(AppDataContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    name: false,
    amount: false,
    date: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const markTouched = (field: FieldKey) => {
    setTouched((previous) => ({ ...previous, [field]: true }));
  };

  const errors: Partial<Record<FieldKey, string>> = {};
  if (!name.trim()) {
    errors.name = 'Please enter a name.';
  }
  if (!amount.trim()) {
    errors.amount = 'Please enter an amount.';
  } else if (parseAmount(amount) === null) {
    errors.amount = 'Please enter a valid amount.';
  }
  if (!date.trim()) {
    errors.date = 'Please select a date.';
  } else if (normalizeDate(date) === null) {
    errors.date = 'Please enter a valid date (YYYY-MM-DD).';
  }

  const visibleError = (field: FieldKey): string | undefined => {
    if (submitted || touched[field]) {
      return errors[field];
    }
    return undefined;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const normalizedDate = normalizeDate(date);
    const parsedAmount = parseAmount(amount);
    if (!name.trim() || parsedAmount === null || normalizedDate === null) {
      return;
    }
    const categoryId = context?.categories[0]?.id ?? DEFAULT_CATEGORY_ID;
    context?.addTransaction({
      title: name.trim(),
      categoryId,
      date: normalizedDate,
      amount: parsedAmount,
    });
    navigation.goBack();
  };

  return (
    <View testID="screen-add-expense" style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + 30 }]}>
          <Pressable
            testID="add-expense-close"
            accessibilityRole="button"
            accessibilityLabel="Close without saving"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={styles.hitSlop}
          >
            <Image source={backButtonIcon} style={styles.backIcon} />
          </Pressable>
          <Text style={styles.eyebrow}>ADD EXPENSE</Text>
        </View>

        <View style={styles.body}>
          <Field
            testID="add-expense-name"
            accessibilityLabel="Expense name"
            placeholder="Name"
            icon={<Ionicons name="search" size={16} color={colors.fg} />}
            value={name}
            onChangeText={setName}
            onBlur={() => markTouched('name')}
            error={visibleError('name')}
          />
          <Field
            testID="add-expense-description"
            accessibilityLabel="Expense description"
            placeholder="Beschreibung"
            icon={<Ionicons name="location-outline" size={16} color={colors.fg} />}
            value={description}
            onChangeText={setDescription}
            onBlur={() => undefined}
          />
          <Field
            testID="add-expense-amount"
            accessibilityLabel="Expense amount"
            placeholder="Amount"
            icon={<Ionicons name="location-outline" size={16} color={colors.fg} />}
            value={amount}
            onChangeText={setAmount}
            onBlur={() => markTouched('amount')}
            keyboardType="numeric"
            error={visibleError('amount')}
          />
          <Field
            testID="add-expense-date"
            accessibilityLabel="Expense date"
            placeholder="Select Date"
            icon={<Image source={calendarIcon} style={styles.calendarIcon} />}
            value={date}
            onChangeText={setDate}
            onBlur={() => markTouched('date')}
            error={visibleError('date')}
          />

          <Pressable
            testID="add-expense-submit"
            accessibilityRole="button"
            accessibilityLabel="Add Expense"
            onPress={handleSubmit}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          >
            <Text style={styles.primaryLabel}>Add Expense</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgAlt,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.space6,
  },
  header: {
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 47,
    paddingRight: spacing.space6,
    paddingBottom: 44,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hitSlop: { top: 6, bottom: 6, left: 6, right: 6 },
  backIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  eyebrow: {
    marginLeft: 50,
    fontFamily: fonts.interThin,
    fontWeight: '100',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 2.8,
    color: colors.fgStrong,
    textTransform: 'uppercase',
  },
  body: {
    paddingHorizontal: 40,
    marginTop: 38,
    gap: spacing.space4,
  },
  field: {
    height: 43,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    ...shadows.card,
  },
  fieldFocused: {
    borderWidth: 1,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.16,
  },
  fieldError: {
    borderWidth: 1,
    borderColor: colors.fgStrong,
  },
  fieldIcon: {
    width: 22,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  calendarIcon: {
    width: 15,
    height: 16,
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    ...typography.text16Alt,
    color: colors.fg,
    padding: 0,
  },
  fieldErrorText: {
    ...typography.text12Alt,
    color: colors.fg,
    marginTop: spacing.space0,
  },
  primaryButton: {
    height: 43,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 9,
    ...shadows.card,
  },
  primaryButtonPressed: {
    backgroundColor: colors.accentStrong,
  },
  primaryLabel: {
    ...typography.text16Alt,
    color: colors.onAccent,
  },
});
