import {CategoryType} from '../realm/models/Account';

export type TransactionFilterState = {
  types: CategoryType[];
  categories: string[];
  startDate?: Date;
  endDate?: Date;
};
