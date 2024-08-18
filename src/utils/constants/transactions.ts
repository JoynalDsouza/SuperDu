import {CategoryType} from '../../realm/models/Account';
import {ELECTRIC_BLUE, ERROR_RED, SUCCESS_GREEN} from '../../design/theme';

export const TRANSACTION_TYPES: {name: string; value: CategoryType}[] = [
  {name: 'Expense', value: 'EXPENSE'},
  {name: 'Income', value: 'INCOME'},
  {name: 'Lending', value: 'LENDING'},
  {name: 'Investment', value: 'INVESTMENT'},
];

export const TRANSACTION_COLOR = {
  INCOME: SUCCESS_GREEN,
  EXPENSE: ERROR_RED,
  INVESTMENT: ELECTRIC_BLUE,
  LENDING: ELECTRIC_BLUE,
};

export const TRANSACTION_TYPE_ICON = {
  INCOME: '💰',
  EXPENSE: '💸',
  INVESTMENT: '📈',
  LENDING: '🤝',
};

export const TRANSACTION_FILTER_INITIAL_STATE = {
  types: [],
};
