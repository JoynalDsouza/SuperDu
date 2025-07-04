import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  ELECTRIC_BLUE,
  ERROR_RED,
  LIGHT_SLATE_GREY,
  SECONDARY_BACKGROUND,
} from '../../design/theme';
import Text from '../../components/common/Text';
import {formatToINR} from '../../utils/formatCurrency';

interface FinancialSummaryProps {
  daysWithoutExpenses: number;
  totalIncome: number;
  totalExpense: number;
  totalLending: number;
  totalInvestment: number;
  totalBalance: number;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  daysWithoutExpenses,
  totalIncome,
  totalExpense,
  totalLending,
  totalInvestment,
  totalBalance,
}) => {
  const expensePercentage = totalIncome
    ? (totalExpense / totalIncome) * 100
    : 0;
  const lendingPercentage = totalIncome
    ? (totalLending / totalIncome) * 100
    : 0;
  const investmentPercentage = totalIncome
    ? (totalInvestment / totalIncome) * 100
    : 0;
  const balancePercentage = totalIncome
    ? (totalBalance / totalIncome) * 100
    : 0;

  return (
    <View style={styles.section}>
      <Text variant="h1">Days Without Expense: {daysWithoutExpenses}</Text>

      <Text variant="b1">Total Income: {formatToINR(totalIncome)}</Text>

      <Text variant="b1">
        Total Expenses: {formatToINR(totalExpense)} -{' '}
        {expensePercentage.toFixed(2)}%
      </Text>

      <Text variant="b1">
        Total Lendings: {formatToINR(totalLending)} -{' '}
        {lendingPercentage.toFixed(2)}%
      </Text>

      <Text variant="b1">
        Total Investments: {formatToINR(totalInvestment)} -{' '}
        {investmentPercentage.toFixed(2)}%
      </Text>

      <Text variant="b1">
        Balance: {formatToINR(totalBalance)} - {balancePercentage.toFixed(2)}%
      </Text>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressSegment,
            styles.expenseSegment,
            {
              width: `${expensePercentage}%`,
            },
          ]}
        />
        <View
          style={[
            styles.progressSegment,
            styles.lendingSegment,
            {width: `${lendingPercentage}%`},
          ]}
        />
        <View
          style={[
            styles.progressSegment,
            styles.investmentSegment,
            {width: `${investmentPercentage}%`},
          ]}
        />
      </View>

      <View style={styles.legendContainer}>
        {!!totalExpense && (
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.expenseSegment]} />
            <Text variant="caption">Expenses</Text>
          </View>
        )}
        {!!totalLending && (
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.lendingSegment]} />
            <Text variant="caption">Lendings</Text>
          </View>
        )}
        {!!totalInvestment && (
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.investmentSegment]} />
            <Text variant="caption">Investments</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default FinancialSummary;

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: SECONDARY_BACKGROUND,
    borderRadius: 12,
    shadowColor: LIGHT_SLATE_GREY,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  progressBar: {
    flexDirection: 'row',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 15,
    backgroundColor: LIGHT_SLATE_GREY,
  },
  progressSegment: {
    height: '100%',
  },
  expenseSegment: {
    backgroundColor: ERROR_RED,
  },
  lendingSegment: {
    backgroundColor: ELECTRIC_BLUE,
  },
  investmentSegment: {
    backgroundColor: ELECTRIC_BLUE,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
});
