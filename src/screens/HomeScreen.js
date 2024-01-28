import {useQuery} from '@realm/react';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import notifee from '@notifee/react-native';

const HomeScreen = ({navigation}) => {
  return (
    <>
      <View style={styles.container}>
        <View style={{paddingVertical: 6, backgroundColor: 'grey'}}>
          <Text style={{paddingHorizontal: 10, color: 'white'}}>
            {/* Hello, {name} */}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // fill the entire screen
  },
});

export default HomeScreen;
