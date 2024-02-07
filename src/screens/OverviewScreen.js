import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, BackHandler, ScrollView} from 'react-native';
import moment from 'moment';
import {getMonth, getYear, getYearsBetween} from '../utils/moment';
import {useObject, useQuery, useRealm} from '@realm/react';
import {
  Budget,
  Expense,
  Income,
  Investment,
  Lending,
} from '../realm/models/Account';
import {MONTHS} from '../utils/constants/Months';
import CustomDropdownPicker from '../components/common/CustomDropdownPicker';
import {User} from '../realm/models/User';
import AddBudget from '../components/Inputs/AddBudget';
import {calculateExpensesComparison} from '../utils/createExpensesComparison';
import BudgetTable from '../components/budget/BudgetTable';

const itemExistsInArray = (array, key, value) => {
  const result = array.some(item => item[key] === value);
  return result;
};

const Overview = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()));
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));

  const user = useQuery(User)[0];

  const realm = useRealm();

  const YEARS = getYearsBetween(new Date(user.createdOn), new Date());

  const EXPENSES = useQuery(Expense);
  const INCOMES = useQuery(Income);
  const LENDINGS = useQuery(Lending);
  const INVESTMENTS = useQuery(Investment);
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

  const daysInMonth = moment(
    `${selectedYear}-${selectedMonth}`,
    'YYYY-MM',
  ).daysInMonth();
  let daysWithExpenses = [];

  // Populate the daysWithExpenses array
  filteredExpenses.forEach(expense => {
    const day = moment(expense.addedOn).date();
    if (!daysWithExpenses.includes(day)) {
      daysWithExpenses.push(day);
    }
  });

  const daysWithoutExpenses = daysInMonth - daysWithExpenses.length;

  const totalExpense = useMemo(() => {
    return filteredExpenses.reduce(
      (total, expense) => total + expense.value,
      0,
    );
  }, [filteredExpenses]);

  const totalExpensesByType = useMemo(() => {
    return filteredExpenses.reduce((acc, expense) => {
      if (acc[expense.type?.name]) {
        acc[expense.type?.name] = acc[expense.type?.name] + expense.value;
      } else {
        acc[expense.type?.name] = expense.value;
      }
      return acc;
    }, {});
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

  const budget = BUDGET?.budget || [];

  if (totalInvestment) {
    totalExpensesByType['investment'] = totalInvestment;
  }
  if (totalLending) {
    totalExpensesByType['lending'] = totalLending;
  }
  const comparison = calculateExpensesComparison(totalExpensesByType, budget);

  return (
    <ScrollView>
      <View style={{flexDirection: 'row', gap: 10, marginBottom: 20}}>
        <View style={{flex: 2}}>
          <Text>Select Month</Text>
          <CustomDropdownPicker
            items={MONTHS}
            value={selectedMonth}
            setValue={item => setSelectedMonth(item.value)}
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
            valueField="name"
            placeholder="Select Year"></CustomDropdownPicker>
        </View>
      </View>
      <Text style={{marginVertical: 10}}>
        Days Without expense : {daysWithoutExpenses} / {daysInMonth}
      </Text>
      {!!totalExpense && <Text>Total Expense : {totalExpense}</Text>}
      {!!totalIncome && <Text>Total Income : {totalIncome}</Text>}

      {!!Object.keys(comparison).length && (
        <BudgetTable budgetData={comparison} />
      )}

      <AddBudget
        date={`${selectedMonth}/${selectedYear}`}
        // budgets={filteredBudgets}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Overview;
