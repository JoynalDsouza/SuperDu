import React from 'react';
import {View, StyleSheet} from 'react-native';
import {formatToINR} from '../../utils/formatCurrency';
import Text from '../common/Text';
import {
  ERROR_RED,
  PRIMARY_BACKGROUND,
  SECONDARY_BACKGROUND,
  SUCCESS_GREEN,
  TEAL_BLUE,
} from '../../design/theme';

const AllocationTable = ({allocationData, containerStyles = {}}) => {
  const headers = ['Category', 'Budget Allocation %', 'Actual %'];

  return (
    <View style={[styles.container, containerStyles]}>
      <View style={styles.table}>
        <View style={[styles.headerRow, styles.rowSeparator]}>
          {headers.map((header, index) => (
            <Text key={index} style={styles.headerItem}>
              {header}
            </Text>
          ))}
        </View>
        {Object.entries(allocationData).map(([key, value], index) => (
          <View
            key={index}
            style={[
              styles.dataRow,
              styles.rowSeparator,
              index % 2 === 0 ? styles.evenRow : styles.oddRow,
              {alignItems: 'center'},
            ]}>
            {console.log('key', key)}
            <Text style={[styles.dataItem, styles.capitalize]}>{key}</Text>
            <View style={{flex: 1}}>
              <Text style={styles.dataItem}>
                {value.plannedPercentage.toFixed(2)}%
              </Text>
              <Text style={styles.dataItem}>{formatToINR(value?.planned)}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={[
                  styles.dataItem,
                  {
                    color:
                      value.actualPercentage < value.plannedPercentage
                        ? key === 'SAVINGS'
                          ? ERROR_RED
                          : SUCCESS_GREEN
                        : key == 'SAVINGS'
                        ? SUCCESS_GREEN
                        : ERROR_RED,
                  },
                ]}>
                {value.actualPercentage.toFixed(2)}%
              </Text>
              <Text style={styles.dataItem}>{formatToINR(value?.actual)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: TEAL_BLUE,
  },
  headerItem: {
    flex: 1,
    padding: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
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
  evenRow: {
    backgroundColor: PRIMARY_BACKGROUND,
  },
  oddRow: {
    backgroundColor: SECONDARY_BACKGROUND,
  },
  capitalize: {
    textTransform: 'capitalize',
  },
});

export default AllocationTable;
