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
  LIGHT_SLATE_GREY,
} from '../../design/theme';
import {Results} from 'realm';
import {Transaction} from '../../realm/models/Account';
import {formatToINR} from '../../utils/formatCurrency';

interface BudgetGoalsProps {
  expenses: Results<Transaction>;
  income: Results<Transaction>;
}

const BudgetGoals: React.FC<BudgetGoalsProps> = ({expenses, income}) => {
  const goalData = useMemo(() => {
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + (expense?.amount || 0),
      0,
    );
    const totalIncome = income.reduce(
      (sum, inc) => sum + (inc?.amount || 0),
      0,
    );

    // Define realistic financial goals
    const goals = [
      {
        id: 'savings_rate',
        title: 'Savings Rate Goal',
        description: 'Save 20% of income',
        targetPercentage: 20,
        currentValue:
          totalIncome > 0
            ? ((totalIncome - totalExpenses) / totalIncome) * 100
            : 0,
        isPercentage: true,
        color: SUCCESS_GREEN,
      },
      {
        id: 'emergency_fund',
        title: 'Emergency Fund',
        description: '6 months of expenses',
        targetValue: totalExpenses * 6,
        currentValue: Math.max(0, totalIncome - totalExpenses) * 3, // Simplified calculation
        isPercentage: false,
        color: ELECTRIC_BLUE,
      },
      {
        id: 'expense_limit',
        title: 'Monthly Expense Limit',
        description: 'Keep expenses under 80% of income',
        targetPercentage: 80,
        currentValue: totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0,
        isPercentage: true,
        reverse: true, // Lower is better
        color: ERROR_RED,
      },
    ];

    return goals.map(goal => {
      let progress = 0;
      let status: 'excellent' | 'good' | 'warning' | 'poor' = 'poor';

      if (goal.isPercentage) {
        const target = goal.targetPercentage || 100;
        if (goal.reverse) {
          progress = Math.min(
            100,
            (target / Math.max(goal.currentValue, 1)) * 100,
          );
          if (goal.currentValue <= target * 0.8) status = 'excellent';
          else if (goal.currentValue <= target) status = 'good';
          else if (goal.currentValue <= target * 1.2) status = 'warning';
          else status = 'poor';
        } else {
          progress = Math.min(100, (goal.currentValue / target) * 100);
          if (goal.currentValue >= target) status = 'excellent';
          else if (goal.currentValue >= target * 0.8) status = 'good';
          else if (goal.currentValue >= target * 0.5) status = 'warning';
          else status = 'poor';
        }
      } else {
        const target = goal.targetValue || 1;
        progress = Math.min(100, (goal.currentValue / target) * 100);
        if (goal.currentValue >= target) status = 'excellent';
        else if (goal.currentValue >= target * 0.8) status = 'good';
        else if (goal.currentValue >= target * 0.5) status = 'warning';
        else status = 'poor';
      }

      return {
        ...goal,
        progress,
        status,
      };
    });
  }, [expenses, income]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return SUCCESS_GREEN;
      case 'good':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'poor':
        return ERROR_RED;
      default:
        return LIGHT_SLATE_GREY;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'Excellent! 🎉';
      case 'good':
        return 'Good 👍';
      case 'warning':
        return 'Needs attention ⚠️';
      case 'poor':
        return 'Needs improvement 🚨';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return '🎯';
      case 'good':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'poor':
        return '🚨';
      default:
        return '❓';
    }
  };

  if (expenses.length === 0 && income.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="h3" style={styles.title}>
          Financial Goals
        </Text>
        <View style={styles.emptyState}>
          <Text>Add some transactions to see your financial goals</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        Financial Goals & Progress
      </Text>

      <Text style={styles.subtitle}>
        Track your progress towards key financial milestones
      </Text>

      {goalData.map((goal, index) => (
        <View key={goal.id} style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.goalTitleSection}>
              <Text style={styles.goalIcon}>{getStatusIcon(goal.status)}</Text>
              <View>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalDescription}>{goal.description}</Text>
              </View>
            </View>
            <View style={styles.goalStatus}>
              <Text
                style={{
                  ...styles.statusText,
                  color: getStatusColor(goal.status),
                }}>
                {getStatusText(goal.status)}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(100, goal.progress)}%`,
                    backgroundColor: getStatusColor(goal.status),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{goal.progress.toFixed(0)}%</Text>
          </View>

          {/* Current vs Target */}
          <View style={styles.valuesSection}>
            <View style={styles.valueItem}>
              <Text style={styles.valueLabel}>Current</Text>
              <Text style={styles.valueText}>
                {goal.isPercentage
                  ? `${goal.currentValue.toFixed(1)}%`
                  : formatToINR(goal.currentValue)}
              </Text>
            </View>
            <View style={styles.valueItem}>
              <Text style={styles.valueLabel}>Target</Text>
              <Text style={styles.valueText}>
                {goal.isPercentage
                  ? `${goal.targetPercentage}%`
                  : formatToINR(goal.targetValue || 0)}
              </Text>
            </View>
          </View>

          {/* Goal-specific advice */}
          <View style={styles.adviceSection}>
            {goal.id === 'savings_rate' && goal.currentValue < 20 && (
              <Text style={styles.adviceText}>
                💡 Try to reduce expenses or increase income to reach 20%
                savings rate
              </Text>
            )}
            {goal.id === 'expense_limit' && goal.currentValue > 80 && (
              <Text style={styles.adviceText}>
                💡 Consider reviewing your biggest expense categories
              </Text>
            )}
            {goal.id === 'emergency_fund' && goal.progress < 50 && (
              <Text style={styles.adviceText}>
                💡 Start building your emergency fund gradually each month
              </Text>
            )}
          </View>
        </View>
      ))}

      {/* Overall Financial Health */}
      <View style={styles.overallHealth}>
        <Text style={styles.healthTitle}>Overall Financial Health</Text>
        <View style={styles.healthScore}>
          <Text style={styles.healthScoreText}>
            {Math.round(
              goalData.reduce((sum, goal) => sum + goal.progress, 0) /
                goalData.length,
            )}
            %
          </Text>
          <Text style={styles.healthScoreLabel}>Health Score</Text>
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
  goalCard: {
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_TEXT,
    marginBottom: 2,
  },
  goalDescription: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    opacity: 0.7,
  },
  goalStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: LIGHT_SLATE_GREY,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: PRIMARY_TEXT,
    minWidth: 35,
    textAlign: 'right',
  },
  valuesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  valueItem: {
    flex: 1,
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    opacity: 0.7,
    marginBottom: 2,
  },
  valueText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PRIMARY_TEXT,
  },
  adviceSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: LIGHT_SLATE_GREY,
  },
  adviceText: {
    fontSize: 11,
    color: PRIMARY_TEXT,
    opacity: 0.8,
    lineHeight: 16,
  },
  overallHealth: {
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  healthTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PRIMARY_TEXT,
    marginBottom: 8,
  },
  healthScore: {
    alignItems: 'center',
  },
  healthScoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: ELECTRIC_BLUE,
  },
  healthScoreLabel: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    opacity: 0.7,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BudgetGoals;
