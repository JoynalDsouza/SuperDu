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
import {formatToINR} from '../utils/formatCurrency';
import {alertError} from '../utils/alertError';
import {rootNavigate} from '../Navigation/navigation';

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
    <ScrollView
      contentContainerStyle={{margin: 10}}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            try {
              const newDate = momemt(new Date(date))
                .subtract(1, 'day')
                .toDate();
              setDate(newDate);
            } catch (err) {
              alertError(err);
            }
          }}>
          <Text style={styles.buttonText}>Left</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.buttonText}>{getDate(date)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const newDate = momemt(new Date(date)).add(1, 'day').toDate();
            setDate(newDate);
          }}>
          <Text style={styles.buttonText}>Right</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.totalExpenseText}>
        Total Expense: {formatToINR(totalExpense)}
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}>
        <View style={styles.card}>
          <AddExpense expenses={filteredExpenses} date={date} />
        </View>
        <View style={styles.card}>
          <AddIncome incomes={filteredIncomes} date={date} />
        </View>
        <View style={styles.card}>
          <AddLending lendings={filteredLendings} date={date} />
        </View>
        <View style={styles.card}>
          <AddInvestment investments={filteredInvestments} date={date} />
        </View>
      </ScrollView>
      {showDatePicker && (
        <View style={styles.datePickerOverlay}>
          <DateTimePicker
            mode="single"
            date={date}
            onChange={params => {
              try {
                const date = new Date(params.date?.toDate());

                setDate(date);

                setShowDatePicker(false);
              } catch (e) {
                alertError(e);
              }
            }}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  button: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#007bff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(245, 252, 255, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalExpenseText: {
    fontSize: 16,
    color: '#333333',
    padding: 20,
    fontWeight: 'bold',
  },
  card: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 1.22,
    elevation: 3,
  },
});

export default Dashboard;
