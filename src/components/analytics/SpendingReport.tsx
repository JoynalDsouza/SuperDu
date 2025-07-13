import React, {useMemo, useState} from 'react';
import {View, StyleSheet, ScrollView, Share} from 'react-native';
import {useQuery} from '@realm/react';
import {Transaction} from '../../realm/models/Account';
import Text from '../common/Text';
import Button from '../common/Button';
import {
  PRIMARY_BACKGROUND,
  SECONDARY_BACKGROUND,
  PRIMARY_TEXT,
  SUCCESS_GREEN,
  ERROR_RED,
  ELECTRIC_BLUE,
} from '../../design/theme';
import moment from 'moment';
import {formatToINR} from '../../utils/formatCurrency';
import ModalBase from '../base/ModalBase';

interface SpendingReportProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  startDate: Date;
  endDate: Date;
}

const SpendingReport: React.FC<SpendingReportProps> = ({
  visible,
  setVisible,
  startDate,
  endDate,
}) => {
  const allTransactions = useQuery(Transaction);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filtered(
      'addedOn >= $0 && addedOn <= $1',
      startDate,
      endDate,
    );
  }, [allTransactions, startDate, endDate]);

  const reportData = useMemo(() => {
    const expenses = filteredTransactions.filtered('type == "EXPENSE"');
    const income = filteredTransactions.filtered('type == "INCOME"');
    const investments = filteredTransactions.filtered('type == "INVESTMENT"');
    const lendings = filteredTransactions.filtered('type == "LENDING"');

    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalInvestments = investments.reduce((sum, t) => sum + t.amount, 0);
    const totalLendings = lendings.reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryBreakdown: {[key: string]: {amount: number; count: number}} =
      {};
    expenses.forEach(expense => {
      const categoryName = expense.category.name;
      if (!categoryBreakdown[categoryName]) {
        categoryBreakdown[categoryName] = {amount: 0, count: 0};
      }
      categoryBreakdown[categoryName].amount += expense.amount;
      categoryBreakdown[categoryName].count += 1;
    });

    const sortedCategories = Object.entries(categoryBreakdown).sort(
      ([, a], [, b]) => b.amount - a.amount,
    );

    // Daily analysis
    const dayExpenses: {[key: string]: number} = {};
    expenses.forEach(expense => {
      const day = moment(expense.addedOn).format('YYYY-MM-DD');
      dayExpenses[day] = (dayExpenses[day] || 0) + expense.amount;
    });

    const expenseDays = Object.keys(dayExpenses).length;
    const totalDays = moment(endDate).diff(moment(startDate), 'days') + 1;
    const avgDailyExpense = totalExpenses / totalDays;
    const maxDailyExpense = Math.max(...Object.values(dayExpenses), 0);
    const minDailyExpense = Math.min(
      ...Object.values(dayExpenses).filter(x => x > 0),
      0,
    );

    // Weekly patterns
    const weekdayExpenses = Array(7).fill(0);
    expenses.forEach(expense => {
      const dayOfWeek = moment(expense.addedOn).day();
      weekdayExpenses[dayOfWeek] += expense.amount;
    });

    const maxWeekday = weekdayExpenses.indexOf(Math.max(...weekdayExpenses));
    const weekdayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    // Monthly comparison (if period spans multiple months)
    const monthlyData: {[key: string]: number} = {};
    expenses.forEach(expense => {
      const month = moment(expense.addedOn).format('YYYY-MM');
      monthlyData[month] = (monthlyData[month] || 0) + expense.amount;
    });

    return {
      totalExpenses,
      totalIncome,
      totalInvestments,
      totalLendings,
      netIncome: totalIncome - totalExpenses - totalInvestments - totalLendings,
      savingsRate:
        totalIncome > 0
          ? ((totalIncome - totalExpenses) / totalIncome) * 100
          : 0,
      categoryBreakdown: sortedCategories,
      transactionCounts: {
        total: filteredTransactions.length,
        expenses: expenses.length,
        income: income.length,
        investments: investments.length,
        lendings: lendings.length,
      },
      dailyStats: {
        avgDailyExpense,
        maxDailyExpense,
        minDailyExpense,
        expenseDays,
        totalDays,
        spendingFrequency: (expenseDays / totalDays) * 100,
      },
      weeklyPattern: {
        maxWeekday: weekdayNames[maxWeekday],
        weekdayExpenses,
      },
      monthlyData: Object.entries(monthlyData),
    };
  }, [filteredTransactions, startDate, endDate]);

  const generateReportText = () => {
    const period = `${moment(startDate).format('MMM DD, YYYY')} - ${moment(
      endDate,
    ).format('MMM DD, YYYY')}`;

    return `
🧾 EXPENSE TRACKER REPORT
📅 Period: ${period}

💰 FINANCIAL SUMMARY
• Total Income: ${formatToINR(reportData.totalIncome)}
• Total Expenses: ${formatToINR(reportData.totalExpenses)}
• Total Investments: ${formatToINR(reportData.totalInvestments)}
• Total Lendings: ${formatToINR(reportData.totalLendings)}
• Net Income: ${formatToINR(reportData.netIncome)}
• Savings Rate: ${reportData.savingsRate.toFixed(1)}%

📊 TRANSACTION SUMMARY
• Total Transactions: ${reportData.transactionCounts.total}
• Expense Transactions: ${reportData.transactionCounts.expenses}
• Income Transactions: ${reportData.transactionCounts.income}

📈 SPENDING ANALYSIS
• Average Daily Expense: ${formatToINR(reportData.dailyStats.avgDailyExpense)}
• Maximum Daily Expense: ${formatToINR(reportData.dailyStats.maxDailyExpense)}
• Days with Expenses: ${reportData.dailyStats.expenseDays}/${
      reportData.dailyStats.totalDays
    }
• Spending Frequency: ${reportData.dailyStats.spendingFrequency.toFixed(1)}%
• Peak Spending Day: ${reportData.weeklyPattern.maxWeekday}

🏷️ TOP EXPENSE CATEGORIES
${reportData.categoryBreakdown
  .slice(0, 5)
  .map(
    ([name, data], index) =>
      `${index + 1}. ${name}: ${formatToINR(data.amount)} (${
        data.count
      } transactions)`,
  )
  .join('\n')}

Generated by SuperDu Expense Tracker
    `;
  };

  const shareReport = async () => {
    try {
      const reportText = generateReportText();
      await Share.share({
        message: reportText,
        title: 'Expense Report',
      });
    } catch (error) {
      console.error('Error sharing report:', error);
    }
  };

  return (
    <ModalBase
      visible={visible}
      setVisible={setVisible}
      onRequestClose={() => setVisible(false)}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text variant="h2" style={styles.title}>
          Detailed Spending Report
        </Text>

        <Text style={styles.period}>
          {moment(startDate).format('MMM DD, YYYY')} -{' '}
          {moment(endDate).format('MMM DD, YYYY')}
        </Text>

        {/* Financial Summary */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Financial Summary
          </Text>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Income</Text>
              <Text style={{...styles.summaryValue, color: SUCCESS_GREEN}}>
                {formatToINR(reportData.totalIncome)}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={{...styles.summaryValue, color: ERROR_RED}}>
                {formatToINR(reportData.totalExpenses)}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Net Income</Text>
              <Text
                style={{
                  ...styles.summaryValue,
                  color: reportData.netIncome >= 0 ? SUCCESS_GREEN : ERROR_RED,
                }}>
                {formatToINR(reportData.netIncome)}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Savings Rate</Text>
              <Text
                style={{
                  ...styles.summaryValue,
                  color:
                    reportData.savingsRate > 20
                      ? SUCCESS_GREEN
                      : reportData.savingsRate > 0
                      ? '#FFA500'
                      : ERROR_RED,
                }}>
                {reportData.savingsRate.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Spending Analysis */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Spending Analysis
          </Text>

          <View style={styles.analysisGrid}>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>Avg Daily Expense</Text>
              <Text style={styles.analysisValue}>
                {formatToINR(reportData.dailyStats.avgDailyExpense)}
              </Text>
            </View>

            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>Max Daily Expense</Text>
              <Text style={styles.analysisValue}>
                {formatToINR(reportData.dailyStats.maxDailyExpense)}
              </Text>
            </View>

            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>Spending Frequency</Text>
              <Text style={styles.analysisValue}>
                {reportData.dailyStats.spendingFrequency.toFixed(0)}%
              </Text>
            </View>

            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>Peak Day</Text>
              <Text style={styles.analysisValue}>
                {reportData.weeklyPattern.maxWeekday}
              </Text>
            </View>
          </View>
        </View>

        {/* Top Categories */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Top Expense Categories
          </Text>

          {reportData.categoryBreakdown
            .slice(0, 5)
            .map(([name, data], index) => (
              <View key={name} style={styles.categoryItem}>
                <View style={styles.categoryRank}>
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{name}</Text>
                  <Text style={styles.categoryStats}>
                    {data.count} transactions •{' '}
                    {((data.amount / reportData.totalExpenses) * 100).toFixed(
                      1,
                    )}
                    %
                  </Text>
                </View>
                <Text style={styles.categoryAmount}>
                  {formatToINR(data.amount)}
                </Text>
              </View>
            ))}
        </View>

        {/* Transaction Summary */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Transaction Summary
          </Text>

          <View style={styles.transactionGrid}>
            <View style={styles.transactionItem}>
              <Text style={styles.transactionCount}>
                {reportData.transactionCounts.total}
              </Text>
              <Text style={styles.transactionLabel}>Total</Text>
            </View>
            <View style={styles.transactionItem}>
              <Text style={styles.transactionCount}>
                {reportData.transactionCounts.expenses}
              </Text>
              <Text style={styles.transactionLabel}>Expenses</Text>
            </View>
            <View style={styles.transactionItem}>
              <Text style={styles.transactionCount}>
                {reportData.transactionCounts.income}
              </Text>
              <Text style={styles.transactionLabel}>Income</Text>
            </View>
            <View style={styles.transactionItem}>
              <Text style={styles.transactionCount}>
                {reportData.transactionCounts.investments +
                  reportData.transactionCounts.lendings}
              </Text>
              <Text style={styles.transactionLabel}>Inv. & Lending</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Share Report"
            onPress={shareReport}
            style={styles.shareButton}
          />
          <Button
            title="Close"
            onPress={() => setVisible(false)}
            type="secondary"
            style={styles.closeButton}
          />
        </View>
      </ScrollView>
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_BACKGROUND,
  },
  title: {
    textAlign: 'center',
    color: PRIMARY_TEXT,
    marginBottom: 8,
  },
  period: {
    textAlign: 'center',
    color: PRIMARY_TEXT,
    opacity: 0.7,
    marginBottom: 24,
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
    backgroundColor: SECONDARY_BACKGROUND,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    color: PRIMARY_TEXT,
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    opacity: 0.7,
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  analysisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  analysisItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  analysisLabel: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    opacity: 0.7,
    marginBottom: 4,
    textAlign: 'center',
  },
  analysisValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PRIMARY_TEXT,
    textAlign: 'center',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  categoryRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: ELECTRIC_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PRIMARY_TEXT,
    textTransform: 'capitalize',
  },
  categoryStats: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    opacity: 0.7,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ERROR_RED,
  },
  transactionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionItem: {
    alignItems: 'center',
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 2,
  },
  transactionCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ELECTRIC_BLUE,
    marginBottom: 4,
  },
  transactionLabel: {
    fontSize: 11,
    color: PRIMARY_TEXT,
    opacity: 0.7,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  shareButton: {
    flex: 1,
  },
  closeButton: {
    flex: 1,
  },
});

export default SpendingReport;
