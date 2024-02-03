import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ScrollView,
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

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const EXPENSES = useQuery(Expense);
  const INCOMES = useQuery(Income);
  const LENDINGS = useQuery(Lending);
  const INVESTMENTS = useQuery(Investment);

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
    [INCOMES, date],
  );

  const filteredLendings = useMemo(
    () =>
      LENDINGS.filtered(
        'addedOn >= $0 && addedOn <= $1',
        startOfDay.toDate(),
        endOfDay.toDate(),
      ),
    [LENDINGS, date],
  );

  const filteredInvestments = useMemo(
    () =>
      INVESTMENTS.filtered(
        'addedOn >= $0 && addedOn <= $1',
        startOfDay.toDate(),
        endOfDay.toDate(),
      ),
    [INVESTMENTS, date],
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 40,
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            const newDate = momemt(new Date(date)).subtract(1, 'day').toDate();
            setDate(newDate);
          }}>
          <Text>Left</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text>{getDate(date)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            const newDate = momemt(new Date(date)).add(1, 'day').toDate();
            setDate(newDate);
          }}>
          <Text>Right</Text>
        </TouchableOpacity>
      </View>

      {!!totalExpense && <Text>Total Expense : {totalExpense}</Text>}
      <ScrollView>
        <View style={styles.height300}>
          <AddExpense expenses={filteredExpenses} date={date} />
        </View>

        <View style={styles.height300}>
          <AddIncome incomes={filteredIncomes} date={date} />
        </View>

        <View style={styles.height300}>
          <AddLending lendings={filteredLendings} date={date} />
        </View>

        <View style={styles.height300}>
          <AddInvestment investments={filteredInvestments} date={date} />
        </View>
      </ScrollView>
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
  height300: {
    height: 300,
  },
});

export default Dashboard;
