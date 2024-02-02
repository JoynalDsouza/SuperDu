import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, BackHandler} from 'react-native';
import moment from 'moment';
import {getMonth, getYear, getYearsBetween} from '../utils/moment';
import {useQuery} from '@realm/react';
import {Expense, Income, Investment, Lending} from '../realm/models/Account';
import {MONTHS} from '../utils/constants/Months';
import CustomDropdownPicker from '../components/common/CustomDropdownPicker';
import {User} from '../realm/models/User';

const Overview = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()));
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));

  const user = useQuery(User)[0];

  const YEARS = getYearsBetween(new Date(user.createdOn), new Date());

  const EXPENSES = useQuery(Expense);
  const INCOMES = useQuery(Income);
  const LENDINGS = useQuery(Lending);
  const INVESTMENTS = useQuery(Investment);

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
  });

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
  });

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
  });

  useEffect(() => {
    const backAction = () => {
      if (showDatePicker) {
        setShowDatePicker(false);
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [showDatePicker]);

  return (
    <View>
      <View style={{flexDirection: 'row', gap: 10, height: 300}}>
        <View style={{flex: 2}}>
          <Text>Select Month</Text>
          <CustomDropdownPicker
            items={MONTHS}
            value={selectedMonth}
            setValue={item => setSelectedMonth(item.value)}
            schema={{
              label: 'name',
              value: 'value',
            }}
            placeholder="Select Month"></CustomDropdownPicker>
        </View>

        <View style={{flex: 1}}>
          <Text>Select Year</Text>
          <CustomDropdownPicker
            items={YEARS}
            value={selectedYear}
            setValue={item => {
              setSelectedYear(item.name);
            }}
            schema={{
              label: 'name',
              value: 'name',
            }}
            placeholder="Select Year"></CustomDropdownPicker>
        </View>
      </View>

      {!!totalExpense && <Text>Total Expense : {totalExpense}</Text>}
      {!!totalIncome && <Text>Total Income : {totalIncome}</Text>}
      {!!totalLending && <Text>Total Lending : {totalLending}</Text>}
      {!!totalInvestment && <Text>Total Investment : {totalInvestment}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Overview;
