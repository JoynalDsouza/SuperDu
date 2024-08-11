import React from 'react';
import {StyleSheet, View, Animated, Alert} from 'react-native';
import Text from '../common/Text';
import {
  ELECTRIC_BLUE,
  ERROR_RED,
  LIGHT_SLATE_GREY,
  PRIMARY_TEXT,
  SECONDARY_BACKGROUND,
  SECONDARY_TEXT,
  SUCCESS_GREEN,
} from '../../design/theme';
import {formatToINR} from '../../utils/formatCurrency';
import {Swipeable} from 'react-native-gesture-handler';

type TransactionCardProps = {
  type: string;
  category: string;
  addedOn: Date;
  value: number;
};

const TransactionCard: React.FC<TransactionCardProps> = ({
  type,
  category,
  addedOn,
  value,
}) => {
  // Define the left and right swipe actions
  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation,
    dragX: Animated.AnimatedInterpolation,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.leftAction}>
        <Animated.Text style={[styles.actionText, {transform: [{scale}]}]}>
          Mark as Reviewed
        </Animated.Text>
      </View>
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation,
    dragX: Animated.AnimatedInterpolation,
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
          Delete
        </Animated.Text>
      </View>
    );
  };

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableLeftOpen={() => Alert.alert('Marked as Reviewed')}
      onSwipeableRightOpen={() => Alert.alert('Transaction Deleted')}>
      <View style={styles.transactionItem}>
        <View style={styles.transactionDetails}>
          <Text variant="b1" style={styles.transactionType}>
            {type}: {category}
          </Text>
          <Text variant="caption" style={styles.transactionDate}>
            {addedOn.toDateString()}
          </Text>
        </View>
        <Text
          variant="b1"
          color={
            type === 'Income'
              ? SUCCESS_GREEN
              : type === 'Investment' || type === 'Lending'
              ? ELECTRIC_BLUE
              : ERROR_RED
          }>
          {type === 'Income' ? '+ ' : type === 'Expense' ? '- ' : ''}
          {formatToINR(value, false)}
        </Text>
      </View>
    </Swipeable>
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
