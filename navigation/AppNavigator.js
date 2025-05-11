import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/Home";
import NewUserInfoScreen from "../screens/user/New";
import NewExpenseScreen from "../screens/expenses/New";
import EditExpenseScreen from "../screens/expenses/Edit";
import ProfileScreen from "../screens/user/Profile";

export default function AppNavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="NewUserInfo"
        component={NewUserInfoScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="NewExpense"
        component={NewExpenseScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EditExpense"
        component={EditExpenseScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
