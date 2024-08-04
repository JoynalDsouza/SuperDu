import moment from 'moment';

export function calculateExpensesComparison(totalExpensesByType, budget = []) {
  try {
    // Create a map with default values for each expense type
    const expensesMap = {};
    for (const type in totalExpensesByType) {
      expensesMap[type] = {
        planned: 0,
        actual: totalExpensesByType[type],
      };
    }

    // Update planned values based on the budget
    for (const item of budget) {
      const type = item.type;
      if (expensesMap[type]) {
        expensesMap[type].planned = item.value;
      } else {
        // If the type doesn't exist in totalExpensesByType, add it to the map
        expensesMap[type] = {
          planned: item.value,
          actual: 0,
        };
      }
    }

    return expensesMap;
  } catch (e) {
    return {};
  }
}

export const getIncomeAllocation = (
  comparison,
  totalIncome = 0,
  expenseTypeMap,
) => {
  try {
    const allocation = Object.keys(comparison).reduce((acc, key) => {
      const {actual, planned} = comparison[key];
      let category = expenseTypeMap[key]?.category;
      if (key === 'investment' || key === 'lending') {
        category = 'SAVINGS';
      }
      if (!category) {
        category = 'No Category';
      }

      if (acc[category]) {
        acc[category].actual += actual;
        acc[category].planned += planned;
      } else {
        acc[category] = {
          actual,
          planned,
        };
      }
      // Calculate percentage
      acc[category].actualPercentage =
        totalIncome && (acc[category].actual / totalIncome) * 100;
      acc[category].plannedPercentage =
        totalIncome && (acc[category].planned / totalIncome) * 100;

      return acc; // Return the accumulated object
    }, {}); // Initialize the accumulator with an empty object
    return allocation;
  } catch (error) {
    return {};
  }
};

/**
 * Calculate the number of days without expenses for a given month.
 * @param {string} selectedMonth - The month in MM format.
 * @param {string} selectedYear - The year in YYYY format.
 * @param {number} expensesByDateLength  - The number of expenses in the selected month.
 * @return {number} Number of days without expenses.
 */
export const calculateDaysWithoutExpenses = (
  selectedMonth,
  selectedYear,
  expensesByDateLength,
) => {
  // Determine the number of days in the selected month
  const daysInMonth = moment(
    `${selectedYear}-${selectedMonth}`,
    'YYYY-MM',
  ).daysInMonth();

  // Check if the selected year and month are the current year and month
  const currentYear = moment().format('YYYY');
  const currentMonth = moment().format('MM');
  const isCurrentMonth =
    selectedYear === currentYear &&
    Number(selectedMonth) === Number(currentMonth);

  // Calculate the number of days until today if the selected month is the current month
  let daysToConsider = daysInMonth;
  if (isCurrentMonth) {
    const today = moment();
    const startOfMonth = moment().startOf('month');
    daysToConsider = today.diff(startOfMonth, 'days') + 1; // Including today
  }

  // Calculate days without expenses dynamically based on the selected month
  const daysWithoutExpenses = daysToConsider - expensesByDateLength;

  return daysWithoutExpenses;
};
