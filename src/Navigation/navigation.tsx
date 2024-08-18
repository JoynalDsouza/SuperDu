import React from 'react';
import {
  NavigationContainer,
  CommonActions,
  StackActions,
  NavigationContainerRef,
  ParamListBase,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import Dashboard from '../screens/Dashboard';
import Overview from '../screens/OverviewScreen';
import HomeScreen from '../screens/HomeScreen';
import ManageTransaction from '../screens/ManageTransaction';
import Settings from '../screens/Settings';
import {PRIMARY_BACKGROUND, SUCCESS_GREEN} from '../design/theme';
import {
  NavigationActionType,
  StackParamList,
  TabParamList,
} from './navigation.types';
import TransactionsScreen from '../screens/TransactionsScreen';
import Text from '../components/common/Text';

const Stack = createNativeStackNavigator<StackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Define the type for the navigation ref
const navigationRef = React.createRef<NavigationContainerRef<ParamListBase>>();

// Define the type for navigation actions

export function rootNavigate<T extends keyof (StackParamList & TabParamList)>(
  name?: T,
  action: NavigationActionType = 'back',
  params?: (StackParamList & TabParamList)[T],
) {
  try {
    if (navigationRef?.current?.getRootState()) {
      if (action === 'navigate') {
        navigationRef.current?.navigate(name as string, params as any);
      } else if (action === 'replace') {
        navigationRef.current.dispatch(
          StackActions.replace(name, params as any),
        );
      } else if (action === 'push') {
        navigationRef.current.dispatch(StackActions.push(name, params as any));
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
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarAllowFontScaling: true,
        tabBarActiveTintColor: SUCCESS_GREEN,
        tabBarInactiveBackgroundColor: PRIMARY_BACKGROUND,
        tabBarActiveBackgroundColor: PRIMARY_BACKGROUND,
      }}>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: () => <Text fontSize={20}>🚀</Text>,
        }}
      />
      <Tab.Screen
        name="Overview"
        component={Overview}
        options={{
          tabBarIcon: () => <Text fontSize={20}>👁️</Text>,
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarIcon: () => <Text fontSize={20}>💵</Text>,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: () => <Text fontSize={20}>🔧</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

const Navigation: React.FC = () => {
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
        <Stack.Screen
          name="ManageTransaction"
          component={ManageTransaction}
          initialParams={{transactionId: undefined}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
