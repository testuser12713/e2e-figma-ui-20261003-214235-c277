import React, { useContext } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import AppDataContext from '../store/AppDataContext';
import { profile as seedProfile } from '../data/profile';
import { colors, radii, spacing, tabBarHeight, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DashboardMenu'>;

interface MenuRowProps {
  testID: string;
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

function MenuRow({ testID, label, icon, onPress, disabled }: MenuRowProps) {
  const content = (
    <>
      <View style={styles.rowIcon}>{icon}</View>
      <Text numberOfLines={1} style={[styles.rowLabel, disabled && styles.rowLabelDisabled]}>
        {label}
      </Text>
      {disabled ? (
        <View style={styles.comingSoonPill}>
          <Text style={styles.comingSoonText}>coming soon</Text>
        </View>
      ) : null}
    </>
  );

  if (disabled || !onPress) {
    return (
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={`${label} — coming soon`}
        accessibilityState={{ disabled: true }}
        disabled
        style={styles.row}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      {content}
    </Pressable>
  );
}

export default function DashboardMenuScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const context = useContext(AppDataContext);
  const profile = context?.profile ?? seedProfile;

  const topInset = Math.max(insets.top, 25);
  const bottomInset = Math.max(insets.bottom, spacing.space4);

  return (
    <View testID="screen-dashboard-menu" style={styles.screen}>
      <Pressable
        testID="dashboard-menu-scrim"
        accessibilityRole="button"
        accessibilityLabel="Close menu"
        onPress={() => navigation.goBack()}
        style={styles.scrim}
      />

      <View testID="dashboard-menu-drawer" style={[styles.drawer, { paddingBottom: bottomInset }]}>
        <View style={[styles.header, { paddingTop: topInset + 62 }]}>
          <View style={styles.headerRow}>
            <Image source={profile.avatar} style={styles.avatar} resizeMode="cover" />
            <View style={styles.profileInfo}>
              <Text numberOfLines={1} style={styles.profileName}>
                {profile.name}
              </Text>
              <Text numberOfLines={1} style={styles.profileLocation}>
                {profile.location}
              </Text>
            </View>
            <Pressable
              testID="dashboard-menu-close"
              accessibilityRole="button"
              accessibilityLabel="Close menu"
              hitSlop={11}
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [styles.closeButton, pressed && styles.rowPressed]}
            >
              <Image
                source={require('../../design/figma/assets/icon-13x13.png')}
                style={styles.closeIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.rows}>
          <MenuRow
            testID="dashboard-menu-stats"
            label="Statistics"
            icon={<Ionicons name="stats-chart-outline" size={19} color={colors.fg} />}
            onPress={() => navigation.navigate('DashboardStats')}
          />
          <MenuRow
            testID="dashboard-menu-account"
            label="Account Settings"
            icon={
              <Image
                source={require('../../design/figma/assets/noun-user-1335326-19x19.png')}
                style={styles.rowIconImage}
                resizeMode="contain"
              />
            }
            disabled
          />
          <MenuRow
            testID="dashboard-menu-help"
            label="Help"
            icon={
              <Image
                source={require('../../design/figma/assets/noun-info-1174604-17x17.png')}
                style={styles.rowIconImageSmall}
                resizeMode="contain"
              />
            }
            disabled
          />
        </View>

        <View style={styles.spacer} />

        <MenuRow
          testID="dashboard-menu-logout"
          label="Logout"
          icon={<Ionicons name="log-out-outline" size={19} color={colors.fg} />}
          disabled
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: tabBarHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  drawer: {
    flex: 1,
    width: '100%',
    marginBottom: tabBarHeight,
    backgroundColor: colors.surface,
    shadowColor: colors.fgStrong,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    backgroundColor: colors.accent,
    paddingLeft: 23,
    paddingRight: spacing.space1,
    paddingBottom: 46,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: radii.pill,
    borderWidth: 3,
    borderColor: colors.surface,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.space1,
    marginRight: spacing.space1,
  },
  profileName: {
    ...typography.text16,
    color: colors.fg,
  },
  profileLocation: {
    ...typography.text14Alt,
    color: colors.fg,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  closeIcon: {
    width: 13,
    height: 13,
  },
  rows: {
    paddingTop: spacing.space4,
  },
  spacer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 55,
    paddingHorizontal: spacing.space5,
  },
  rowPressed: {
    opacity: 0.6,
  },
  rowIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.space1,
  },
  rowIconImage: {
    width: 19,
    height: 19,
  },
  rowIconImageSmall: {
    width: 17,
    height: 17,
  },
  rowLabel: {
    ...typography.text14,
    flexShrink: 1,
    color: colors.fg,
    opacity: 0.6,
  },
  rowLabelDisabled: {
    opacity: 0.6,
  },
  comingSoonPill: {
    marginLeft: spacing.space2,
    backgroundColor: colors.fg,
    borderRadius: radii.xs,
    paddingHorizontal: spacing.space1,
    paddingVertical: 2,
  },
  comingSoonText: {
    ...typography.text9,
    color: colors.onSurface,
    textTransform: 'uppercase',
  },
});
