import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {PRIMARY_BACKGROUND} from '../design/theme';
import {rootNavigate} from '../Navigation/navigation';
import Text from '../components/common/Text';

const TransactionsScreen = () => {
  return (
    <View
      style={{
        backgroundColor: PRIMARY_BACKGROUND,
        gap: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        flex: 1,
      }}>
      <View
        style={{
          marginVertical: 16,
          gap: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Pressable
          onPress={() => {
            rootNavigate();
          }}>
          <Text>{'<--'}</Text>
        </Pressable>
        <Text style={{textTransform: 'capitalize'}}>Transactions</Text>

        <View>
          <Text>∑</Text>
        </View>
      </View>
    </View>
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({});
