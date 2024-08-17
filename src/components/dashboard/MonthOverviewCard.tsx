import {StyleSheet, View} from 'react-native';
import Text from '../common/Text';
import React, {useMemo} from 'react';
import {useQuery} from '@realm/react';
import {Transaction} from '../../realm/models/Account';
import moment from 'moment';
import {calculateDaysWithoutExpenses} from '../../utils/overview-utils';
import {PRIMARY_TEXT} from '../../design/theme';
import {MONTHS} from '../../data/calendar';
import FinancialSummary from './FinancialSummary';

type MonthOverviewCardProps = {
  selectedMonth: number;
  selectedYear: number;
};

const MonthOverviewCard: React.FC<MonthOverviewCardProps> = ({
  selectedMonth,
  selectedYear,
}) => {
  const EXPENSES = useQuery(Transaction).filtered('type == "EXPENSE"');
  const INCOMES = useQuery(Transaction).filtered('type == "INCOME"');
  const LENDINGS = useQuery(Transaction).filtered('type == "LENDING"');
  const INVESTMENTS = useQuery(Transaction).filtered('type == "INVESTMENT"');

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
      (total, expense) => total + expense.amount,
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
    return filteredIncomes.reduce((total, income) => total + income.amount, 0);
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
      (total, lending) => total + lending.amount,
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
      (total, investment) => total + investment.amount,
      0,
    );
  }, [filteredInvestments]);

  const totalSpending = totalExpense + totalLending + totalInvestment;
  const totalBalance = totalIncome - totalSpending;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{MONTHS[selectedMonth]} Month Overview</Text>
      <FinancialSummary
        daysWithoutExpenses={daysWithoutExpenses}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        totalLending={totalLending}
        totalInvestment={totalInvestment}
        totalBalance={totalBalance}
      />
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
});
