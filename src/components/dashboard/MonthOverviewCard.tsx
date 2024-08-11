import {ScrollView, StyleSheet, View} from 'react-native';
import Text from '../common/Text';
import React, {useMemo} from 'react';
import {useObject, useQuery, useRealm} from '@realm/react';
import {
  Budget,
  Expense,
  Income,
  Investment,
  Lending,
} from '../../realm/models/Account';
import moment from 'moment';
import {calculateDaysWithoutExpenses} from '../../utils/overview-utils';
import {ExpenseType} from '../../realm/models/User';
import {
  ELECTRIC_BLUE,
  ERROR_RED,
  LIGHT_SLATE_GREY,
  PRIMARY_TEXT,
  SECONDARY_BACKGROUND,
  SUCCESS_GREEN,
  VIVID_ORANGE,
} from '../../design/theme';
import {MONTHS} from '../../data/calendar';

type MonthOverviewCardProps = {
  selectedMonth: number;
  selectedYear: number;
};

const MonthOverviewCard: React.FC<MonthOverviewCardProps> = ({
  selectedMonth,
  selectedYear,
}) => {
  const realm = useRealm();
  //   const selectedMonth = getMonth(new Date());
  //   const selectedYear = getYear(new Date());

  const EXPENSES = useQuery(Expense);
  const INCOMES = useQuery(Income);
  const LENDINGS = useQuery(Lending);
  const INVESTMENTS = useQuery(Investment);

  const EXPENSE_TYPES = realm.objects(ExpenseType);

  const expenseTypeMap = useMemo(() => {
    return EXPENSE_TYPES.reduce((acc, type) => {
      acc[type.name] = type;
      return acc;
    }, {});
  }, [EXPENSE_TYPES]);

  const BUDGET = useObject(Budget, `${selectedMonth}/${selectedYear}`);

  const startOfMonth = moment()
    .year(selectedYear)
    .month(selectedMonth - 1)
    .startOf('month');

  const endOfMonth = moment()
    .year(selectedYear)
    .month(selectedMonth - 1)
    .endOf('month');

  const filteredExpenses = useMemo(
    () =>
      EXPENSES.filtered(
        'addedOn >= $0 && addedOn <= $1',
        startOfMonth.toDate(),
        endOfMonth.toDate(),
      ),
    [EXPENSES, selectedMonth, selectedYear],
  );

  const expensesByDate = useMemo(() => {
    return filteredExpenses.reduce((acc, expense) => {
      const date = moment(expense.addedOn).format('YYYY-MM-DD');
      if (acc[date]) {
        acc[date] = [...acc[date], expense];
      } else {
        acc[date] = [expense];
      }
      return acc;
    }, {});
  }, [filteredExpenses]);

  const daysWithoutExpenses = calculateDaysWithoutExpenses(
    selectedMonth,
    selectedYear,
    Object.keys(expensesByDate).length,
  );

  const totalExpense = useMemo(() => {
    return filteredExpenses.reduce(
      (total, expense) => total + expense.value,
      0,
    );
  }, [filteredExpenses]);

  const filteredIncomes = useMemo(
    () =>
      INCOMES.filtered(
        'addedOn >= $0 && addedOn <= $1',
        startOfMonth.toDate(),
        endOfMonth.toDate(),
      ),
    [INCOMES, selectedMonth, selectedYear],
  );

  const totalIncome = useMemo(() => {
    return filteredIncomes.reduce((total, income) => total + income.value, 0);
  }, [filteredIncomes]);

  const filteredLendings = useMemo(
    () =>
      LENDINGS.filtered(
        'addedOn >= $0 && addedOn <= $1',
        startOfMonth.toDate(),
        endOfMonth.toDate(),
      ),
    [LENDINGS, selectedMonth, selectedYear],
  );

  const totalLending = useMemo(() => {
    return filteredLendings.reduce(
      (total, lending) => total + lending.value,
      0,
    );
  }, [filteredLendings]);

  const filteredInvestments = useMemo(
    () =>
      INVESTMENTS.filtered(
        'addedOn >= $0 && addedOn <= $1',
        startOfMonth.toDate(),
        endOfMonth.toDate(),
      ),
    [INVESTMENTS, selectedMonth, selectedYear],
  );

  const totalInvestment = useMemo(() => {
    return filteredInvestments.reduce(
      (total, investment) => total + investment.value,
      0,
    );
  }, [filteredInvestments]);

  const budget = BUDGET?.budget || [];

  const totalBudget = useMemo(() => {
    let total = 0;
    budget.forEach(b => {
      total += b.value;
    });
    return total;
  }, [budget]);
  const totalSpending = totalExpense + totalLending + totalInvestment;
  const totalBalance = totalIncome - totalSpending;

  const expensePercentage = (totalExpense / totalIncome) * 100;
  const lendingPercentage = (totalLending / totalIncome) * 100;
  const investmentPercentage = (totalInvestment / totalIncome) * 100;
  const budgetPercentage = (totalBudget / totalIncome) * 100;

  const balancePercentage = (totalBalance / totalIncome) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{MONTHS[selectedMonth]} Month Overview</Text>
      <View style={styles.section}>
        <Text variant="h1">Days Without Expense: {daysWithoutExpenses}</Text>

        <Text variant="b1">Total Income: ₹{totalIncome.toFixed(2)}</Text>

        <Text variant="b1">
          Total Expenses: ₹{totalExpense.toFixed(2)} -{' '}
          {expensePercentage.toFixed()}%
        </Text>

        <Text variant="b1">
          Total Lendings: ₹{totalLending.toFixed(2)} -{' '}
          {lendingPercentage.toFixed()}%
        </Text>
        <Text variant="b1">
          Total Investments: ₹{totalInvestment.toFixed(2)} -{' '}
          {investmentPercentage.toFixed()}%
        </Text>

        <Text variant="b1">
          Balance: ₹{totalBalance.toFixed(2)} - {balancePercentage.toFixed(2)}%
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
    </View>
  );
};

export default MonthOverviewCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: PRIMARY_TEXT,
  },
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
    backgroundColor: SUCCESS_GREEN,
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
