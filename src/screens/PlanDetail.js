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
  return (
    <View style={{gap: 3}}>
      <View
        style={{
          backgroundColor: 'green',
          alignItems: 'center',
          paddingVertical: 10,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: 'white',
          }}>
          Plan Details
        </Text>
      </View>

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

      {!!plan.goals.length && <Text> Goals :</Text>}
      {!!plan.goals.length &&
        plan.goals.map((goal, index) => {
          if (!goal) return null;
          return (
            <Text key={index}>
              {index + 1}. {goal.value}
            </Text>
          );
        })}

      {!!plan.friends.length && <Text> Friends :</Text>}
      {!!plan.friends.length &&
        plan.friends.map((goal, index) => {
          if (!goal) return null;
          return (
            <Text key={index}>
              {index + 1}. {goal}
            </Text>
          );
        })}
    </View>
  );
};

export default PlanDetail;
