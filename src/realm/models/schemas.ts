import {User, IncomeType, ExpenseType, InvestmentType, AssetType} from './User';
import {Asset, Income, Expense} from './Account';

const userSchemas = [User, IncomeType, ExpenseType, InvestmentType, AssetType];
const accountSchemas = [Asset, Income, Expense];

const schemas = [...userSchemas, ...accountSchemas];

export default schemas;
