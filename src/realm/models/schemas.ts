import {
  User,
  IncomeType,
  ExpenseType,
  InvestmentType,
  AssetType,
  LendingType,
} from './User';
import {
  Asset,
  Income,
  Expense,
  Lending,
  Investment,
  Budget,
  BudgetType,
  Category,
  AccountDetails,
  Transaction,
} from './Account';

const userSchemas = [
  User,
  IncomeType,
  ExpenseType,
  InvestmentType,
  AssetType,
  LendingType,
];
const accountSchemas = [
  Asset,
  Income,
  Expense,
  Lending,
  Investment,
  Budget,
  BudgetType,
  Category,
  AccountDetails,
  Transaction,
];

const schemas = [...userSchemas, ...accountSchemas];

export default schemas;
