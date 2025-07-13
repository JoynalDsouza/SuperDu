import React, {useMemo} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import Text from '../common/Text';
import {
  PRIMARY_BACKGROUND,
  SECONDARY_BACKGROUND,
  PRIMARY_TEXT,
  ERROR_RED,
  SUCCESS_GREEN,
  LIGHT_SLATE_GREY,
} from '../../design/theme';
import {Results} from 'realm';
import {Transaction, Category} from '../../realm/models/Account';
import {formatToINR} from '../../utils/formatCurrency';

interface CategoryAnalyticsProps {
  expenses: Results<Transaction>;
  categories: Results<Category>;
}

interface CategoryData {
  name: string;
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

const CategoryAnalytics: React.FC<CategoryAnalyticsProps> = ({
  expenses,
  categories,
}) => {
  const categoryData = useMemo(() => {
    const categoryStats: {[key: string]: {total: number; count: number}} = {};
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + (expense?.amount || 0),
      0,
    );

    expenses.forEach(expense => {
      if (expense?.category?.name && expense?.amount != null) {
        const categoryName = expense.category.name;
        if (!categoryStats[categoryName]) {
          categoryStats[categoryName] = {total: 0, count: 0};
        }
        categoryStats[categoryName].total += expense.amount;
        categoryStats[categoryName].count += 1;
      }
    });

    const data: CategoryData[] = Object.entries(categoryStats)
      .map(([name, stats]) => ({
        name,
        totalAmount: stats.total,
        transactionCount: stats.count,
        averageAmount: stats.total / stats.count,
        percentage: totalExpenses > 0 ? (stats.total / totalExpenses) * 100 : 0,
        trend: 'stable' as const, // TODO: Calculate actual trend
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);

    return data;
  }, [expenses]);

  const renderCategoryItem = ({item}: {item: CategoryData}) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryHeader}>
        <Text variant="h3" style={styles.categoryName}>
          {item.name}
        </Text>
        <View style={styles.trendContainer}>
          <Text style={styles.trendIcon}>
            {item.trend === 'up' ? '📈' : item.trend === 'down' ? '📉' : '➡️'}
          </Text>
        </View>
      </View>

      <View style={styles.categoryStats}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Spent:</Text>
          <Text style={styles.statValue}>{formatToINR(item.totalAmount)}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Transactions:</Text>
          <Text style={styles.statValue}>{item.transactionCount}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Average:</Text>
          <Text style={styles.statValue}>
            {formatToINR(item.averageAmount)}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>% of Total:</Text>
          <Text style={styles.statValue}>{item.percentage.toFixed(1)}%</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {width: `${Math.min(item.percentage, 100)}%`},
          ]}
        />
      </View>
    </View>
  );

  if (categoryData.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="h3" style={styles.title}>
          Category Analytics
        </Text>
        <View style={styles.emptyState}>
          <Text>No expense categories found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        Category Analytics
      </Text>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Top Category:</Text>
          <Text style={styles.summaryValue}>{categoryData[0]?.name}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Categories Used:</Text>
          <Text style={styles.summaryValue}>{categoryData.length}</Text>
        </View>
      </View>

      <FlatList
        data={categoryData}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.name}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: SECONDARY_BACKGROUND,
    borderRadius: 12,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    color: PRIMARY_TEXT,
    textAlign: 'center',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 8,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    opacity: 0.7,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PRIMARY_TEXT,
  },
  categoryItem: {
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 8,
    padding: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    color: PRIMARY_TEXT,
    textTransform: 'capitalize',
  },
  trendContainer: {
    padding: 4,
  },
  trendIcon: {
    fontSize: 16,
  },
  categoryStats: {
    marginBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: PRIMARY_TEXT,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: PRIMARY_TEXT,
  },
  progressContainer: {
    height: 4,
    backgroundColor: LIGHT_SLATE_GREY,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: ERROR_RED,
    borderRadius: 2,
  },
  separator: {
    height: 8,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CategoryAnalytics;
