import moment from 'moment';
import {Transaction} from '../realm/models/Account';
import {Results} from 'realm';
import {getDaysBetweenDates} from './moment';

export const getOverviewStats = (
  transactions: Results<Transaction>,
  startDate?: string | Date,
  endDate?: string | Date,
) => {
  try {
    const EXPENSES = transactions.filtered('type == "EXPENSE"');

    const firstExpenseDate = startDate
      ? moment(startDate)
      : moment(EXPENSES.min('addedOn') as Date);

    const currentDate = moment();
    const finalEndDate =
      endDate && moment(endDate).isAfter(currentDate)
        ? currentDate
        : moment(endDate || (EXPENSES.max('addedOn') as Date));

    const daysToConsider = getDaysBetweenDates(
      firstExpenseDate.format('YYYY-MM-DD'),
      finalEndDate.format('YYYY-MM-DD'),
    );

    const expenseDates = new Set(
      EXPENSES.map(expense => moment(expense.addedOn).format('YYYY-MM-DD')),
    );

    const daysWithoutExpenses = daysToConsider - expenseDates.size;

    // Calculate totals in one loop
    let totalExpense = 0;
    let totalIncome = 0;
    let totalLending = 0;
    let totalInvestment = 0;

    transactions.forEach(transaction => {
      switch (transaction.type) {
        case 'EXPENSE':
          totalExpense += transaction.amount;
          break;
        case 'INCOME':
          totalIncome += transaction.amount;
          break;
        case 'LENDING':
          totalLending += transaction.amount;
          break;
        case 'INVESTMENT':
          totalInvestment += transaction.amount;
          break;
      }
    });

    const totalSpending = totalExpense + totalLending + totalInvestment;
    const totalBalance = totalIncome - totalSpending;

    return {
      daysWithoutExpenses,
      totalExpense,
      totalIncome,
      totalLending,
      totalInvestment,
      totalBalance,
    };
  } catch (error) {
    return {
      daysWithoutExpenses: 0,
      totalExpense: 0,
      totalIncome: 0,
      totalLending: 0,
      totalInvestment: 0,
      totalBalance: 0,
    };
  }
};
