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
    console.log('comparison', totalIncome);
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
    console.log(error);
    return {};
  }
};
