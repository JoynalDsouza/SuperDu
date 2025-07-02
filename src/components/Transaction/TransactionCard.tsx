import React from 'react';
import {StyleSheet, View, Animated, Alert, Pressable} from 'react-native';
import Text from '../common/Text';
import {
  applyOpacityToHexColor,
  ELECTRIC_BLUE,
  ERROR_RED,
  PRIMARY_TEXT,
  SECONDARY_BACKGROUND,
  SECONDARY_TEXT,
  SUCCESS_GREEN,
} from '../../design/theme';
import {formatToINR} from '../../utils/formatCurrency';
import {Swipeable} from 'react-native-gesture-handler';
import {CategoryType} from 'realm/models/Account';
import {rootNavigate} from '../../Navigation/navigation';
import {
  TRANSACTION_COLOR,
  TRANSACTION_TYPE_ICON,
} from '../../utils/constants/transactions';

type TransactionCardProps = {
  id: string;
  type: CategoryType;
  category: string;
  addedOn: Date;
  amount: number;
};

const TransactionCard: React.FC<TransactionCardProps> = ({
  id,
  type,
  category,
  addedOn,
  amount,
}) => {
  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.leftAction}>
        <Animated.Text style={[styles.actionText, {transform: [{scale}]}]}>
          🤓
        </Animated.Text>
      </View>
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rightAction}>
        <Animated.Text
          style={[
            styles.actionText,
            {transform: [{scale}], textAlign: 'right'},
          ]}>
          😎
        </Animated.Text>
      </View>
    );
  };

  const backgroundColor = applyOpacityToHexColor(TRANSACTION_COLOR[type], 25);

  return (
    // <Swipeable
    //   renderLeftActions={renderLeftActions}
    //   renderRightActions={renderRightActions}
    //   leftThreshold={100}
    //   rightThreshold={100}
    //   onSwipeableOpen={direction => {
    //     if (direction === 'left') {
    //       // Alert.alert('Marked as Reviewed');
    //     } else {
    //       // Alert.alert('Transaction Deleted');
    //     }
    //     Alert.alert('cooking');
    //   }}>
    <Pressable
      style={[styles.transactionItem, {backgroundColor}]}
      onPress={() =>
        rootNavigate('ManageTransaction', 'push', {transactionId: id})
      }
      disabled={!id}>
      <View style={styles.transactionDetails}>
        <Text variant="b1" style={styles.transactionType}>
          {TRANSACTION_TYPE_ICON[type]} {type}: {category}
        </Text>
        <Text variant="caption" style={styles.transactionDate}>
          {addedOn.toDateString()}
        </Text>
      </View>
      <Text
        variant="b1"
        // color={
        //   type === 'INCOME'
        //     ? SUCCESS_GREEN
        //     : type === 'INVESTMENT' || type === 'LENDING'
        //     ? ELECTRIC_BLUE
        //     : ERROR_RED
        // }
      >
        {type === 'INCOME' ? '+ ' : type === 'EXPENSE' ? '- ' : ''}
        {formatToINR(amount, false)}
      </Text>
    </Pressable>
    // </Swipeable>
  );
};

export default TransactionCard;

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: SECONDARY_BACKGROUND,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    color: PRIMARY_TEXT,
    textTransform: 'capitalize',
  },
  transactionDate: {
    color: SECONDARY_TEXT,
  },
  leftAction: {
    flex: 1,
    backgroundColor: SUCCESS_GREEN,
    justifyContent: 'center',
    borderRadius: 8,
  },
  rightAction: {
    flex: 1,
    backgroundColor: ERROR_RED,
    justifyContent: 'center',
    borderRadius: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    padding: 20,
  },
});
