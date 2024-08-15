import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MonthOverViewCard from '../components/dashboard/MonthOverviewCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import {getMonth, getYear} from '../utils/moment';
import {PRIMARY_BACKGROUND} from '../design/theme';
import Button from '../components/common/Button';
import {rootNavigate} from '../Navigation/navigation';

const Dashboard = () => {
  const currentMonth = getMonth(new Date());
  const currentYear = getYear(new Date());

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: PRIMARY_BACKGROUND,
      }}>
      <ScrollView>
        <MonthOverViewCard
          selectedMonth={currentMonth}
          selectedYear={currentYear}
        />

        <Button
          title="Add Transaction"
          onPress={() => {
            rootNavigate('ManageTransaction', 'push', {
              transactionId: undefined,
            });
          }}
          style={{
            margin: 16,
          }}
        />
        <RecentTransactions />
      </ScrollView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
