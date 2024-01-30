import {
  User,
  IncomeType,
  ExpenseType,
  InvestmentType,
  AssetType,
  LendingType,
} from './User';
import {Asset, Income, Expense, Lending, Investment} from './Account';

const userSchemas = [
  User,
  IncomeType,
  ExpenseType,
  InvestmentType,
  AssetType,
  LendingType,
];
const accountSchemas = [Asset, Income, Expense, Lending, Investment];

const schemas = [...userSchemas, ...accountSchemas];

export default schemas;
