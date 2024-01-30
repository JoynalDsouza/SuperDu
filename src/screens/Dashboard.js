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
import {Expense, Income} from '../realm/models/Account';
import AddIncome from '../components/Inputs/AddIncome';

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const EXPENSES = useQuery(Expense);
  const INCOMES = useQuery(Income);

  const startOfDay = momemt(new Date(date)).startOf('day');
  const endOfDay = momemt(new Date(date)).endOf('day');

  const filteredExpenses = useMemo(
    () =>
      EXPENSES.filtered(
        'addedOn >= $0 && addedOn <= $1',
        startOfDay.toDate(),
        endOfDay.toDate(),
      ),
    [EXPENSES, date],
  );

  const filteredIncomes = useMemo(
    () =>
      INCOMES.filtered(
        'addedOn >= $0 && addedOn <= $1',
        startOfDay.toDate(),
        endOfDay.toDate(),
      ),
    [INCOMES, date],
  );

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
      <Text>Dashboard</Text>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 40,
        }}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text>{getDate(date)}</Text>
        </TouchableOpacity>
      </View>

      <View>
        <AddExpense expenses={filteredExpenses} />
      </View>

      <View>
        <AddIncome incomes={filteredIncomes} />
      </View>
      {showDatePicker && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            zIndex: 1,
            backgroundColor: '#F5FCFF',
          }}>
          <DateTimePicker
            mode="single"
            date={date}
            onChange={params => {
              setDate(params.date);
              setShowDatePicker(false);
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

export default Dashboard;
