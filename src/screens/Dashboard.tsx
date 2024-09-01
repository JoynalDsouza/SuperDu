import {
  Alert,
  DeviceEventEmitter,
  PermissionsAndroid,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MonthOverViewCard from '../components/dashboard/MonthOverviewCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import {getMonth, getYear} from '../utils/moment';
import {PRIMARY_BACKGROUND} from '../design/theme';
import Button from '../components/common/Button';
import {rootNavigate} from '../Navigation/navigation';

import {getNativeMessages} from '../utils/sms-reader-utils';

const Dashboard = () => {
  const currentMonth = getMonth(new Date());
  const currentYear = getYear(new Date());

  // const [receiveSmsPermission, setReceiveSmsPermission] = useState('');

  // const requestSmsPermission = async () => {
  //   try {
  //     const permission = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
  //     );
  //     setReceiveSmsPermission(permission);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   requestSmsPermission();
  // }, []);

  // useEffect(() => {
  //   if (receiveSmsPermission === PermissionsAndroid.RESULTS.GRANTED) {
  //     let subscriber = DeviceEventEmitter.addListener(
  //       'onSMSReceived',
  //       message => {
  //         const {messageBody, senderPhoneNumber} = JSON.parse(message);
  //         Alert.alert(
  //           'SMS received',
  //           `Message Body: ${messageBody} & sender number: ${senderPhoneNumber}`,
  //         );
  //       },
  //     );

  //     return () => {
  //       subscriber.remove();
  //     };
  //   }
  // }, [receiveSmsPermission]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: PRIMARY_BACKGROUND,
      }}>
      {/* <Button
        title="GET MESSAGES"
        onPress={() => {
          getNativeMessages();
        }}
      /> */}
      <SectionList
        sections={[
          {
            key: 'main-content',
            data: [
              <MonthOverViewCard
                selectedMonth={Number(currentMonth)}
                selectedYear={Number(currentYear)}
              />,
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
              />,
            ],
          },
          {
            key: 'recent-transactions',
            data: [<RecentTransactions />],
          },
        ]}
        renderItem={({item}) => {
          return item;
        }}
      />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
