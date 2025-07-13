import React, {useMemo} from 'react';
import {View, StyleSheet, Pressable, Dimensions} from 'react-native';
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
import {useQuery} from '@realm/react';
import {Transaction} from '../../realm/models/Account';
import moment from 'moment';
import {rootNavigate} from '../../Navigation/navigation';
import {formatToINR} from '../../utils/formatCurrency';

const {width: screenWidth} = Dimensions.get('window');

const AnalyticsPreview: React.FC = () => {
  const transactions = useQuery(Transaction);

  // Get current month transactions
  const currentMonthTransactions = useMemo(() => {
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    return transactions.filtered(
      'addedOn >= $0 && addedOn <= $1',
      startOfMonth,
      endOfMonth,
    );
  }, [transactions]);

  const expenses = useMemo(() => {
    return currentMonthTransactions.filtered('type == "EXPENSE"');
  }, [currentMonthTransactions]);

  const income = useMemo(() => {
    return currentMonthTransactions.filtered('type == "INCOME"');
  }, [currentMonthTransactions]);

  const quickStats = useMemo(() => {
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);

    // Top 3 categories
    const categoryTotals: {[key: string]: number} = {};
    expenses.forEach(expense => {
      const categoryName = expense.category.name;
      categoryTotals[categoryName] =
        (categoryTotals[categoryName] || 0) + expense.amount;
    });

    const topCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }));

    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return {
      totalExpenses,
      totalIncome,
      topCategories,
      savingsRate,
      transactionCount: currentMonthTransactions.length,
    };
  }, [expenses, income, currentMonthTransactions]);

  const chartData = useMemo(() => {
    if (quickStats.topCategories.length === 0) return [];

    const colors = [ERROR_RED, ELECTRIC_BLUE, SUCCESS_GREEN];

    return quickStats.topCategories.map((category, index) => ({
      name: category.name,
      amount: category.amount,
      color: colors[index],
      legendFontColor: PRIMARY_TEXT,
      legendFontSize: 10,
    }));
  }, [quickStats.topCategories]);

  const getSavingsRateColor = (rate: number) => {
    if (rate > 20) return SUCCESS_GREEN;
    if (rate > 10) return '#FFA500';
    if (rate > 0) return '#FF6B6B';
    return ERROR_RED;
  };

  const getSavingsRateText = (rate: number) => {
    if (rate > 20) return 'Excellent';
    if (rate > 10) return 'Good';
    if (rate > 0) return 'Low';
    return 'Critical';
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => rootNavigate('Analytics', 'navigate')}>
      <View style={styles.header}>
        <Text variant="h3" style={styles.title}>
          Analytics Preview
        </Text>
        <Text style={styles.viewMore}>Tap to view more →</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>This Month</Text>
          <Text style={{...styles.statValue, color: ERROR_RED}}>
            {formatToINR(quickStats.totalExpenses)}
          </Text>
          <Text style={styles.statSubtext}>Expenses</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Savings Rate</Text>
          <Text
            style={{
              ...styles.statValue,
              color: getSavingsRateColor(quickStats.savingsRate),
            }}>
            {quickStats.savingsRate.toFixed(0)}%
          </Text>
          <Text style={styles.statSubtext}>
            {getSavingsRateText(quickStats.savingsRate)}
          </Text>
        </View>
      </View>

      {/* Mini Chart */}
      {chartData.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Top Categories</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={chartData}
              width={screenWidth - 80}
              height={140}
              chartConfig={{
                backgroundColor: SECONDARY_BACKGROUND,
                backgroundGradientFrom: SECONDARY_BACKGROUND,
                backgroundGradientTo: SECONDARY_BACKGROUND,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => PRIMARY_TEXT,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
              hasLegend={false}
            />
          </View>

          {/* Mini Legend */}
          <View style={styles.miniLegend}>
            {chartData.slice(0, 3).map((item, index) => (
              <View key={index} style={styles.miniLegendItem}>
                <View
                  style={[
                    styles.miniLegendColor,
                    {backgroundColor: item.color},
                  ]}
                />
                <Text style={styles.miniLegendText}>
                  {item.name} (₹{(item.amount / 1000).toFixed(1)}k)
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Quick Insights */}
      <View style={styles.insightsSection}>
        <Text style={styles.insightTitle}>Quick Insights:</Text>
        <View style={styles.insights}>
          <Text style={styles.insight}>
            📊 {quickStats.transactionCount} transactions this month
          </Text>
          {quickStats.topCategories.length > 0 && (
            <Text style={styles.insight}>
              🎯 Top category: {quickStats.topCategories[0].name} (
              {quickStats.topCategories[0].percentage.toFixed(0)}%)
            </Text>
          )}
          {quickStats.savingsRate > 0 ? (
            <Text style={styles.insight}>
              💰 Saving {quickStats.savingsRate.toFixed(0)}% of income
            </Text>
          ) : (
            <Text style={styles.insight}>⚠️ Spending exceeds income</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: SECONDARY_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: PRIMARY_TEXT,
  },
  viewMore: {
    fontSize: 12,
    color: ELECTRIC_BLUE,
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: PRIMARY_TEXT,
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 10,
    color: PRIMARY_TEXT,
    opacity: 0.6,
  },
  chartSection: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    marginBottom: 8,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
  miniLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  miniLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  miniLegendColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  miniLegendText: {
    fontSize: 9,
    color: PRIMARY_TEXT,
    opacity: 0.8,
  },
  insightsSection: {
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 8,
    padding: 12,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: PRIMARY_TEXT,
    marginBottom: 8,
  },
  insights: {
    gap: 4,
  },
  insight: {
    fontSize: 11,
    color: PRIMARY_TEXT,
    opacity: 0.8,
    lineHeight: 16,
  },
});

export default AnalyticsPreview;
