import React, {useMemo} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import Text from '../common/Text';
import {
  PRIMARY_BACKGROUND,
  SECONDARY_BACKGROUND,
  PRIMARY_TEXT,
  ERROR_RED,
  SUCCESS_GREEN,
  ELECTRIC_BLUE,
  TEAL_BLUE,
} from '../../design/theme';
import {Results} from 'realm';
import {Transaction} from '../../realm/models/Account';

const {width: screenWidth} = Dimensions.get('window');

interface ExpensesPieChartProps {
  expenses: Results<Transaction>;
}

const ExpensesPieChart: React.FC<ExpensesPieChartProps> = ({expenses}) => {
  const chartData = useMemo(() => {
    const categoryTotals: {[key: string]: number} = {};

    expenses.forEach(expense => {
      if (expense?.category?.name && expense?.amount != null) {
        const categoryName = expense.category.name;
        categoryTotals[categoryName] =
          (categoryTotals[categoryName] || 0) + expense.amount;
      }
    });

    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8); // Show top 8 categories

    const colors = [
      ERROR_RED,
      ELECTRIC_BLUE,
      SUCCESS_GREEN,
      TEAL_BLUE,
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
    ];

    return sortedCategories.map(([name, amount], index) => ({
      name,
      amount,
      color: colors[index % colors.length],
      legendFontColor: PRIMARY_TEXT,
      legendFontSize: 12,
    }));
  }, [expenses]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + (expense?.amount || 0), 0);
  }, [expenses]);

  if (chartData.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="h3" style={styles.title}>
          Expenses by Category
        </Text>
        <View style={styles.emptyState}>
          <Text>No expenses found for this period</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        Expenses by Category
      </Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={screenWidth - 64}
          height={220}
          chartConfig={{
            backgroundColor: SECONDARY_BACKGROUND,
            backgroundGradientFrom: SECONDARY_BACKGROUND,
            backgroundGradientTo: SECONDARY_BACKGROUND,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => PRIMARY_TEXT,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Legend with percentages */}
      <View style={styles.legend}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, {backgroundColor: item.color}]} />
            <Text style={styles.legendText}>
              {item.name}: ₹{item.amount.toLocaleString()} (
              {((item.amount / totalExpenses) * 100).toFixed(1)}%)
            </Text>
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={styles.totalContainer}>
        <Text variant="h3">Total: ₹{totalExpenses.toLocaleString()}</Text>
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
  legend: {
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    flex: 1,
  },
  totalContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ExpensesPieChart;
