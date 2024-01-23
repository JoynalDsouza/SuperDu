import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CreatePlan from '../screens/CreatePlan';
import PlanDetail from '../screens/PlanDetail';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreatePlan" component={CreatePlan} />
        <Stack.Screen name="PlanDetail" component={PlanDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
