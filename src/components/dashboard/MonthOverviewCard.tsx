import {StyleSheet, View} from 'react-native';
import Text from '../common/Text';
import React, {useMemo} from 'react';
import {useQuery} from '@realm/react';
import {Transaction} from '../../realm/models/Account';
import moment from 'moment';
import {PRIMARY_TEXT} from '../../design/theme';
import {MONTHS} from '../../data/calendar';
import FinancialSummary from './FinancialSummary';
import {getOverviewStats} from '../../utils/transaction-utils';

type MonthOverviewCardProps = {
  selectedMonth: number;
  selectedYear: number;
};

const MonthOverviewCard: React.FC<MonthOverviewCardProps> = ({
  selectedMonth,
  selectedYear,
}) => {
  const startOfMonth = moment()
    .year(selectedYear)
    .month(selectedMonth - 1)
    .startOf('month');

  const endOfMonth = moment()
    .year(selectedYear)
    .month(selectedMonth - 1)
    .endOf('month');

  const Transactions = useQuery(Transaction)
    .filtered(
      'addedOn >= $0 && addedOn <= $1',
      startOfMonth.toDate(),
      endOfMonth.toDate(),
    )
    .sorted('addedOn', true);

  const {
    daysWithoutExpenses,
    totalIncome,
    totalExpense,
    totalLending,
    totalInvestment,
    totalBalance,
  } = useMemo(() => {
    return getOverviewStats(
      Transactions,
      startOfMonth.toDate(),
      endOfMonth.toDate(),
    );
  }, [Transactions?.length, selectedMonth, selectedYear]);

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
