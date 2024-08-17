import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  ScrollView,
  FlatList,
} from 'react-native';
import moment from 'moment';
import Text from '../components/common/Text';
import {getMonth, getYear, getYearsBetween} from '../utils/moment';
import {useObject, useQuery, useRealm} from '@realm/react';
import {Budget, Category, Transaction} from '../realm/models/Account';
import {MONTHS} from '../utils/constants/Months';
import CustomDropdownPicker from '../components/common/CustomDropdownPicker';
import {User} from '../realm/models/User';
import AddBudget from '../components/Inputs/AddBudget';
import {
  calculateExpensesComparison,
  getIncomeAllocation,
} from '../utils/overview-utils';
import BudgetTable from '../components/budget/BudgetTable';
import {formatToINR} from '../utils/formatCurrency';
import AllocationTable from '../components/overview/AllocationTable';
import MonthOverviewCard from '../components/dashboard/MonthOverviewCard';
import {
  ELECTRIC_BLUE,
  LIGHT_SLATE_GREY,
  PRIMARY_BACKGROUND,
} from '../design/theme';
import TransactionCard from '../components/Transaction/TransactionCard';
import {rootNavigate} from 'Navigation/navigation';

const Overview = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [counter, setCounter] = useState(0);

  const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()));
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));

  const user = useQuery(User)[0];

  const YEARS = getYearsBetween(new Date(user.createdOn), new Date());

  const EXPENSES = useQuery(Transaction).filtered('type == "EXPENSE"');
  const INCOMES = useQuery(Transaction).filtered('type == "INCOME"');
  const LENDINGS = useQuery(Transaction).filtered('type == "LENDING"');
  const INVESTMENTS = useQuery(Transaction).filtered('type == "INVESTMENT"');

  const EXPENSE_TYPES = useQuery(Category).filtered('type == "EXPENSE"');

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

  const totalExpense = useMemo(() => {
    return filteredExpenses.reduce(
      (total, expense) => total + expense.amount,
      0,
    );
  }, [filteredExpenses]);

  const totalExpensesByType = useMemo(() => {
    return filteredExpenses.reduce((acc, expense) => {
      if (acc[expense?.category?.name]) {
        acc[expense?.category?.name] =
          acc[expense?.category?.name] + expense.amount;
      } else {
        acc[expense?.category?.name] = expense.amount;
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

  const allocation = getIncomeAllocation(
    comparison,
    totalIncome,
    expenseTypeMap,
  );

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: PRIMARY_BACKGROUND,
      }}>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          marginBottom: 20,
          backgroundColor: ELECTRIC_BLUE,
        }}>
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

      <MonthOverviewCard
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      {!!Object.keys(comparison).length && (
        <BudgetTable
          budgetData={comparison}
          containerStyles={{
            marginTop: 20,
            marginBottom: 20,
          }}
        />
      )}
      <View style={{backgroundColor: LIGHT_SLATE_GREY, padding: 16}}>
        <AddBudget
          date={`${selectedMonth}/${selectedYear}`}
          setCounter={setCounter}
          counter={counter}
          // budgets={filteredBudgets}
        />
      </View>

      <View>
        {!!Object.keys(allocation).length && (
          <AllocationTable
            allocationData={allocation}
            containerStyles={{
              marginTop: 20,
              marginBottom: 20,
            }}
          />
        )}
      </View>

      <View>
        <Text style={{marginTop: 10, marginBottom: 5}}>Expenses By Date</Text>
        {Object.keys(expensesByDate).map(date => {
          const totalExpense = expensesByDate[date].reduce((acc, expense) => {
            return acc + expense.amount;
          }, 0);

          return (
            <View key={date} style={{marginVertical: 10}}>
              <Text style={{marginBottom: 4}}>
                {moment(date).format('dddd , Do MMMM')} - Total :{' '}
                {formatToINR(totalExpense)}
              </Text>
              <FlatList
                data={expensesByDate[date]}
                keyExtractor={item => item.id}
                contentContainerStyle={{gap: 8}}
                renderItem={({item}) => {
                  return (
                    <TransactionCard
                      type={'EXPENSE'}
                      category={item?.category?.name}
                      addedOn={item.addedOn}
                      amount={item.amount}
                      id={item.id}
                    />
                  );
                }}
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Overview;
