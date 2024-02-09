import schemas from './schemas';
import RNFS from 'react-native-fs';

const exportToCSV = async (realm, schema) => {
  // Retrieve data from the Realm database based on schema
  const objects = realm.objects(schema.name);

  // Convert data to CSV format
  const csvData = objects.map(obj => Object.values(obj).join(',')).join('\n');

  // Define the path for the CSV file
  const csvFilePath = `${RNFS.DocumentDirectoryPath}/SuperDu/${schema.name}_data.csv`;

  try {
    // Write CSV data to file
    await RNFS.writeFile(csvFilePath, csvData, 'utf8');
    console.log(`Data exported to CSV successfully: ${csvFilePath}`);
  } catch (error) {
    console.error('Error exporting data to CSV:', error);
  }
};

export const exportRealmToCSV = async realm => {
  // Iterate over all schemas in the Realm database
  for (const schema of schemas) {
    console.log(`Exporting ${schema.name} to CSV...,`, schemas);
    await exportToCSV(realm, schema);
  }
};
