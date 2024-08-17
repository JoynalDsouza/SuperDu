import {SCHEMA_VERSION} from '../../App';
import schemas from '../realm/models/schemas';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import {BSON} from 'realm';
import {Platform} from 'react-native';
import {applyMigration} from '../realm/migration';

export const exportRealmData = async realm => {
  try {
    // // Export data from all schemas
    const exportData = {
      schemaVersion: SCHEMA_VERSION,
      data: {},
    };

    schemas.forEach(schema => {
      const objects = realm.objects(schema.name);
      exportData.data[schema.name] = Array.from(objects);
    });
    const exportJson = JSON.stringify(exportData);
    // Save to file
    const filePath =
      Platform.OS == 'android'
        ? `${RNFS.DownloadDirectoryPath}/export.json`
        : `${RNFS.DocumentDirectoryPath}/export.json`;

    await RNFS.writeFile(filePath, exportJson, 'utf8');
    // Share the file
    // await Share.open({
    //   title: 'Share Data',
    //   url: `file://${filePath}`,
    //   type: 'application/json',
    // });
  } catch (error) {
    console.log(error);
  }
};

export const importRealmData = async realm => {
  try {
    // Pick a JSON file
    const result = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.allFiles],
    });

    // Read file content
    const fileContent = await RNFS.readFile(result.uri, 'utf8');
    const importData = JSON.parse(fileContent);

    // Write data to Realm
    realm.write(() => {
      schemas.forEach(schema => {
        const data = importData.data[schema.name];
        if (data) {
          data.forEach(item => {
            const newItem = {
              ...item,
            };

            if (item?._id) {
              newItem._id = new BSON.ObjectID(item._id);
            }
            realm.create(schema.name, newItem, 'modified');
          });
        }
      });
    });

    // Migration process if needed
    const schemaVersion = importData.schemaVersion || 0;

    if (schemaVersion < SCHEMA_VERSION) {
      if (schemaVersion < 2) {
        applyMigration(realm, 2);
      }
      if (schemaVersion < 3) {
        applyMigration(realm, 3);
      }
      if (schemaVersion < 6) {
        applyMigration(realm, 6);
      }
    }
  } catch (error) {
    if (!DocumentPicker.isCancel(error)) {
      // console.error('Error importing Realm data:', error);
    }
  }
};
