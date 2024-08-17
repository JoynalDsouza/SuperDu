import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {formatToINR} from '../../utils/formatCurrency';
import Text from '../common/Text';
import {
  ERROR_RED,
  LIGHT_SLATE_GREY,
  PRIMARY_BACKGROUND,
  SECONDARY_BACKGROUND,
  SUCCESS_GREEN,
  TEAL_BLUE,
} from '../../design/theme';

const BudgetTable = ({budgetData, containerStyles = {}}) => {
  const data = Object.keys(budgetData || {});
  const totalPlanned = data.reduce(
    (acc, item) => acc + budgetData[item].planned,
    0,
  );
  const totalActual = data.reduce(
    (acc, item) => acc + budgetData[item].actual,
    0,
  );
  const diff = totalPlanned - totalActual;

  return (
    <View style={[styles.container, containerStyles]}>
      <View style={styles.table}>
        <View style={[styles.headerRow, styles.rowSeparator]}>
          <Text type="h3" style={styles.headerItem}>
            Type
          </Text>
          <Text type="h3" style={styles.headerItem}>
            Planned
          </Text>
          <Text type="h3" style={styles.headerItem}>
            Actual
          </Text>
          <Text type="h3" style={styles.headerItem}>
            Diff
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.rowSeparator]}>
          <Text style={styles.dataItem}></Text>
          <Text style={styles.dataItem}>{formatToINR(totalPlanned)}</Text>
          <Text style={styles.dataItem}>{formatToINR(totalActual)}</Text>
          <Text
            style={[
              styles.dataItem,
              {color: diff < 0 ? ERROR_RED : SUCCESS_GREEN},
            ]}>
            {formatToINR(diff)}
          </Text>
        </View>
      </View>
      <FlatList
        data={data}
        keyExtractor={item => item?.id}
        renderItem={({item, index}) => {
          const budgetItem = budgetData[item];
          const diff = budgetItem.planned - budgetItem.actual;
          if (!budgetItem.planned && !budgetItem.actual) {
            return null;
          }
          const isLast = index === data.length - 1;
          return (
            <View
              style={[
                styles.dataRow,
                styles.rowSeparator,
                index % 2 === 0 ? styles.evenRow : styles.oddRow,
              ]}>
              <Text style={[styles.dataItem, styles.capitalize]}>{item}</Text>
              <Text style={styles.dataItem}>
                {formatToINR(budgetItem.planned)}
              </Text>
              <Text style={styles.dataItem}>
                {formatToINR(budgetItem.actual)}
              </Text>
              <Text
                style={[
                  styles.dataItem,
                  {color: diff < 0 ? ERROR_RED : SUCCESS_GREEN},
                  isLast && {
                    borderBottomRightRadius: 8,
                    borderBottomLeftRadius: 8,
                  },
                ]}>
                {formatToINR(diff)}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: LIGHT_SLATE_GREY,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: TEAL_BLUE,
  },
  headerItem: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
  },
  dataRow: {
    flexDirection: 'row',
  },
  dataItem: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
    fontSize: 13,
  },
  rowSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: SECONDARY_BACKGROUND,
    alignItems: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataItem: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    fontSize: 13,
  },
  rowSeparator: {
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: LIGHT_SLATE_GREY,
    borderLeftColor: LIGHT_SLATE_GREY,
    borderRightColor: LIGHT_SLATE_GREY,
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  evenRow: {
    backgroundColor: PRIMARY_BACKGROUND,
  },
  oddRow: {
    backgroundColor: SECONDARY_BACKGROUND,
  },
});

export default BudgetTable;
