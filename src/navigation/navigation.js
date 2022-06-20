import HomePage from "../pages/HomaPage";
import RelatedPage from "../pages/RelatedPage";
import LoginPage from "../pages/LoginPage";
import LoginPage2 from "../pages/LoginPage2";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function navigation() {
  return (
    <Stack.Navigator initialRouteName="登入頁面">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomePage}
      />
      <Stack.Screen
        name="相關頁面"
        component={RelatedPage}
        options={{
          headerStyle: {
            backgroundColor: "rgba(40, 192, 217, 0.9)"
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="登入頁面"
        component={LoginPage}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="輸入頁面"
        component={LoginPage2}
      />
    </Stack.Navigator>
  );
}
