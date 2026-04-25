import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DayHourlyPoint } from '../../../../types/weather'
import { useTheme } from '../../../../theme/useTheme'
import styles from './DayDetailCharts.module.scss'

type DayDetailChartsProps = {
  data: DayHourlyPoint[]
  nowTimestamp: number
  temperatureUnit: string
  windUnit: string
  pressureUnit: string
  distanceUnit: string
}

export function DayDetailCharts({
  data,
  nowTimestamp,
  temperatureUnit,
  windUnit,
  pressureUnit,
  distanceUnit,
}: DayDetailChartsProps) {
  const { theme } = useTheme()
  const { chartData, currentPoint } = useMemo(() => {
    const timestamps = data.map((point) => new Date(point.time).getTime())
    const minTime = Math.min(...timestamps)
    const maxTime = Math.max(...timestamps)
    const hasCurrentTime = nowTimestamp >= minTime && nowTimestamp <= maxTime

    let currentIndex = -1
    if (hasCurrentTime) {
      let closestDistance = Number.POSITIVE_INFINITY
      timestamps.forEach((timestamp, index) => {
        const distance = Math.abs(timestamp - nowTimestamp)
        if (distance < closestDistance) {
          closestDistance = distance
          currentIndex = index
        }
      })
    }

    const enriched = data.map((point, index) => {
      const isPast = currentIndex >= 0 && index <= currentIndex
      const isFuture = currentIndex >= 0 ? index >= currentIndex : true

      return {
        ...point,
        temperaturePast: isPast ? point.temperature : null,
        temperatureFuture: isFuture ? point.temperature : null,
        uvPast: isPast ? point.uvIndex : null,
        uvFuture: isFuture ? point.uvIndex : null,
        humidityPast: isPast ? point.humidity : null,
        humidityFuture: isFuture ? point.humidity : null,
        windPast: isPast ? point.windSpeed : null,
        windFuture: isFuture ? point.windSpeed : null,
        pressurePast: isPast ? point.pressure : null,
        pressureFuture: isFuture ? point.pressure : null,
        visibilityPast: isPast ? point.visibility : null,
        visibilityFuture: isFuture ? point.visibility : null,
      }
    })

    return {
      chartData: enriched,
      currentPoint: currentIndex >= 0 ? data[currentIndex] : null,
    }
  }, [data, nowTimestamp])

  const palette =
    theme === 'light'
      ? {
          grid: 'rgba(47, 67, 97, 0.2)',
          axis: 'rgba(34, 51, 79, 0.78)',
          temp: '#0ea5e9',
          uv: '#d97706',
          humidity: '#16a34a',
          wind: '#ea580c',
          pressure: '#7c3aed',
          visibility: '#0284c7',
          dotStroke: '#ffffff',
          tooltipBg: 'rgba(248, 251, 255, 0.96)',
          tooltipText: '#10223a',
        }
      : {
          grid: 'rgba(145, 161, 187, 0.18)',
          axis: 'rgba(186, 203, 226, 0.75)',
          temp: '#76d6ff',
          uv: '#ffd166',
          humidity: '#9ae6b4',
          wind: '#ffb4a2',
          pressure: '#d6b3ff',
          visibility: '#8be9fd',
          dotStroke: '#11233f',
          tooltipBg: 'rgba(18, 30, 48, 0.94)',
          tooltipText: '#f3f7ff',
        }

  return (
    <div className={styles.dayCharts}>
      <article className={styles.dayChartCard}>
        <p className={styles.dayChartTitle}>Temperature ({temperatureUnit}) & UV</p>
        <div className={styles.dayChartCanvas}>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={chartData}>
              <defs>
                <filter id="past-temp-blur">
                  <feGaussianBlur stdDeviation="1.1" />
                </filter>
              </defs>
              <CartesianGrid stroke={palette.grid} strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: palette.axis, fontSize: 11 }} minTickGap={16} />
              <YAxis
                yAxisId="temp"
                tick={{ fill: palette.axis, fontSize: 11 }}
                width={32}
                tickFormatter={(v) => `${Math.round(v)}`}
              />
              <YAxis
                yAxisId="uv"
                orientation="right"
                tick={{ fill: palette.axis, fontSize: 11 }}
                width={28}
                tickFormatter={(v) => `${Math.round(v)}`}
              />
              <Tooltip
                labelFormatter={(label) => `Time ${String(label)}`}
                contentStyle={{
                  background: palette.tooltipBg,
                  border: `1px solid ${palette.grid}`,
                  color: palette.tooltipText,
                  borderRadius: 8,
                }}
                itemStyle={{ color: palette.tooltipText }}
                labelStyle={{ color: palette.tooltipText }}
              />
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="temperaturePast"
                name="Temperature (past)"
                stroke={palette.temp}
                strokeWidth={1.9}
                strokeOpacity={0.42}
                filter="url(#past-temp-blur)"
                dot={false}
              />
              <Line
                yAxisId="uv"
                type="monotone"
                dataKey="uvPast"
                name="UV (past)"
                stroke={palette.uv}
                strokeWidth={1.8}
                strokeOpacity={0.42}
                filter="url(#past-temp-blur)"
                dot={false}
              />
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="temperatureFuture"
                name="Temperature"
                stroke={palette.temp}
                strokeWidth={2.2}
                dot={false}
              />
              <Line
                yAxisId="uv"
                type="monotone"
                dataKey="uvFuture"
                name="UV"
                stroke={palette.uv}
                strokeWidth={2}
                dot={false}
              />
              {currentPoint && (
                <ReferenceDot
                  x={currentPoint.label}
                  y={currentPoint.temperature}
                  yAxisId="temp"
                  r={4.3}
                  fill={palette.temp}
                  stroke={palette.dotStroke}
                  strokeWidth={1.3}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className={styles.dayChartCard}>
        <p className={styles.dayChartTitle}>Humidity (%) & Wind ({windUnit})</p>
        <div className={styles.dayChartCanvas}>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={chartData}>
              <defs>
                <filter id="past-humidity-blur">
                  <feGaussianBlur stdDeviation="1.1" />
                </filter>
              </defs>
              <CartesianGrid stroke={palette.grid} strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: palette.axis, fontSize: 11 }} minTickGap={16} />
              <YAxis
                yAxisId="humidity"
                tick={{ fill: palette.axis, fontSize: 11 }}
                width={30}
                tickFormatter={(v) => `${Math.round(v)}`}
              />
              <YAxis
                yAxisId="wind"
                orientation="right"
                tick={{ fill: palette.axis, fontSize: 11 }}
                width={36}
                tickFormatter={(v) => `${Math.round(v)}`}
              />
              <Tooltip
                labelFormatter={(label) => `Time ${String(label)}`}
                contentStyle={{
                  background: palette.tooltipBg,
                  border: `1px solid ${palette.grid}`,
                  color: palette.tooltipText,
                  borderRadius: 8,
                }}
                itemStyle={{ color: palette.tooltipText }}
                labelStyle={{ color: palette.tooltipText }}
              />
              <Line
                yAxisId="humidity"
                type="monotone"
                dataKey="humidityPast"
                name="Humidity (past)"
                stroke={palette.humidity}
                strokeWidth={1.8}
                strokeOpacity={0.42}
                filter="url(#past-humidity-blur)"
                dot={false}
              />
              <Line
                yAxisId="wind"
                type="monotone"
                dataKey="windPast"
                name="Wind (past)"
                stroke={palette.wind}
                strokeWidth={1.8}
                strokeOpacity={0.42}
                filter="url(#past-humidity-blur)"
                dot={false}
              />
              <Line
                yAxisId="wind"
                type="monotone"
                dataKey="windFuture"
                name="Wind"
                stroke={palette.wind}
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="humidity"
                type="monotone"
                dataKey="humidityFuture"
                name="Humidity"
                stroke={palette.humidity}
                strokeWidth={2}
                dot={false}
              />
              {currentPoint && (
                <ReferenceDot
                  x={currentPoint.label}
                  y={currentPoint.humidity}
                  yAxisId="humidity"
                  r={4.3}
                  fill={palette.humidity}
                  stroke={palette.dotStroke}
                  strokeWidth={1.3}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className={styles.dayChartCard}>
        <p className={styles.dayChartTitle}>
          Pressure ({pressureUnit}) & Visibility ({distanceUnit})
        </p>
        <div className={styles.dayChartCanvas}>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={chartData}>
              <defs>
                <filter id="past-pressure-blur">
                  <feGaussianBlur stdDeviation="1.1" />
                </filter>
              </defs>
              <CartesianGrid stroke={palette.grid} strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: palette.axis, fontSize: 11 }} minTickGap={16} />
              <YAxis
                yAxisId="pressure"
                tick={{ fill: palette.axis, fontSize: 11 }}
                width={36}
                tickFormatter={(v) => `${Math.round(v)}`}
              />
              <YAxis
                yAxisId="visibility"
                orientation="right"
                tick={{ fill: palette.axis, fontSize: 11 }}
                width={34}
                tickFormatter={(v) => `${Math.round(v)}`}
              />
              <Tooltip
                labelFormatter={(label) => `Time ${String(label)}`}
                contentStyle={{
                  background: palette.tooltipBg,
                  border: `1px solid ${palette.grid}`,
                  color: palette.tooltipText,
                  borderRadius: 8,
                }}
                itemStyle={{ color: palette.tooltipText }}
                labelStyle={{ color: palette.tooltipText }}
              />
              <Area
                yAxisId="pressure"
                type="monotone"
                dataKey="pressurePast"
                name="Pressure (past)"
                stroke={palette.pressure}
                fill={theme === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(214, 179, 255, 0.08)'}
                strokeWidth={1.8}
                strokeOpacity={0.42}
                filter="url(#past-pressure-blur)"
              />
              <Line
                yAxisId="visibility"
                type="monotone"
                dataKey="visibilityPast"
                name="Visibility (past)"
                stroke={palette.visibility}
                strokeWidth={1.8}
                strokeOpacity={0.42}
                filter="url(#past-pressure-blur)"
                dot={false}
              />
              <Area
                yAxisId="pressure"
                type="monotone"
                dataKey="pressureFuture"
                name="Pressure"
                stroke={palette.pressure}
                fill={theme === 'light' ? 'rgba(124, 58, 237, 0.14)' : 'rgba(214, 179, 255, 0.14)'}
                strokeWidth={2}
              />
              <Line
                yAxisId="visibility"
                type="monotone"
                dataKey="visibilityFuture"
                name="Visibility"
                stroke={palette.visibility}
                strokeWidth={2}
                dot={false}
              />
              {currentPoint && (
                <ReferenceDot
                  x={currentPoint.label}
                  y={currentPoint.pressure}
                  yAxisId="pressure"
                  r={4.3}
                  fill={palette.pressure}
                  stroke={palette.dotStroke}
                  strokeWidth={1.3}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>
    </div>
  )
}
