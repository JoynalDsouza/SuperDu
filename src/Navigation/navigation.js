import React from 'react';

import {
  NavigationContainer,
  CommonActions,
  StackActions,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import Dashboard from '../screens/Dashboard';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Overview from '../screens/OverviewScreen';
import HomeScreen from '../screens/HomeScreen';
import Settings from '../screens/Settings';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navigationRef = React.createRef();

export function rootNavigate(name, action = 'back', params = null) {
  try {
    if (navigationRef?.current?.getRootState()) {
      if (action === 'navigate') {
        navigationRef.current?.navigate(name, params);
      } else if (action === 'replace') {
        navigationRef.current.dispatch(StackActions.replace(name, params));
      } else if (action === 'push') {
        navigationRef.current.dispatch(StackActions.push(name, params));
      } else if (action === 'reset') {
        navigationRef.current.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name, params}],
          }),
        );
      } else if (action === 'back') {
        navigationRef.current?.goBack();
      }
    } else {
      /* The `setTimeout` function is used to delay the execution of a function by a specified number of
   milliseconds. In this case, it is used to delay the execution of the `rootNavigate` function by 100
   milliseconds. This is done to ensure that the navigationRef is ready before attempting to navigate.
   If the navigationRef is not ready, the function is called again after a short delay. This is a
   workaround to handle cases where the navigationRef is not immediately ready. */
      setTimeout(() => {
        rootNavigate(name, action, params);
      }, 100);
    }
  } catch (err) {
    console.log(err);
    setTimeout(() => {
      rootNavigate(name, action, params);
    }, 100);
  }
}

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Overview" component={Overview} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

const Navigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />

        <Stack.Screen name="Home" component={MyTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
