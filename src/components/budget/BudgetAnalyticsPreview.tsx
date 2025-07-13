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
  LIGHT_SLATE_GREY,
} from '../../design/theme';
import {useQuery} from '@realm/react';
import {Transaction} from '../../realm/models/Account';
import moment from 'moment';
import {rootNavigate} from '../../Navigation/navigation';
import {formatToINR} from '../../utils/formatCurrency';

const {width: screenWidth} = Dimensions.get('window');

interface BudgetAnalyticsPreviewProps {
  selectedMonth: number;
  selectedYear: number;
  budgetData?: {[key: string]: {planned: number; actual: number}};
}

const BudgetAnalyticsPreview: React.FC<BudgetAnalyticsPreviewProps> = ({
  selectedMonth,
  selectedYear,
  budgetData = {},
}) => {
  const transactions = useQuery(Transaction);

  // Get transactions for selected month/year
  const monthTransactions = useMemo(() => {
    const startOfMonth = moment()
      .year(selectedYear)
      .month(selectedMonth - 1)
      .startOf('month')
      .toDate();
    const endOfMonth = moment()
      .year(selectedYear)
      .month(selectedMonth - 1)
      .endOf('month')
      .toDate();

    return transactions.filtered(
      'addedOn >= $0 && addedOn <= $1',
      startOfMonth,
      endOfMonth,
    );
  }, [transactions, selectedMonth, selectedYear]);

  const expenses = useMemo(() => {
    return monthTransactions.filtered('type == "EXPENSE"');
  }, [monthTransactions]);

  const income = useMemo(() => {
    return monthTransactions.filtered('type == "INCOME"');
  }, [monthTransactions]);

  const budgetAnalytics = useMemo(() => {
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + (expense?.amount || 0),
      0,
    );
    const totalIncome = income.reduce(
      (sum, inc) => sum + (inc?.amount || 0),
      0,
    );

    // Calculate budget vs actual
    const totalBudgeted = Object.values(budgetData).reduce(
      (sum, item) => sum + item.planned,
      0,
    );
    const totalActual = Object.values(budgetData).reduce(
      (sum, item) => sum + item.actual,
      0,
    );

    const budgetVariance = totalBudgeted - totalActual;
    const budgetUtilization =
      totalBudgeted > 0 ? (totalActual / totalBudgeted) * 100 : 0;

    // Top over-budget categories
    const overBudgetCategories = Object.entries(budgetData)
      .filter(([, data]) => data.actual > data.planned && data.planned > 0)
      .sort(([, a], [, b]) => b.actual - b.planned - (a.actual - a.planned))
      .slice(0, 3)
      .map(([name, data]) => ({
        name,
        variance: data.actual - data.planned,
        percentage: ((data.actual - data.planned) / data.planned) * 100,
      }));

    // Under-budget categories (savings opportunities)
    const underBudgetCategories = Object.entries(budgetData)
      .filter(([, data]) => data.actual < data.planned && data.planned > 0)
      .sort(([, a], [, b]) => b.planned - b.actual - (a.planned - a.actual))
      .slice(0, 3)
      .map(([name, data]) => ({
        name,
        savings: data.planned - data.actual,
        percentage: ((data.planned - data.actual) / data.planned) * 100,
      }));

    // Budget health score
    const categoriesOnTrack = Object.values(budgetData).filter(
      data =>
        data.planned > 0 &&
        Math.abs(data.actual - data.planned) / data.planned <= 0.1,
    ).length;
    const totalCategories = Object.keys(budgetData).filter(
      key => budgetData[key].planned > 0,
    ).length;
    const healthScore =
      totalCategories > 0 ? (categoriesOnTrack / totalCategories) * 100 : 0;

    return {
      totalExpenses,
      totalIncome,
      totalBudgeted,
      totalActual,
      budgetVariance,
      budgetUtilization,
      overBudgetCategories,
      underBudgetCategories,
      healthScore,
      savingsRate:
        totalIncome > 0
          ? ((totalIncome - totalExpenses) / totalIncome) * 100
          : 0,
      daysInMonth: moment()
        .year(selectedYear)
        .month(selectedMonth - 1)
        .daysInMonth(),
      daysPassed: Math.min(
        moment().date(),
        moment()
          .year(selectedYear)
          .month(selectedMonth - 1)
          .daysInMonth(),
      ),
    };
  }, [expenses, income, budgetData, selectedMonth, selectedYear]);

  const chartData = useMemo(() => {
    if (Object.keys(budgetData).length === 0) return [];

    const colors = [
      SUCCESS_GREEN,
      ERROR_RED,
      ELECTRIC_BLUE,
      TEAL_BLUE,
      '#FF6B6B',
    ];

    return Object.entries(budgetData)
      .filter(([, data]) => data.actual > 0)
      .sort(([, a], [, b]) => b.actual - a.actual)
      .slice(0, 5)
      .map(([name, data], index) => ({
        name,
        amount: data.actual,
        color: colors[index % colors.length],
        legendFontColor: PRIMARY_TEXT,
        legendFontSize: 10,
      }));
  }, [budgetData]);

  const getBudgetHealthColor = (score: number) => {
    if (score >= 80) return SUCCESS_GREEN;
    if (score >= 60) return '#FFA500';
    if (score >= 40) return '#FF6B6B';
    return ERROR_RED;
  };

  const getBudgetHealthText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization <= 90) return SUCCESS_GREEN;
    if (utilization <= 100) return '#FFA500';
    if (utilization <= 110) return '#FF6B6B';
    return ERROR_RED;
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => rootNavigate('Analytics', 'navigate')}>
      <View style={styles.header}>
        <Text variant="h3" style={styles.title}>
          Budget Analytics
        </Text>
        <Text style={styles.viewMore}>Tap for detailed analytics →</Text>
      </View>

      {/* Budget Health Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Budget Health</Text>
          <Text
            style={{
              ...styles.statValue,
              color: getBudgetHealthColor(budgetAnalytics.healthScore),
            }}>
            {budgetAnalytics.healthScore.toFixed(0)}%
          </Text>
          <Text style={styles.statSubtext}>
            {getBudgetHealthText(budgetAnalytics.healthScore)}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Budget Used</Text>
          <Text
            style={{
              ...styles.statValue,
              color: getUtilizationColor(budgetAnalytics.budgetUtilization),
            }}>
            {budgetAnalytics.budgetUtilization.toFixed(0)}%
          </Text>
          <Text style={styles.statSubtext}>
            {budgetAnalytics.budgetVariance >= 0
              ? 'Under Budget'
              : 'Over Budget'}
          </Text>
        </View>
      </View>

      {/* Mini Chart */}
      {chartData.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Spending by Category</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={chartData}
              width={screenWidth - 80}
              height={120}
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
                  {item.name.length > 8
                    ? `${item.name.slice(0, 8)}...`
                    : item.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Budget Insights */}
      <View style={styles.insightsSection}>
        <Text style={styles.insightTitle}>Budget Insights:</Text>
        <View style={styles.insights}>
          <Text style={styles.insight}>
            📊 {formatToINR(Math.abs(budgetAnalytics.budgetVariance))}{' '}
            {budgetAnalytics.budgetVariance >= 0 ? 'remaining' : 'over budget'}
          </Text>

          {budgetAnalytics.overBudgetCategories.length > 0 && (
            <Text style={styles.insight}>
              🚨 {budgetAnalytics.overBudgetCategories[0].name} is{' '}
              {budgetAnalytics.overBudgetCategories[0].percentage.toFixed(0)}%
              over budget
            </Text>
          )}

          {budgetAnalytics.underBudgetCategories.length > 0 && (
            <Text style={styles.insight}>
              💡 {formatToINR(budgetAnalytics.underBudgetCategories[0].savings)}{' '}
              saved in {budgetAnalytics.underBudgetCategories[0].name}
            </Text>
          )}

          <Text style={styles.insight}>
            📅 Day {budgetAnalytics.daysPassed} of {budgetAnalytics.daysInMonth}{' '}
            -{' '}
            {(
              (budgetAnalytics.daysPassed / budgetAnalytics.daysInMonth) *
              100
            ).toFixed(0)}
            % through month
          </Text>
        </View>
      </View>

      {/* Progress Bar for Month */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Month Progress</Text>
          <Text style={styles.progressValue}>
            {budgetAnalytics.daysPassed}/{budgetAnalytics.daysInMonth} days
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  (budgetAnalytics.daysPassed / budgetAnalytics.daysInMonth) *
                  100
                }%`,
                backgroundColor: ELECTRIC_BLUE,
              },
            ]}
          />
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
    textAlign: 'center',
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
    textAlign: 'center',
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
    justifyContent: 'center',
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
    textAlign: 'center',
  },
  insightsSection: {
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
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
  progressSection: {
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 8,
    padding: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    opacity: 0.7,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: PRIMARY_TEXT,
  },
  progressBar: {
    height: 6,
    backgroundColor: LIGHT_SLATE_GREY,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default BudgetAnalyticsPreview;
