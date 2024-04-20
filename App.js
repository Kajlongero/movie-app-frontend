import "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { SocketContextProvider } from "./context/SocketContext";
import { createStackNavigator } from "@react-navigation/stack";
import { LoadingScreen } from "./screens/LoadingScreen";
import { TabsContainer } from "./screens/TabsContainer";
import { MovieDetails } from "./screens/MovieDetails";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <SocketContextProvider>
          <Stack.Navigator
            initialRouteName="loading"
            screenOptions={{
              headerShown: false,
              headerTitle: "",
              headerStyle: {
                backgroundColor: "#000",
              },
            }}
          >
            <Stack.Screen name="main" component={TabsContainer} />
            <Stack.Screen name="Movie Details" component={MovieDetails} />
            <Stack.Screen
              name="loading"
              component={LoadingScreen}
              options={{
                animationTypeForReplace: "push",
              }}
            />
          </Stack.Navigator>
        </SocketContextProvider>
      </PaperProvider>
    </NavigationContainer>
  );
}
