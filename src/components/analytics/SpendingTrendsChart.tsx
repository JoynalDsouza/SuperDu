import React, {useMemo} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import Text from '../common/Text';
import {
  PRIMARY_BACKGROUND,
  SECONDARY_BACKGROUND,
  PRIMARY_TEXT,
  ERROR_RED,
  SUCCESS_GREEN,
  ELECTRIC_BLUE,
} from '../../design/theme';
import {Results} from 'realm';
import {Transaction} from '../../realm/models/Account';
import moment from 'moment';

const {width: screenWidth} = Dimensions.get('window');

interface SpendingTrendsChartProps {
  transactions: Results<Transaction>;
}

const SpendingTrendsChart: React.FC<SpendingTrendsChartProps> = ({
  transactions,
}) => {
  const chartData = useMemo(() => {
    const dailyExpenses: {[key: string]: number} = {};
    const dailyIncome: {[key: string]: number} = {};

    transactions.forEach(transaction => {
      if (
        transaction?.addedOn &&
        transaction?.amount != null &&
        transaction?.type
      ) {
        const date = moment(transaction.addedOn).format('MM/DD');

        if (transaction.type === 'EXPENSE') {
          dailyExpenses[date] = (dailyExpenses[date] || 0) + transaction.amount;
        } else if (transaction.type === 'INCOME') {
          dailyIncome[date] = (dailyIncome[date] || 0) + transaction.amount;
        }
      }
    });

    // Get last 7 days for trends
    const last7Days = Array.from({length: 7}, (_, i) =>
      moment()
        .subtract(6 - i, 'days')
        .format('MM/DD'),
    );

    const expenseData = last7Days.map(date => dailyExpenses[date] || 0);
    const incomeData = last7Days.map(date => dailyIncome[date] || 0);
    const labels = last7Days.map(date => moment(date, 'MM/DD').format('DD'));

    return {
      labels,
      datasets: [
        {
          data: expenseData,
          color: (opacity = 1) => ERROR_RED,
          strokeWidth: 2,
        },
        {
          data: incomeData,
          color: (opacity = 1) => SUCCESS_GREEN,
          strokeWidth: 2,
        },
      ],
      legend: ['Expenses', 'Income'],
    };
  }, [transactions]);

  const maxValue = Math.max(
    ...chartData.datasets[0].data,
    ...chartData.datasets[1].data,
    1000, // minimum scale
  );

  if (
    chartData.datasets[0].data.every(val => val === 0) &&
    chartData.datasets[1].data.every(val => val === 0)
  ) {
    return (
      <View style={styles.container}>
        <Text variant="h3" style={styles.title}>
          7-Day Spending Trends
        </Text>
        <View style={styles.emptyState}>
          <Text>No transactions found for the last 7 days</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        7-Day Spending Trends
      </Text>

      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth - 64}
          height={220}
          chartConfig={{
            backgroundColor: SECONDARY_BACKGROUND,
            backgroundGradientFrom: SECONDARY_BACKGROUND,
            backgroundGradientTo: SECONDARY_BACKGROUND,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => PRIMARY_TEXT,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
            },
          }}
          bezier
          style={styles.chart}
          fromZero
          segments={4}
        />
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryColor, {backgroundColor: ERROR_RED}]} />
          <Text style={styles.summaryText}>
            Avg Daily Expense: ₹
            {(
              chartData.datasets[0].data.reduce((a, b) => a + b, 0) / 7
            ).toFixed(0)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <View
            style={[styles.summaryColor, {backgroundColor: SUCCESS_GREEN}]}
          />
          <Text style={styles.summaryText}>
            Avg Daily Income: ₹
            {(
              chartData.datasets[1].data.reduce((a, b) => a + b, 0) / 7
            ).toFixed(0)}
          </Text>
        </View>
      </View>
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
    marginBottom: 16,
    color: PRIMARY_TEXT,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  summary: {
    marginTop: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  summaryText: {
    fontSize: 12,
    color: PRIMARY_TEXT,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SpendingTrendsChart;
