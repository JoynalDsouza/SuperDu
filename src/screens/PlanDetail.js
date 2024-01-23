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

const PlanDetail = ({route, navigation}) => {
  const {plan} = route.params;
  console.log(plan);
  return (
    <View>
      <Text>PlanDetail</Text>
    </View>
  );
};

export default PlanDetail;
