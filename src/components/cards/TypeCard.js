import React from 'react';
import {Text, Touchable, TouchableOpacity, View} from 'react-native';

const TypeCard = ({item, type, onDelete}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={{flex: 1}}>{item.value}</Text>
      <Text style={{flex: 1}}> {type?.name}</Text>
      {!!onDelete && (
        <TouchableOpacity disabled={!onDelete} onPress={onDelete}>
          <Text style={{color: 'red'}}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TypeCard;
