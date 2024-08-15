import {ObjectSchema, Object, BSON} from 'realm';
import {
  AssetType,
  ExpenseType,
  IncomeType,
  InvestmentType,
  LendingType,
} from './User';

export type CategoryType = 'INVESTMENT' | 'EXPENSE' | 'INCOME' | 'LENDING';

class Asset extends Object<Asset> {
  _id?: BSON.ObjectId;

  value!: number;
  type!: AssetType;
  addedOn?: Date;

  static schema: ObjectSchema = {
    name: 'Asset',
    properties: {
      _id: {type: 'objectId', default: new BSON.ObjectID()},
      value: {type: 'float', default: 0},
      type: 'AssetType',
      addedOn: {type: 'date', default: new Date()},
    },
    primaryKey: '_id',
  };
}

class Investment extends Object<Investment> {
  _id?: BSON.ObjectId;

  value!: number;
  type!: InvestmentType;
  addedOn?: Date;
  notes?: string;

  static schema: ObjectSchema = {
    name: 'Investment',
    properties: {
      _id: {type: 'objectId', default: new BSON.ObjectID()},
      value: {type: 'float', default: 0},
      type: 'InvestmentType',
      addedOn: {type: 'date', default: new Date()},
      notes: {type: 'string', default: '', optional: true},
    },
    primaryKey: '_id',
  };
}

class Income extends Object<Income> {
  _id!: BSON.ObjectId;

  value!: number;
  type!: IncomeType;
  addedOn?: Date;
  notes?: string;

  static schema: ObjectSchema = {
    name: 'Income',
    properties: {
      _id: {type: 'objectId', default: new BSON.ObjectID()},
      value: {type: 'float', default: 0},
      type: 'IncomeType',
      addedOn: {type: 'date', default: new Date()},
      notes: {type: 'string', default: '', optional: true},
    },
    primaryKey: '_id',
  };
}

class Expense extends Object<Expense> {
  _id?: BSON.ObjectId;
  value!: number;
  type!: ExpenseType;
  addedOn?: Date;
  notes?: string;

  static schema: ObjectSchema = {
    name: 'Expense',
    properties: {
      _id: {type: 'objectId', default: new BSON.ObjectID()},
      value: {type: 'float', default: 0},
      type: 'ExpenseType',
      addedOn: {type: 'date', default: new Date()},
      notes: {type: 'string', default: ''},
    },
    primaryKey: '_id',
  };
}

class Lending extends Object<Lending> {
  _id?: BSON.ObjectId;
  value!: number;
  type!: LendingType;
  addedOn?: Date;
  notes?: string;

  static schema: ObjectSchema = {
    name: 'Lending',
    properties: {
      _id: {type: 'objectId', default: new BSON.ObjectID()},
      value: {type: 'float', default: 0},
      type: 'LendingType',
      addedOn: {type: 'date', default: new Date()},
      notes: {type: 'string', default: '', optional: true},
    },
    primaryKey: '_id',
  };
}

class BudgetType extends Object<BudgetType> {
  value!: number;
  type!: string;

  static schema: ObjectSchema = {
    name: 'BudgetType',
    properties: {
      value: {type: 'float', default: 0},
      type: {type: 'string'},
    },
  };
}

class Budget extends Object<Budget> {
  budget!: Realm.List<BudgetType>;
  for?: string;

  static schema: ObjectSchema = {
    name: 'Budget',
    properties: {
      budget: 'BudgetType[]',
      for: {type: 'string'},
    },
    primaryKey: 'for',
  };
}

class AccountDetails extends Object<AccountDetails> {
  _id?: BSON.ObjectId;
  name!: string;
  type?: string;
  balance?: number;
  addedOn?: Date;
  notes?: string;
  isActive?: boolean;

  static schema: ObjectSchema = {
    name: 'AccountDetails',
    properties: {
      _id: {type: 'objectId', default: new BSON.ObjectID()},
      name: {type: 'string'},
      type: {type: 'string', default: '', optional: true},
      balance: {type: 'float', default: 0},
      addedOn: {type: 'date', default: new Date()},
      notes: {type: 'string', default: '', optional: true},
      isActive: {type: 'bool', default: true, optional: true},
    },
    primaryKey: '_id',
  };
}

class Category extends Object<Category> {
  _id?: BSON.ObjectId;
  name!: string;
  type!: CategoryType;
  image?: string;
  isActive?: boolean;

  static schema: ObjectSchema = {
    name: 'Category',
    properties: {
      _id: {type: 'objectId', default: new BSON.ObjectID()},
      name: {type: 'string'},
      image: {type: 'string', optional: true, default: ''},
      type: {type: 'string'},
      isActive: {type: 'bool', default: true, optional: true},
    },
    primaryKey: '_id',
  };
}
class Transaction extends Object<Transaction> {
  _id?: BSON.ObjectId;
  amount!: number;
  type?: CategoryType;
  category?: Category;
  addedOn?: Date;
  modifiedOn?: Date;
  notes?: string;
  from?: AccountDetails;

  static schema: ObjectSchema = {
    name: 'Transaction',
    properties: {
      _id: {type: 'objectId', default: new BSON.ObjectID()},
      amount: {type: 'float', default: 0},
      type: {type: 'string', default: '', optional: true},
      category: 'Category',
      addedOn: {type: 'date', default: new Date()},
      modifiedOn: {type: 'date', default: new Date()},
      notes: {type: 'string', default: '', optional: true},
      from: 'AccountDetails',
    },
    primaryKey: '_id',
  };
}

export {
  Asset,
  Income,
  Expense,
  Lending,
  Investment,
  Budget,
  BudgetType,
  Category,
  Transaction,
  AccountDetails,
};
