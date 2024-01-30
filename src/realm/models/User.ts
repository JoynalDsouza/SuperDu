import {ObjectSchema} from 'realm';
import Realm, {Object, Types, BSON} from 'realm';

class ExpenseType extends Realm.Object<ExpenseType> {
  name!: string;
  isActive?: boolean;
  static schema: ObjectSchema = {
    name: 'ExpenseType',
    properties: {
      name: {type: 'string', indexed: true},
      isActive: {type: 'bool', default: true},
    },
    primaryKey: 'name',
  };
}

class IncomeType extends Realm.Object<IncomeType> {
  name!: string;
  isActive?: boolean;
  static schema: ObjectSchema = {
    name: 'IncomeType',
    properties: {
      name: {type: 'string', indexed: true},
      isActive: {type: 'bool', default: true},
    },
    primaryKey: 'name',
  };
}

class InvestmentType extends Realm.Object<InvestmentType> {
  name!: string;
  isActive?: boolean;
  static schema: ObjectSchema = {
    name: 'InvestmentType',
    properties: {
      name: {type: 'string', indexed: true},
      isActive: {type: 'bool', default: true},
    },
    primaryKey: 'name',
  };
}

class AssetType extends Realm.Object<AssetType> {
  name!: string;
  isActive?: boolean;
  static schema: ObjectSchema = {
    name: 'AssetType',
    properties: {
      name: {type: 'string', indexed: true},
      isActive: {type: 'bool', default: true},
    },
    primaryKey: 'name',
  };
}

class LendingType extends Realm.Object<LendingType> {
  name!: string;
  isActive?: boolean;
  static schema: ObjectSchema = {
    name: 'LendingType',
    properties: {
      name: {type: 'string', indexed: true},
      isActive: {type: 'bool', default: true},
    },
    primaryKey: 'name',
  };
}

class User extends Realm.Object<User> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  createdOn?: Date;
  totalAssests?: number;
  totalLiabilities?: number;
  totalLendings?: number;
  static schema: ObjectSchema = {
    name: 'User',
    properties: {
      _id: {type: 'objectId', default: new BSON.ObjectId()},
      name: {type: 'string', indexed: true},
      createdOn: {type: 'date', default: new Date()},
      totalAssets: {type: 'float', default: 0},
      totalLiabilities: {type: 'float', default: 0},
      totalLendings: {type: 'float', default: 0},
      IncomeTypes: {type: 'list', objectType: 'IncomeType'},
      ExpenseTypes: {type: 'list', objectType: 'ExpenseType'},
      InvestmentTypes: {type: 'list', objectType: 'InvestmentType'},
      AssetTypes: {type: 'list', objectType: 'AssetType'},
    },
    primaryKey: '_id',
  };
}

export {User, IncomeType, ExpenseType, InvestmentType, AssetType, LendingType};
