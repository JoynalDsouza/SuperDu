import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import momemt, {utc} from 'moment';
import {getDate} from '../utils/moment';
import DateTimePicker from 'react-native-ui-datepicker';

const Dashboard = () => {
  const currentDate = getDate();
  // const [fromDate, setFromDate] = useState(currentDate);
  // const [toDate, setToDate] = useState(currentDate);
  const [date, setDate] = useState(currentDate);
  return (
    <View>
      <Text>Dashboard</Text>
      <DateTimePicker
        mode="single"
        date={momemt(date, 'DD-MM-YYYY')}
        onChange={params => getDate(params.date)}
      />
      <Text>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Dashboard;
