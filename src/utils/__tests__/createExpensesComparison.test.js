import {calculateExpensesComparison} from '../createExpensesComparison';

describe('calculateExpensesComparison', () => {
  const expenseByTypeMockData = {food: 420, commute: 32502};
  const budgetMockData = [
    {type: 'investment', value: 2000},
    {type: 'commute', value: 30300},
    {type: 'lending', value: 1000},
  ];

  it('should match the snapshot', () => {
    expect(calculateExpensesComparison).toMatchSnapshot();
  });
  it('should return empty object if no params are passed ', () => {
    const res = calculateExpensesComparison();
    expect(res).toEqual({});
  });
  it('when only expenseByType is passed  ', () => {
    const res = calculateExpensesComparison(expenseByTypeMockData);
    expect(res).toMatchObject({
      food: {planned: 0, actual: 420},
      commute: {planned: 0, actual: 32502},
    });
  });
  it('when only budget is passed  ', () => {
    const res = calculateExpensesComparison(budgetMockData);
    expect(res).toMatchObject({});
  });
  it('all params are passes  ', () => {
    const res = calculateExpensesComparison(
      expenseByTypeMockData,
      budgetMockData,
    );
    expect(res).toMatchObject({
      food: {planned: 0, actual: 420},
      commute: {planned: 30300, actual: 32502},
      investment: {planned: 2000, actual: 0},
      lending: {planned: 1000, actual: 0},
    });
  });
});
