import React from 'react';
import {Text, Touchable, TouchableOpacity, View} from 'react-native';

const TypeCard = ({item, type}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={{flex: 1}}>{item.value}</Text>
      <Text style={{flex: 1}}> {type?.name}</Text>
    </View>
  );
};

export default TypeCard;
