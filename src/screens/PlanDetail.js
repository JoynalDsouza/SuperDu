import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Touchable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {getAMPMTime} from './CreatePlan';

export const DAYS = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
};

const PlanDetail = ({route, navigation}) => {
  const {plan} = route.params;
  const a = {
    _id: 'inex',
    deleted: false,
    description: 'askndfakls',
    endTime: '20:27',
    friends: ['adas'],
    goals: [[Object]],
    isCompleted: false,
    repeatEndDate: '2024-01-27T12:56:00.000Z',
    repeatSequence: [2, 5, 3, 4],
    repeatType: 'weekly',
    startTime: '18:27',
    title: 'alknfalksfa',
  };
  console.log(plan.repeatSequence);
  return (
    <View>
      <Text>Plan Details</Text>

      <Text> Title : {plan.title}</Text>
      <Text> Description : {plan.description || 'No description added'}</Text>
      <Text> Start Time : {getAMPMTime(plan.startTime)}</Text>
      <Text> End Time : {getAMPMTime(plan.endTime)}</Text>
      {/* <Text> Repeat Type : {plan.repeatType}</Text>
       */}
      {!!plan?.repeatSequence.length && <Text> Repeat On :</Text>}
      {!!plan?.repeatSequence.length &&
        plan.repeatSequence.map((day, index) => {
          return <Text key={index}> {DAYS[day]}</Text>;
        })}
    </View>
  );
};

export default PlanDetail;
