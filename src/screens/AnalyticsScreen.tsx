import React, {useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
} from 'react-native';
import {useQuery} from '@realm/react';
import {Transaction, Category} from '../realm/models/Account';
import Text from '../components/common/Text';
import ScreenHeader from '../components/common/ScreenHeader';
import {
  PRIMARY_BACKGROUND,
  SECONDARY_BACKGROUND,
  PRIMARY_TEXT,
  SUCCESS_GREEN,
  ERROR_RED,
  ELECTRIC_BLUE,
  TEAL_BLUE,
} from '../design/theme';
import {getMonth, getYear} from '../utils/moment';
import moment from 'moment';
import ExpensesPieChart from '../components/analytics/ExpensesPieChart';
import SpendingTrendsChart from '../components/analytics/SpendingTrendsChart';
import CategoryAnalytics from '../components/analytics/CategoryAnalytics';
import MonthlyComparison from '../components/analytics/MonthlyComparison';
import SpendingInsights from '../components/analytics/SpendingInsights';
import ExpenseHeatmap from '../components/analytics/ExpenseHeatmap';
import BudgetGoals from '../components/analytics/BudgetGoals';
import SpendingReport from '../components/analytics/SpendingReport';
import CustomDropdownPicker from '../components/common/CustomDropdownPicker';
import {MONTHS} from '../utils/constants/Months';

const {width: screenWidth} = Dimensions.get('window');

const AnalyticsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
  const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()));
  const [showReport, setShowReport] = useState(false);

  const transactions = useQuery(Transaction).sorted('addedOn', true);
  const categories = useQuery(Category);

  // Period filtering logic
  const getDateRange = () => {
    const today = moment();
    switch (selectedPeriod) {
      case 'thisWeek':
        return {
          start: today.clone().startOf('week'),
          end: today.clone().endOf('week'),
        };
      case 'thisMonth':
        return {
          start: today.clone().startOf('month'),
          end: today.clone().endOf('month'),
        };
      case 'last3Months':
        return {
          start: today.clone().subtract(3, 'months').startOf('month'),
          end: today.clone().endOf('month'),
        };
      case 'thisYear':
        return {
          start: today.clone().startOf('year'),
          end: today.clone().endOf('year'),
        };
      case 'custom':
        return {
          start: moment()
            .year(Number(selectedYear))
            .month(Number(selectedMonth) - 1)
            .startOf('month'),
          end: moment()
            .year(Number(selectedYear))
            .month(Number(selectedMonth) - 1)
            .endOf('month'),
        };
      default:
        return {
          start: today.clone().startOf('month'),
          end: today.clone().endOf('month'),
        };
    }
  };

  const {start: startDate, end: endDate} = getDateRange();

  const filteredTransactions = useMemo(() => {
    return transactions.filtered(
      'addedOn >= $0 && addedOn <= $1',
      startDate.toDate(),
      endDate.toDate(),
    );
  }, [transactions, startDate, endDate]);

  const expenses = useMemo(() => {
    return filteredTransactions.filtered('type == "EXPENSE"');
  }, [filteredTransactions]);

  const income = useMemo(() => {
    return filteredTransactions.filtered('type == "INCOME"');
  }, [filteredTransactions]);

  const periodOptions = [
    {label: 'This Week', value: 'thisWeek'},
    {label: 'This Month', value: 'thisMonth'},
    {label: 'Last 3 Months', value: 'last3Months'},
    {label: 'This Year', value: 'thisYear'},
    {label: 'Custom', value: 'custom'},
  ];

  const yearOptions = Array.from({length: 10}, (_, i) => {
    const year = new Date().getFullYear() - 5 + i;
    return {name: year.toString(), value: year};
  });

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Analytics & Insights"
        rightIcons={[
          {
            icon: '📊',
            onPress: () => setShowReport(true),
          },
        ]}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <Text variant="h3" style={styles.sectionTitle}>
            Analysis Period
          </Text>
          <View style={styles.periodButtons}>
            {periodOptions.map(option => (
              <Pressable
                key={option.value}
                style={[
                  styles.periodButton,
                  selectedPeriod === option.value && styles.activePeriodButton,
                ]}
                onPress={() => setSelectedPeriod(option.value)}>
                <Text
                  style={{
                    ...styles.periodButtonText,
                    ...(selectedPeriod === option.value
                      ? styles.activePeriodButtonText
                      : {}),
                  }}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {selectedPeriod === 'custom' && (
            <View style={styles.customPeriodSelector}>
              <View style={styles.customPeriodRow}>
                <View style={{flex: 2}}>
                  <Text>Month</Text>
                  <CustomDropdownPicker
                    items={MONTHS}
                    value={selectedMonth}
                    setValue={item => setSelectedMonth(item.value)}
                    placeholder="Select Month"
                  />
                </View>
                <View style={{flex: 1, marginLeft: 10}}>
                  <Text>Year</Text>
                  <CustomDropdownPicker
                    items={yearOptions}
                    value={selectedYear}
                    setValue={item => setSelectedYear(item.value)}
                    valueField="value"
                    placeholder="Year"
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <Text variant="h3" style={styles.sectionTitle}>
            Quick Overview
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text variant="caption">Total Expenses</Text>
              <Text variant="h2" style={{color: ERROR_RED}}>
                ₹
                {expenses
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text variant="caption">Total Income</Text>
              <Text variant="h2" style={{color: SUCCESS_GREEN}}>
                ₹{income.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text variant="caption">Transactions</Text>
              <Text variant="h2">{filteredTransactions.length}</Text>
            </View>
            <View style={styles.statCard}>
              <Text variant="caption">Categories Used</Text>
              <Text variant="h2">
                {new Set(expenses.map(t => t.category.name)).size}
              </Text>
            </View>
          </View>
        </View>

        {/* Expenses Breakdown */}
        <ExpensesPieChart expenses={expenses} />

        {/* Spending Trends */}
        <SpendingTrendsChart transactions={filteredTransactions} />

        {/* Category Analytics */}
        <CategoryAnalytics expenses={expenses} categories={categories} />

        {/* Monthly Comparison */}
        <MonthlyComparison transactions={transactions} />

        {/* Budget Goals */}
        <BudgetGoals expenses={expenses} income={income} />

        {/* Spending Insights */}
        <SpendingInsights
          expenses={expenses}
          income={income}
          startDate={startDate}
          endDate={endDate}
        />

        {/* Expense Heatmap */}
        <ExpenseHeatmap expenses={expenses} />
      </ScrollView>

      {/* Spending Report Modal */}
      <SpendingReport
        visible={showReport}
        setVisible={setShowReport}
        startDate={startDate.toDate()}
        endDate={endDate.toDate()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_BACKGROUND,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  periodSelector: {
    marginBottom: 20,
    backgroundColor: SECONDARY_BACKGROUND,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    color: PRIMARY_TEXT,
  },
  periodButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: PRIMARY_BACKGROUND,
    borderWidth: 1,
    borderColor: ELECTRIC_BLUE,
  },
  activePeriodButton: {
    backgroundColor: ELECTRIC_BLUE,
  },
  periodButtonText: {
    fontSize: 12,
    color: PRIMARY_TEXT,
  },
  activePeriodButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  customPeriodSelector: {
    marginTop: 16,
  },
  customPeriodRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  quickStats: {
    marginBottom: 20,
    backgroundColor: SECONDARY_BACKGROUND,
    borderRadius: 12,
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
});

export default AnalyticsScreen;
