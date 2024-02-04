import {FlatList, Text, View} from 'react-native';

const BudgetTable = ({budgetData}) => {
  const data = Object.keys(budgetData || {});
  return (
    <View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{flex: 1}}>Type</Text>
        <Text style={{flex: 1}}>Planned</Text>
        <Text style={{flex: 1}}>Actual</Text>
        <Text style={{flex: 1}}>Diff</Text>
      </View>
      <View>
        <FlatList
          data={data}
          keyExtractor={item => item}
          renderItem={({item}) => {
            const budgetItem = budgetData[item];
            const diff = budgetItem.actual - budgetItem.planned;
            return (
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={{flex: 1}}>{item}</Text>
                <Text style={{flex: 1}}>{budgetItem.planned}</Text>
                <Text style={{flex: 1}}>{budgetItem.actual}</Text>
                <Text style={{flex: 1}}>{diff}</Text>
              </View>
            );
          }}></FlatList>
      </View>
    </View>
  );
};

export default BudgetTable;
