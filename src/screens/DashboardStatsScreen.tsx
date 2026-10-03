import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Line,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { MonthlyStatsPoint } from '../data/types';
import { useAppData } from '../store/AppDataContext';
import {
  bottomContentPadding,
  colors,
  fonts,
  radii,
  shadows,
  spacing,
} from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DashboardStats'>;

const H_PADDING = spacing.space6;
const CARD_PADDING = spacing.space2;
const PERIODS = ['D', 'W', 'M', 'Y'] as const;
const SELECTED_PERIOD = 'Y';

interface ChartProps {
  width: number;
  points: MonthlyStatsPoint[];
  days: number;
}

function StatChart({ width, points, days }: ChartProps) {
  const yAxisWidth = 30;
  const plotHeight = 224;
  const topPad = 12;
  const monthRowHeight = 20;
  const innerPad = 8;
  const plotWidth = Math.max(60, width - yAxisWidth);
  const height = topPad + plotHeight + monthRowHeight;

  const values = points.map((point) => point.value);
  const maxValue = values.length ? Math.max(...values) : 0;
  const minValue = values.length ? Math.min(...values) : 0;
  const span = maxValue - minValue || 1;

  const step = points.length > 1 ? (plotWidth - innerPad * 2) / (points.length - 1) : 0;
  const xFor = (index: number) => innerPad + step * index;
  const yFor = (value: number) => topPad + (1 - (value - minValue) / span) * plotHeight;

  const coords = points.map((point, index) => ({ x: xFor(index), y: yFor(point.value) }));

  const linePath = coords.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = coords[index - 1];
    const beforePrevious = coords[index - 2] ?? previous;
    const next = coords[index + 1] ?? point;
    const control1x = previous.x + (point.x - beforePrevious.x) / 6;
    const control1y = previous.y + (point.y - beforePrevious.y) / 6;
    const control2x = point.x - (next.x - previous.x) / 6;
    const control2y = point.y - (next.y - previous.y) / 6;
    return `${acc} C ${control1x} ${control1y} ${control2x} ${control2y} ${point.x} ${point.y}`;
  }, '');

  const baseline = topPad + plotHeight;
  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x} ${baseline} L ${coords[0].x} ${baseline} Z`
      : '';

  const tickCount = 3;
  const ticks = Array.from(
    { length: tickCount + 1 },
    (_, index) => minValue + (span * index) / tickCount,
  );

  const peakIndex = values.indexOf(maxValue);
  const peak = coords[peakIndex];

  const tipWidth = 62;
  const tipHeight = 22;
  const tipX = peak
    ? Math.min(Math.max(peak.x - tipWidth / 2, 0), Math.max(0, plotWidth - tipWidth))
    : 0;
  const tipY = peak ? Math.max(0, peak.y - tipHeight - 14) : 0;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="stats-area" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.accent} stopOpacity="0.3" />
          <Stop offset="1" stopColor={colors.accent} stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {ticks.map((tick, index) => (
        <Line
          key={`grid-${index}`}
          x1={0}
          y1={yFor(tick)}
          x2={plotWidth}
          y2={yFor(tick)}
          stroke={colors.border}
          strokeWidth={0.5}
          strokeDasharray="4 4"
          strokeOpacity={0.35}
        />
      ))}
      <Line
        x1={plotWidth}
        y1={topPad}
        x2={plotWidth}
        y2={baseline}
        stroke={colors.border}
        strokeWidth={0.5}
        strokeDasharray="4 4"
        strokeOpacity={0.35}
      />

      {areaPath ? <Path d={areaPath} fill="url(#stats-area)" /> : null}
      {linePath ? (
        <Path d={linePath} fill="none" stroke={colors.accent} strokeWidth={2.5} />
      ) : null}

      {coords.map((point, index) => (
        <Circle
          key={`dot-${points[index]?.month ?? index}`}
          cx={point.x}
          cy={point.y}
          r={index === peakIndex ? 4.5 : 3}
          fill={colors.surface}
          stroke={colors.accent}
          strokeWidth={2.5}
        />
      ))}

      {peak ? (
        <>
          <Rect
            x={tipX}
            y={tipY}
            width={tipWidth}
            height={tipHeight}
            rx={6}
            fill={colors.surface}
          />
          <SvgText
            x={tipX + tipWidth / 2}
            y={tipY + tipHeight / 2 + 4}
            fontSize={11}
            fontFamily={fonts.inter}
            fill={colors.fgBody}
            textAnchor="middle"
          >
            {`${days} DAYS`}
          </SvgText>
        </>
      ) : null}

      {ticks.map((tick, index) => (
        <SvgText
          key={`tick-${index}`}
          x={plotWidth + 8}
          y={yFor(tick) + 4}
          fontSize={12}
          fontFamily={fonts.aleo}
          fill={colors.fgBody}
          fillOpacity={0.2}
        >
          {`${Math.round(tick)}`}
        </SvgText>
      ))}

      {points.map((point, index) => (
        <SvgText
          key={`month-${point.month}`}
          x={coords[index]?.x ?? 0}
          y={baseline + 16}
          fontSize={12}
          fontFamily={fonts.aleo}
          fill={colors.fgBody}
          fillOpacity={0.2}
          textAnchor="middle"
        >
          {point.month.charAt(0)}
        </SvgText>
      ))}
    </Svg>
  );
}

export default function DashboardStatsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { monthlyStats } = useAppData();

  const contentWidth = Math.max(280, width - H_PADDING * 2);
  const chartWidth = Math.max(200, contentWidth - CARD_PADDING * 2);

  return (
    <View testID="screen-dashboard-stats" style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomContentPadding + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { height: 120 + insets.top }]}>
          <Image
            source={require('../../design/figma/assets/gruppe-maskieren-6.png')}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <Pressable
            onPress={() => navigation.goBack()}
            testID="stats-back-button"
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={8}
            style={({ pressed }) => [styles.backButton, { top: insets.top + 16 }, pressed ? styles.pressed : null]}
          >
            <Image
              source={require('../../design/figma/assets/noun-back-1227057.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </Pressable>
          <Image
            source={require('../../design/figma/assets/noun-user-1335326.png')}
            style={[styles.userIcon, { top: insets.top + 25 }]}
            resizeMode="contain"
            accessible={false}
          />
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>Statistics</Text>

          <View style={styles.txtBlock}>
            <Text style={styles.since}>Since {monthlyStats.since}</Text>
            <View style={styles.daysRow}>
              <Text style={styles.daysNumber}>{monthlyStats.days}</Text>
              <Text style={styles.daysLabel}> DAYS</Text>
            </View>
            <Text style={styles.range}>{monthlyStats.range}</Text>
          </View>

          <View style={styles.switchBlock}>
            <Pressable
              testID="stats-period-switch"
              accessibilityRole="button"
              accessibilityState={{ disabled: true }}
              accessibilityLabel="Chart period (coming soon)"
              disabled
              style={[styles.switch, styles.switchDisabled]}
            >
              {PERIODS.map((period) => {
                const selected = period === SELECTED_PERIOD;
                return (
                  <View
                    key={period}
                    style={[styles.switchSegment, selected ? styles.switchSegmentSelected : null]}
                  >
                    <Text style={selected ? styles.switchSelectedLabel : styles.switchLabel}>
                      {period}
                    </Text>
                  </View>
                );
              })}
            </Pressable>
            <View style={styles.comingSoonPill}>
              <Text style={styles.comingSoonText}>coming soon</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <StatChart width={chartWidth} points={monthlyStats.points} days={monthlyStats.days} />
          </View>

          <Text style={styles.topRun}>Top Run: {monthlyStats.days} Days</Text>
          <Text style={styles.restarts}>Restarts: 4</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    width: '100%',
    overflow: 'hidden',
  },
  headerImage: {
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
    left: 18,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  backIcon: {
    width: 11,
    height: 18,
  },
  userIcon: {
    position: 'absolute',
    right: 39,
    width: 27,
    height: 27,
  },
  body: {
    paddingHorizontal: H_PADDING,
  },
  title: {
    marginTop: 15,
    fontFamily: fonts.aleo,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 19,
    color: colors.fgBody,
  },
  txtBlock: {
    marginTop: 39,
  },
  since: {
    fontFamily: fonts.inter,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 17,
    color: colors.fg,
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 7,
  },
  daysNumber: {
    fontFamily: fonts.inter,
    fontWeight: '400',
    fontSize: 24,
    lineHeight: 29,
    color: colors.fgBody,
  },
  daysLabel: {
    fontFamily: fonts.inter,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 29,
    color: colors.fgBody,
  },
  range: {
    marginTop: 7,
    fontFamily: fonts.inter,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    color: colors.fgBody,
  },
  switchBlock: {
    marginTop: 20,
  },
  switch: {
    height: 34,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceTint,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchDisabled: {
    opacity: 0.5,
  },
  switchSegment: {
    flex: 1,
    height: 26,
    margin: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchSegmentSelected: {
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  switchLabel: {
    fontFamily: fonts.inter,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 14,
    color: colors.fgBody,
  },
  switchSelectedLabel: {
    fontFamily: fonts.aleo,
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 14,
    color: colors.fgBody,
  },
  comingSoonPill: {
    alignSelf: 'flex-end',
    marginTop: spacing.space0,
    borderRadius: radii.xs,
    backgroundColor: colors.fg,
    paddingHorizontal: spacing.space1,
    paddingVertical: 2,
  },
  comingSoonText: {
    fontFamily: fonts.interThin,
    fontWeight: '100',
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.onSurface,
  },
  chartCard: {
    marginTop: spacing.space3,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    paddingHorizontal: CARD_PADDING,
    paddingVertical: spacing.space2,
    alignItems: 'center',
    overflow: 'hidden',
    ...shadows.card,
  },
  topRun: {
    marginTop: 39,
    fontFamily: fonts.inter,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 17,
    color: colors.fgBody,
  },
  restarts: {
    marginTop: spacing.space1,
    fontFamily: fonts.inter,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    color: colors.fgBody,
  },
});
