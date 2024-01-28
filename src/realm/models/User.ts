import {ObjectSchema} from 'realm';
import Realm, {Object, Types, BSON} from 'realm';

class ExpenseType extends Realm.Object<ExpenseType> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  isActive?: boolean;
  static schema: ObjectSchema = {
    name: 'ExpenseType',
    properties: {
      _id: {type: 'objectId', default: new BSON.ObjectId()},
      name: {type: 'string', indexed: true},
      isActive: {type: 'bool', default: true},
    },
    primaryKey: '_id',
  };
}

class IncomeType extends Realm.Object<IncomeType> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  isActive?: boolean;
  static schema: ObjectSchema = {
    name: 'IncomeType',
    properties: {
      _id: {type: 'objectId', default: new BSON.ObjectId()},

      name: {type: 'string', indexed: true},
      isActive: {type: 'bool', default: true},
    },
    primaryKey: '_id',
  };
}

class InvestmentType extends Realm.Object<InvestmentType> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  isActive?: boolean;
  static schema: ObjectSchema = {
    name: 'InvestmentType',
    properties: {
      _id: {type: 'objectId', default: new BSON.ObjectId()},

      name: {type: 'string', indexed: true},
      isActive: {type: 'bool', default: true},
    },
    primaryKey: '_id',
  };
}

class User extends Realm.Object<User> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  totalAssests?: number;
  totalLiabilities?: number;
  totalLendings?: number;
  static schema: ObjectSchema = {
    name: 'User',
    properties: {
      _id: {type: 'objectId', default: new BSON.ObjectId()},
      name: {type: 'string', indexed: true},
      totalAssets: {type: 'float', default: 0},
      totalLiabilities: {type: 'float', default: 0},
      totalLendings: {type: 'float', default: 0},
      IncomeTypes: {type: 'list', objectType: 'IncomeType'},
      ExpenseTypes: {type: 'list', objectType: 'ExpenseType'},
      InvestmentTypes: {type: 'list', objectType: 'InvestmentType'},
    },
    primaryKey: '_id',
  };
}

export {User, IncomeType, ExpenseType, InvestmentType};
