import {ObjectSchema} from 'realm';
import {AssetType, ExpenseType, IncomeType} from './User';

class Asset extends Realm.Object<Asset> {
  _id?: Realm.BSON.ObjectId;

  value!: number;
  type!: AssetType;
  addedOn?: Date;
  static schema: ObjectSchema = {
    name: 'Asset',
    properties: {
      _id: {type: 'objectId', default: new Realm.BSON.ObjectID()},
      value: {type: 'float', default: 0},
      type: 'AssetType',
      addedOn: {type: 'date', default: new Date()},
    },
    primaryKey: '_id',
  };
}

class Income extends Realm.Object<Income> {
  _id!: Realm.BSON.ObjectId;

  value!: number;
  type!: IncomeType;
  addedOn?: Date;

  static schema: ObjectSchema = {
    name: 'Income',
    properties: {
      _id: {type: 'objectId', default: new Realm.BSON.ObjectID()},
      value: {type: 'float', default: 0},
      type: 'IncomeType',
      addedOn: {type: 'date', default: new Date()},
    },
    primaryKey: '_id',
  };
}

class Expense extends Realm.Object<Expense> {
  _id?: Realm.BSON.ObjectId;
  value!: number;
  type!: ExpenseType;
  addedOn?: Date;

  static schema: ObjectSchema = {
    name: 'Expense',
    properties: {
      _id: {type: 'objectId', default: new Realm.BSON.ObjectID()},
      value: {type: 'float', default: 0},
      type: 'ExpenseType',
      addedOn: {type: 'date', default: new Date()},
    },
    primaryKey: '_id',
  };
}

export {Asset, Income, Expense};