import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

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
            ]}>
            <Text style={[styles.dataItem, styles.capitalize]}>{key}</Text>
            <Text style={styles.dataItem}>
              {value.plannedPercentage.toFixed(2)}%
            </Text>
            <Text
              style={[
                styles.dataItem,
                {
                  color:
                    value.actualPercentage < value.plannedPercentage
                      ? 'red'
                      : 'green',
                },
              ]}>
              {value.actualPercentage.toFixed(2)}%
            </Text>
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
    backgroundColor: '#4caf50',
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
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#f1f1f1',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
});

export default AllocationTable;
