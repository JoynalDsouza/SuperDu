import React, {useMemo} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
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

interface MonthlyComparisonProps {
  transactions: Results<Transaction>;
}

const MonthlyComparison: React.FC<MonthlyComparisonProps> = ({
  transactions,
}) => {
  const chartData = useMemo(() => {
    const monthlyData: {[key: string]: {expenses: number; income: number}} = {};

    // Get last 6 months
    const months = Array.from({length: 6}, (_, i) =>
      moment()
        .subtract(5 - i, 'months')
        .format('YYYY-MM'),
    );

    months.forEach(month => {
      monthlyData[month] = {expenses: 0, income: 0};
    });

    transactions.forEach(transaction => {
      if (
        transaction?.addedOn &&
        transaction?.amount != null &&
        transaction?.type
      ) {
        const month = moment(transaction.addedOn).format('YYYY-MM');
        if (monthlyData[month]) {
          if (transaction.type === 'EXPENSE') {
            monthlyData[month].expenses += transaction.amount;
          } else if (transaction.type === 'INCOME') {
            monthlyData[month].income += transaction.amount;
          }
        }
      }
    });

    const labels = months.map(month => moment(month, 'YYYY-MM').format('MMM'));
    const expenseData = months.map(month => monthlyData[month].expenses);
    const incomeData = months.map(month => monthlyData[month].income);

    return {
      labels,
      datasets: [
        {
          data: expenseData,
          color: (opacity = 1) => ERROR_RED,
        },
        {
          data: incomeData,
          color: (opacity = 1) => SUCCESS_GREEN,
        },
      ],
      expenseData,
      incomeData,
    };
  }, [transactions]);

  const statistics = useMemo(() => {
    const {expenseData, incomeData} = chartData;

    const avgExpenses =
      expenseData.reduce((a, b) => a + b, 0) / expenseData.length;
    const avgIncome = incomeData.reduce((a, b) => a + b, 0) / incomeData.length;

    const currentMonth = expenseData[expenseData.length - 1];
    const previousMonth = expenseData[expenseData.length - 2];

    const expenseChange =
      previousMonth > 0
        ? ((currentMonth - previousMonth) / previousMonth) * 100
        : 0;

    return {
      avgExpenses,
      avgIncome,
      expenseChange,
      savingsRate:
        avgIncome > 0 ? ((avgIncome - avgExpenses) / avgIncome) * 100 : 0,
    };
  }, [chartData]);

  if (
    chartData.expenseData.every(val => val === 0) &&
    chartData.incomeData.every(val => val === 0)
  ) {
    return (
      <View style={styles.container}>
        <Text variant="h3" style={styles.title}>
          6-Month Comparison
        </Text>
        <View style={styles.emptyState}>
          <Text>No data available for monthly comparison</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        6-Month Comparison
      </Text>

      <View style={styles.chartContainer}>
        <BarChart
          data={{
            labels: chartData.labels,
            datasets: [
              {
                data: chartData.expenseData,
                color: (opacity = 1) => ERROR_RED,
              },
            ],
          }}
          width={screenWidth - 64}
          height={220}
          yAxisLabel="₹"
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: SECONDARY_BACKGROUND,
            backgroundGradientFrom: SECONDARY_BACKGROUND,
            backgroundGradientTo: SECONDARY_BACKGROUND,
            decimalPlaces: 0,
            color: (opacity = 1) => ERROR_RED,
            labelColor: (opacity = 1) => PRIMARY_TEXT,
            style: {
              borderRadius: 16,
            },
          }}
          style={styles.chart}
          fromZero
          showValuesOnTopOfBars
        />
      </View>

      {/* Statistics */}
      <View style={styles.statistics}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Avg Monthly Expenses</Text>
          <Text style={styles.statValue}>
            ₹{statistics.avgExpenses.toFixed(0)}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Avg Monthly Income</Text>
          <Text style={styles.statValue}>
            ₹{statistics.avgIncome.toFixed(0)}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Expense Change</Text>
          <Text
            style={{
              ...styles.statValue,
              color: statistics.expenseChange > 0 ? ERROR_RED : SUCCESS_GREEN,
            }}>
            {statistics.expenseChange > 0 ? '+' : ''}
            {statistics.expenseChange.toFixed(1)}%
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Savings Rate</Text>
          <Text
            style={{
              ...styles.statValue,
              color: statistics.savingsRate > 0 ? SUCCESS_GREEN : ERROR_RED,
            }}>
            {statistics.savingsRate.toFixed(1)}%
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
  statistics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PRIMARY_TEXT,
    textAlign: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MonthlyComparison;
