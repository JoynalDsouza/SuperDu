import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  ScrollView,
  Dimensions,
} from 'react-native';
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
import {formatToINR} from '../utils/formatCurrency';
import {PieChart} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#e26a00',
  backgroundGradientFrom: '#fb8c00',
  backgroundGradientTo: '#ffa726',
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

const itemExistsInArray = (array, key, value) => {
  const result = array.some(item => item[key] === value);
  return result;
};

const Overview = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [counter, setCounter] = useState(0);

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

  const daysWithoutExpenses = daysInMonth - Object.keys(expensesByDate).length;

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

  const spending = totalExpense + totalInvestment + totalLending;

  return (
    <ScrollView
      contentContainerStyle={{marginHorizontal: 10, marginVertical: 10}}>
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
      {!!totalExpense && (
        <Text>Total Expense : {formatToINR(totalExpense)}</Text>
      )}
      {!!totalIncome && <Text>Total Income : {formatToINR(totalIncome)}</Text>}
      {<Text>Savings : {formatToINR(totalIncome - spending)}</Text>}

      {!!Object.keys(comparison).length && (
        <BudgetTable
          budgetData={comparison}
          containerStyles={{
            marginTop: 20,
            marginBottom: 20,
          }}
        />
      )}

      <AddBudget
        date={`${selectedMonth}/${selectedYear}`}
        setCounter={setCounter}
        counter={counter}
        // budgets={filteredBudgets}
      />

      <View>
        <PieChart
          data={Object.keys(totalExpensesByType).map(key => {
            return {
              name: key,
              expense: totalExpensesByType[key],
              color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            };
          })}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          accessor={'expense'}
          backgroundColor={'transparent'}
          center={[0, 0]}
          absolute></PieChart>
      </View>

      <View>
        <Text style={{marginTop: 10, marginBottom: 5}}>Expenses By Date</Text>
        {Object.keys(expensesByDate).map(date => {
          return (
            <View key={date} style={{marginVertical: 10}}>
              <Text style={{marginBottom: 4}}>
                {moment(date).format('dddd , Do MMMM')}
              </Text>
              {expensesByDate[date].map(expense => {
                return (
                  <View key={expense._id} style={{flexDirection: 'row'}}>
                    <Text>{formatToINR(expense.value)}</Text>
                    <Text> {expense.type?.name}</Text>
                  </View>
                );
              })}
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
