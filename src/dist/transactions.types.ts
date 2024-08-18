import {CategoryType} from '../realm/models/Account';

export type TransactionFilterState = {
  types: CategoryType[];
  startDate?: Date;
  endDate?: Date;
};
