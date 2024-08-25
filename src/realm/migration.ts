import {BSON} from 'realm';

export const applyMigration = (realm, schemaVersion) => {
  switch (schemaVersion) {
    case 2:
      migrateExpenseSchema(realm);
      break;
    case 3:
      migrateTypes(realm, ['Investment', 'Lending', 'Income']);
      break;
    case 4:
      break;
    case 5:
      break;
    case 6:
      migrateToCategorySchema(realm);
      break;
    default:
      break;
  }
};

// Helper functions
const migrateExpenseSchema = realm => {
  const oldObjects = realm.objects('Expense');
  realm.write(() => {
    oldObjects.forEach(obj => {
      realm.create('Expense', {...obj, notes: ''}, 'modified');
    });
  });
};

const migrateTypes = (realm, types) => {
  types.forEach(type => {
    const oldObjects = realm.objects(type);
    realm.write(() => {
      oldObjects.forEach(obj => {
        realm.create(type, {...obj, notes: ''}, 'modified');
      });
    });
  });
};

const migrateToCategorySchema = realm => {
  const categoryMap = {
    ExpenseType: 'EXPENSE',
    IncomeType: 'INCOME',
    InvestmentType: 'INVESTMENT',
    LendingType: 'LENDING',
  };

  const categoryIdsMap = {};

  const categoryTypes = [
    'ExpenseType',
    'IncomeType',
    'InvestmentType',
    'LendingType',
  ];

  categoryTypes.forEach(type => {
    const oldObjects = realm.objects(type);
    realm.write(() => {
      oldObjects.forEach(obj => {
        const _id = obj?._id || new BSON.ObjectID();
        categoryIdsMap[obj.name] = _id;
        realm.create(
          'Category',
          {
            _id,
            name: obj.name,
            type: categoryMap[type],
            isActive: obj.isActive,
            transactionCategory: getTransactionCategory(type, obj),
          },
          'modified',
        );
      });
    });
  });

  migrateTransactions(realm, categoryIdsMap);
};

const getTransactionCategory = (type, obj) => {
  switch (type) {
    case 'ExpenseType':
      return obj?.category || 'NEED';
    case 'LendingType':
    case 'InvestmentType':
      return 'SAVINGS';
    case 'IncomeType':
    default:
      return '';
  }
};

const migrateTransactions = (realm, categoryIdsMap) => {
  const transactionTypes = ['Investment', 'Lending', 'Income', 'Expense'];

  transactionTypes.forEach(type => {
    const oldObjects = realm.objects(type);
    realm.write(() => {
      oldObjects.forEach(obj => {
        realm.create(
          'Transaction',
          {
            _id: obj._id,
            amount: obj.value,
            type: type?.toUpperCase(),
            category: realm.objectForPrimaryKey(
              'Category',
              categoryIdsMap[obj.type.name],
            ),
            addedOn: obj.addedOn,
            modifiedOn: obj.addedOn,
            notes: obj.notes,
            from: null,
          },
          'modified',
        );
      });
    });
  });
};
