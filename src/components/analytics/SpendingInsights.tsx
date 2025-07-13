import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
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
import moment, {Moment} from 'moment';

interface SpendingInsightsProps {
  expenses: Results<Transaction>;
  income: Results<Transaction>;
  startDate: Moment;
  endDate: Moment;
}

const SpendingInsights: React.FC<SpendingInsightsProps> = ({
  expenses,
  income,
  startDate,
  endDate,
}) => {
  const insights = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, expense) => {
      return sum + (expense?.amount || 0);
    }, 0);
    const totalIncome = income.reduce((sum, inc) => {
      return sum + (inc?.amount || 0);
    }, 0);

    // Day of week analysis
    const dayOfWeekExpenses: {[key: number]: number} = {};
    expenses.forEach(expense => {
      if (expense?.addedOn && expense?.amount != null) {
        const dayOfWeek = moment(expense.addedOn).day(); // 0 = Sunday, 6 = Saturday
        dayOfWeekExpenses[dayOfWeek] =
          (dayOfWeekExpenses[dayOfWeek] || 0) + expense.amount;
      }
    });

    const maxExpenseDay = Object.entries(dayOfWeekExpenses).reduce(
      (max, [day, amount]) =>
        amount > max.amount ? {day: parseInt(day), amount} : max,
      {day: 0, amount: 0},
    );

    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    // Time of day analysis
    const timeOfDayExpenses: {
      morning: number;
      afternoon: number;
      evening: number;
      night: number;
    } = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    };

    expenses.forEach(expense => {
      if (expense?.addedOn && expense?.amount != null) {
        const hour = moment(expense.addedOn).hour();
        if (hour >= 6 && hour < 12) timeOfDayExpenses.morning += expense.amount;
        else if (hour >= 12 && hour < 17)
          timeOfDayExpenses.afternoon += expense.amount;
        else if (hour >= 17 && hour < 22)
          timeOfDayExpenses.evening += expense.amount;
        else timeOfDayExpenses.night += expense.amount;
      }
    });

    const maxTimeOfDay = Object.entries(timeOfDayExpenses).reduce(
      (max, [time, amount]) => (amount > max.amount ? {time, amount} : max),
      {time: 'morning', amount: 0},
    );

    // Average transaction size
    const avgTransactionSize =
      expenses.length > 0 ? totalExpenses / expenses.length : 0;

    // Largest expense
    const largestExpense =
      expenses.length > 0
        ? expenses.reduce((max, expense) => {
            if (!expense?.amount || !max?.amount) return max || expense;
            return expense.amount > max.amount ? expense : max;
          }, expenses[0])
        : null;

    // Days in period
    const daysInPeriod = endDate.diff(startDate, 'days') + 1;
    const dailyAverage = totalExpenses / daysInPeriod;

    // Savings rate
    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Spending frequency
    const spendingDays = new Set(
      expenses
        .filter(expense => expense?.addedOn)
        .map(expense => moment(expense.addedOn).format('YYYY-MM-DD')),
    ).size;
    const spendingFrequency = (spendingDays / daysInPeriod) * 100;

    return {
      totalExpenses,
      totalIncome,
      maxExpenseDay: dayNames[maxExpenseDay.day],
      maxExpenseDayAmount: maxExpenseDay.amount,
      maxTimeOfDay: maxTimeOfDay.time,
      maxTimeOfDayAmount: maxTimeOfDay.amount,
      avgTransactionSize,
      largestExpense,
      dailyAverage,
      savingsRate,
      spendingFrequency,
      daysInPeriod,
      spendingDays,
    };
  }, [expenses, income, startDate, endDate]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'negative':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return '📊';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return SUCCESS_GREEN;
      case 'warning':
        return '#FFA500';
      case 'negative':
        return ERROR_RED;
      default:
        return PRIMARY_TEXT;
    }
  };

  const generateInsights = () => {
    const insightsList = [];

    // Savings rate insight
    if (insights.savingsRate > 20) {
      insightsList.push({
        type: 'positive',
        title: 'Great Savings Rate!',
        description: `You're saving ${insights.savingsRate.toFixed(
          1,
        )}% of your income. Keep it up!`,
      });
    } else if (insights.savingsRate > 0) {
      insightsList.push({
        type: 'warning',
        title: 'Moderate Savings',
        description: `You're saving ${insights.savingsRate.toFixed(
          1,
        )}% of your income. Try to increase to 20%+.`,
      });
    } else {
      insightsList.push({
        type: 'negative',
        title: 'No Savings',
        description:
          "You're spending more than you earn. Consider reducing expenses.",
      });
    }

    // Spending frequency insight
    if (insights.spendingFrequency > 80) {
      insightsList.push({
        type: 'warning',
        title: 'High Spending Frequency',
        description: `You spend money ${insights.spendingFrequency.toFixed(
          0,
        )}% of days. Try having more no-spend days.`,
      });
    } else if (insights.spendingFrequency < 30) {
      insightsList.push({
        type: 'positive',
        title: 'Controlled Spending',
        description: `You only spend on ${insights.spendingFrequency.toFixed(
          0,
        )}% of days. Great self-control!`,
      });
    }

    // Day of week insight
    if (insights.maxExpenseDayAmount > 0) {
      insightsList.push({
        type: 'info',
        title: 'Peak Spending Day',
        description: `You spend most on ${
          insights.maxExpenseDay
        }s (₹${insights.maxExpenseDayAmount.toFixed(0)}).`,
      });
    }

    // Time of day insight
    if (insights.maxTimeOfDayAmount > 0) {
      insightsList.push({
        type: 'info',
        title: 'Peak Spending Time',
        description: `Most expenses happen in the ${
          insights.maxTimeOfDay
        } (₹${insights.maxTimeOfDayAmount.toFixed(0)}).`,
      });
    }

    // Large transaction insight
    if (
      insights.largestExpense &&
      insights.largestExpense.amount &&
      insights.largestExpense.category &&
      insights.largestExpense.amount > insights.avgTransactionSize * 3
    ) {
      insightsList.push({
        type: 'warning',
        title: 'Large Transaction Alert',
        description: `Your largest expense was ₹${insights.largestExpense.amount.toFixed(
          0,
        )} in ${insights.largestExpense.category.name}.`,
      });
    }

    return insightsList;
  };

  const insightsList = generateInsights();

  if (expenses.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="h3" style={styles.title}>
          Spending Insights
        </Text>
        <View style={styles.emptyState}>
          <Text>No expenses found for insights</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        Spending Insights
      </Text>

      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Daily Average</Text>
          <Text style={styles.metricValue}>
            ₹{insights.dailyAverage.toFixed(0)}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Avg Transaction</Text>
          <Text style={styles.metricValue}>
            ₹{insights.avgTransactionSize.toFixed(0)}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Spending Days</Text>
          <Text style={styles.metricValue}>
            {insights.spendingDays}/{insights.daysInPeriod}
          </Text>
        </View>
      </View>

      {/* Insights List */}
      <View style={styles.insightsContainer}>
        {insightsList.map((insight, index) => (
          <View key={index} style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightIcon}>
                {getInsightIcon(insight.type)}
              </Text>
              <Text
                style={{
                  ...styles.insightTitle,
                  color: getInsightColor(insight.type),
                }}>
                {insight.title}
              </Text>
            </View>
            <Text style={styles.insightDescription}>{insight.description}</Text>
          </View>
        ))}
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
  metricsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PRIMARY_TEXT,
    textAlign: 'center',
  },
  insightsContainer: {
    gap: 8,
  },
  insightCard: {
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 8,
    padding: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  insightIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  insightDescription: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    opacity: 0.8,
    lineHeight: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SpendingInsights;
