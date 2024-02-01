import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import momemt, {utc} from 'moment';
import {getDate, getDateTime} from '../utils/moment';
import DateTimePicker from 'react-native-ui-datepicker';
import AddExpense from '../components/Inputs/AddExpense';
import {useQuery} from '@realm/react';
import {Expense, Income, Investment, Lending} from '../realm/models/Account';
import AddIncome from '../components/Inputs/AddIncome';
import AddLending from '../components/Inputs/AddLending';
import AddInvestment from '../components/Inputs/AddInvestment';

const Overview = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);

  const EXPENSES = useQuery(Expense);
  const INCOMES = useQuery(Income);
  const LENDINGS = useQuery(Lending);
  const INVESTMENTS = useQuery(Investment);

  const startOfDay =
    (startDate && momemt(new Date(startDate)).startOf('month')) ||
    momemt(new Date()).startOf('month');
  const endOfDay =
    (endDate && momemt(new Date(endDate)).endOf('day')) ||
    momemt(new Date()).endOf('day');

  const filteredExpenses = useMemo(
    () =>
      EXPENSES.filtered(
        'addedOn >= $0 && addedOn <= $1',
        startOfDay.toDate(),
        endOfDay.toDate(),
      ),
    [EXPENSES, startDate, endDate],
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
        startOfDay.toDate(),
        endOfDay.toDate(),
      ),
    [INCOMES, startDate, endDate],
  );

  const totalIncome = useMemo(() => {
    return filteredIncomes.reduce((total, income) => total + income.value, 0);
  });

  const filteredLendings = useMemo(
    () =>
      LENDINGS.filtered(
        'addedOn >= $0 && addedOn <= $1',
        startOfDay.toDate(),
        endOfDay.toDate(),
      ),
    [LENDINGS, startDate, endDate],
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
        startOfDay.toDate(),
        endOfDay.toDate(),
      ),
    [INVESTMENTS, startDate, endDate],
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',

          alignItems: 'center',
          paddingVertical: 40,
        }}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text>
            {getDate(startDate)} to {getDate(endDate)}
          </Text>
        </TouchableOpacity>
      </View>

      {!!totalExpense && <Text>Total Expense : {totalExpense}</Text>}
      {!!totalIncome && <Text>Total Income : {totalIncome}</Text>}
      {!!totalLending && <Text>Total Lending : {totalLending}</Text>}
      {!!totalInvestment && <Text>Total Investment : {totalInvestment}</Text>}

      {showDatePicker && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            zIndex: 1,
            backgroundColor: '#F5FCFF',
          }}>
          <DateTimePicker
            mode="range"
            startDate={startDate}
            endDate={endDate}
            onChange={params => {
              if (params.startDate > params.endDate) {
                setStartDate(params.endDate);
                setEndDate(params.startDate);
              } else {
                setStartDate(params.startDate);
                setEndDate(params.endDate);
              }
              if (params.startDate && params.endDate) {
                setShowDatePicker(false);
              }
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Overview;
