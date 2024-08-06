import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {formatToINR} from '../../utils/formatCurrency';

const OverviewStatsCard = ({
  daysWithoutExpense,
  spending,
  totalIncome,
  totalExpense,
  savings,
}) => {
  const expensePercentage = (totalExpense / totalIncome) * 100;
  const savingsPercentage = (savings / totalIncome) * 100;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Days Without Expense: {daysWithoutExpense}
      </Text>
      <Text style={styles.data}>
        Total Expense: {formatToINR(totalExpense)} -{' '}
        {expensePercentage.toFixed(2)}%
      </Text>
      <Text style={styles.data}>Total Income: {formatToINR(totalIncome)}</Text>
      <Text style={styles.data}>
        Savings: {formatToINR(savings)} - {savingsPercentage.toFixed(2)}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    margin: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  data: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default OverviewStatsCard;
