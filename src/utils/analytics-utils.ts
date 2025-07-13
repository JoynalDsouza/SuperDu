import {Results} from 'realm';
import {Transaction, Category} from '../realm/models/Account';
import moment from 'moment';

export interface AnalyticsData {
  totalExpenses: number;
  totalIncome: number;
  categoryBreakdown: {[key: string]: number};
  monthlyTrends: {month: string; expenses: number; income: number}[];
  dailyAverages: {[key: string]: number};
  savingsRate: number;
  topCategories: {name: string; amount: number; percentage: number}[];
}

export const calculateAnalytics = (
  transactions: Results<Transaction>,
  startDate?: Date,
  endDate?: Date,
): AnalyticsData => {
  let filteredTransactions = transactions;

  if (startDate && endDate) {
    filteredTransactions = transactions.filtered(
      'addedOn >= $0 && addedOn <= $1',
      startDate,
      endDate,
    );
  }

  const expenses = filteredTransactions.filtered('type == "EXPENSE"');
  const income = filteredTransactions.filtered('type == "INCOME"');

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

  // Category breakdown
  const categoryBreakdown: {[key: string]: number} = {};
  expenses.forEach(expense => {
    const categoryName = expense.category.name;
    categoryBreakdown[categoryName] =
      (categoryBreakdown[categoryName] || 0) + expense.amount;
  });

  // Top categories
  const topCategories = Object.entries(categoryBreakdown)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Monthly trends (last 6 months)
  const monthlyTrends = Array.from({length: 6}, (_, i) => {
    const month = moment().subtract(5 - i, 'months');
    const monthStart = month.clone().startOf('month').toDate();
    const monthEnd = month.clone().endOf('month').toDate();

    const monthExpenses = expenses
      .filtered('addedOn >= $0 && addedOn <= $1', monthStart, monthEnd)
      .reduce((sum, t) => sum + t.amount, 0);

    const monthIncome = income
      .filtered('addedOn >= $0 && addedOn <= $1', monthStart, monthEnd)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: month.format('MMM'),
      expenses: monthExpenses,
      income: monthIncome,
    };
  });

  // Daily averages
  const dailyAverages: {[key: string]: number} = {};
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  daysOfWeek.forEach((day, index) => {
    const dayExpenses = expenses
      .filter(expense => moment(expense.addedOn).day() === index)
      .reduce((sum, t) => sum + t.amount, 0);

    const dayCount = expenses.filter(
      expense => moment(expense.addedOn).day() === index,
    ).length;

    dailyAverages[day] = dayCount > 0 ? dayExpenses / dayCount : 0;
  });

  // Savings rate
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return {
    totalExpenses,
    totalIncome,
    categoryBreakdown,
    monthlyTrends,
    dailyAverages,
    savingsRate,
    topCategories,
  };
};

export const getSpendingInsights = (analytics: AnalyticsData) => {
  const insights = [];

  // Savings rate insights
  if (analytics.savingsRate > 20) {
    insights.push({
      type: 'positive',
      title: 'Excellent Savings Rate',
      message: `You're saving ${analytics.savingsRate.toFixed(
        1,
      )}% of your income.`,
    });
  } else if (analytics.savingsRate > 10) {
    insights.push({
      type: 'warning',
      title: 'Good Savings Rate',
      message: `You're saving ${analytics.savingsRate.toFixed(
        1,
      )}% of your income. Try to reach 20%.`,
    });
  } else if (analytics.savingsRate > 0) {
    insights.push({
      type: 'warning',
      title: 'Low Savings Rate',
      message: `You're only saving ${analytics.savingsRate.toFixed(
        1,
      )}% of your income.`,
    });
  } else {
    insights.push({
      type: 'negative',
      title: 'No Savings',
      message: "You're spending more than you earn. Review your expenses.",
    });
  }

  // Top category insights
  if (analytics.topCategories.length > 0) {
    const topCategory = analytics.topCategories[0];
    if (topCategory.percentage > 40) {
      insights.push({
        type: 'warning',
        title: 'High Category Concentration',
        message: `${
          topCategory.name
        } accounts for ${topCategory.percentage.toFixed(1)}% of expenses.`,
      });
    }
  }

  // Monthly trend insights
  if (analytics.monthlyTrends.length >= 2) {
    const currentMonth =
      analytics.monthlyTrends[analytics.monthlyTrends.length - 1];
    const previousMonth =
      analytics.monthlyTrends[analytics.monthlyTrends.length - 2];

    if (currentMonth.expenses > previousMonth.expenses * 1.2) {
      insights.push({
        type: 'warning',
        title: 'Spending Increased',
        message: `Your expenses increased by ${(
          ((currentMonth.expenses - previousMonth.expenses) /
            previousMonth.expenses) *
          100
        ).toFixed(1)}% this month.`,
      });
    } else if (currentMonth.expenses < previousMonth.expenses * 0.8) {
      insights.push({
        type: 'positive',
        title: 'Spending Decreased',
        message: `Great! You reduced expenses by ${(
          ((previousMonth.expenses - currentMonth.expenses) /
            previousMonth.expenses) *
          100
        ).toFixed(1)}% this month.`,
      });
    }
  }

  return insights;
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const getColorForCategory = (index: number): string => {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E9',
  ];
  return colors[index % colors.length];
};
