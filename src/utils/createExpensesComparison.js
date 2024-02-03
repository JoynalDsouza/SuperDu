export function calculateExpensesComparison(totalExpensesByType, budget) {
  const result = [];

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
}
