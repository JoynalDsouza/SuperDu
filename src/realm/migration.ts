import {BSON} from 'realm';

export const applyMigration = (realm, schemaVersion, dataImport = false) => {
  switch (schemaVersion) {
    case 2:
      migrateExpenseSchema(realm, dataImport);
      break;
    case 3:
      migrateTypes(realm, ['Investment', 'Lending', 'Income'], dataImport);
      break;
    case 4:
      break;
    case 5:
      break;
    case 6:
      migrateToCategorySchema(realm, dataImport);
      break;
    default:
      break;
  }
};

// Helper functions
const migrateExpenseSchema = (realm, dataImport) => {
  const oldObjects = realm.objects('Expense');
  if (dataImport) {
    realm.write(() => {
      oldObjects.forEach(obj => {
        realm.create('Expense', {...obj, notes: ''}, 'modified');
      });
    });
  } else {
    oldObjects.forEach(obj => {
      realm.create('Expense', {...obj, notes: ''}, 'modified');
    });
  }
};

const migrateTypes = (realm, types, dataImport) => {
  types.forEach(type => {
    const oldObjects = realm.objects(type);
    if (dataImport) {
      realm.write(() => {
        oldObjects.forEach(obj => {
          realm.create(type, {...obj, notes: ''}, 'modified');
        });
      });
    } else {
      oldObjects.forEach(obj => {
        realm.create(type, {...obj, notes: ''}, 'modified');
      });
    }
  });
};

const migrateToCategorySchema = (realm, dataImport) => {
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
    oldObjects.forEach(obj => {
      const _id = obj?._id || new BSON.ObjectID();
      categoryIdsMap[obj.name] = _id;
      if (dataImport) {
        realm.write(() => {
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
      } else {
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
      }
    });
  });

  migrateTransactions(realm, categoryIdsMap, dataImport);
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

const migrateTransactions = (realm, categoryIdsMap, dataImport) => {
  const transactionTypes = ['Investment', 'Lending', 'Income', 'Expense'];

  transactionTypes.forEach(type => {
    const oldObjects = realm.objects(type);
    oldObjects.forEach(obj => {
      if (dataImport) {
        realm.write(() => {
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
      } else {
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
      }
    });
  });
};
