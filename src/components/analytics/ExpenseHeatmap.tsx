import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '../common/Text';
import {
  PRIMARY_BACKGROUND,
  SECONDARY_BACKGROUND,
  PRIMARY_TEXT,
  ERROR_RED,
  SUCCESS_GREEN,
  LIGHT_SLATE_GREY,
} from '../../design/theme';
import {Results} from 'realm';
import {Transaction} from '../../realm/models/Account';
import moment from 'moment';

interface ExpenseHeatmapProps {
  expenses: Results<Transaction>;
}

const ExpenseHeatmap: React.FC<ExpenseHeatmapProps> = ({expenses}) => {
  const heatmapData = useMemo(() => {
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = Array.from({length: 24}, (_, i) => i);

    // Initialize matrix: [day][hour] = amount
    const matrix: number[][] = Array(7)
      .fill(null)
      .map(() => Array(24).fill(0));

    expenses.forEach(expense => {
      if (expense?.addedOn && expense?.amount != null) {
        const date = moment(expense.addedOn);
        const day = date.day(); // 0 = Sunday
        const hour = date.hour();
        matrix[day][hour] += expense.amount;
      }
    });

    // Find max value for normalization
    const maxValue = Math.max(...matrix.flat());

    return {
      matrix,
      maxValue,
      dayOfWeek,
      hours,
    };
  }, [expenses]);

  const getHeatColor = (value: number, maxValue: number) => {
    if (value === 0) return LIGHT_SLATE_GREY;

    const intensity = value / maxValue;

    if (intensity > 0.7) return ERROR_RED;
    if (intensity > 0.4) return '#FF6B6B';
    if (intensity > 0.2) return '#FFB6B6';
    return '#FFE6E6';
  };

  const formatTimeRange = (hour: number) => {
    const nextHour = (hour + 1) % 24;
    return `${hour.toString().padStart(2, '0')}:00-${nextHour
      .toString()
      .padStart(2, '0')}:00`;
  };

  if (expenses.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="h3" style={styles.title}>
          Expense Heatmap
        </Text>
        <View style={styles.emptyState}>
          <Text>No expenses found for heatmap</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        Expense Heatmap
      </Text>
      <Text style={styles.subtitle}>
        When do you spend the most? (Darker = More spending)
      </Text>

      {/* Time labels */}
      <View style={styles.timeLabels}>
        <View style={styles.dayLabelSpace} />
        {[0, 6, 12, 18].map(hour => (
          <Text key={hour} style={styles.timeLabel}>
            {hour.toString().padStart(2, '0')}:00
          </Text>
        ))}
      </View>

      {/* Heatmap grid */}
      <View style={styles.heatmapContainer}>
        {heatmapData.dayOfWeek.map((day, dayIndex) => (
          <View key={day} style={styles.heatmapRow}>
            <Text style={styles.dayLabel}>{day}</Text>
            <View style={styles.heatmapCells}>
              {heatmapData.hours.map(hour => (
                <View
                  key={hour}
                  style={[
                    styles.heatmapCell,
                    {
                      backgroundColor: getHeatColor(
                        heatmapData.matrix[dayIndex][hour],
                        heatmapData.maxValue,
                      ),
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Spending intensity:</Text>
        <View style={styles.legendScale}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, {backgroundColor: LIGHT_SLATE_GREY}]}
            />
            <Text style={styles.legendText}>None</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, {backgroundColor: '#FFE6E6'}]} />
            <Text style={styles.legendText}>Low</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, {backgroundColor: '#FFB6B6'}]} />
            <Text style={styles.legendText}>Medium</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, {backgroundColor: '#FF6B6B'}]} />
            <Text style={styles.legendText}>High</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, {backgroundColor: ERROR_RED}]} />
            <Text style={styles.legendText}>Very High</Text>
          </View>
        </View>
      </View>

      {/* Peak spending info */}
      {heatmapData.maxValue > 0 && (
        <View style={styles.peakInfo}>
          <Text style={styles.peakTitle}>Peak Spending:</Text>
          <Text style={styles.peakValue}>
            ₹{heatmapData.maxValue.toFixed(0)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: SECONDARY_BACKGROUND,
    borderRadius: 12,
    padding: 16,
  },
  title: {
    marginBottom: 8,
    color: PRIMARY_TEXT,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 16,
  },
  timeLabels: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayLabelSpace: {
    width: 40,
  },
  timeLabel: {
    flex: 1,
    fontSize: 10,
    color: PRIMARY_TEXT,
    opacity: 0.7,
    textAlign: 'center',
  },
  heatmapContainer: {
    marginBottom: 16,
  },
  heatmapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  dayLabel: {
    width: 40,
    fontSize: 12,
    color: PRIMARY_TEXT,
    textAlign: 'right',
    marginRight: 8,
  },
  heatmapCells: {
    flex: 1,
    flexDirection: 'row',
    gap: 1,
  },
  heatmapCell: {
    flex: 1,
    height: 16,
    borderRadius: 2,
  },
  legend: {
    marginBottom: 12,
  },
  legendTitle: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    marginBottom: 8,
  },
  legendScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 2,
    marginBottom: 4,
  },
  legendText: {
    fontSize: 10,
    color: PRIMARY_TEXT,
    opacity: 0.7,
  },
  peakInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 8,
    padding: 8,
  },
  peakTitle: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    marginRight: 8,
  },
  peakValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ERROR_RED,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ExpenseHeatmap;
