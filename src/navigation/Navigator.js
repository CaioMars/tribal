import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as ROUTES from "./Routes";
import * as SCREENS from "../screens";
import { Button } from "react-native-elements";

const Stack = createNativeStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.DIRECTORY}
        component={SCREENS.Directory}
        options={({ navigation }) => ({
          title: "Directory",
          headerRight: () => (
            <Button
              title={"Add new"}
              type="clear"
              onPress={() => navigation.push(ROUTES.CREATE_BUSINESS)}
            />
          ),
        })}
      />
      <Stack.Screen name={ROUTES.BUSINESS} component={SCREENS.Business} />
      <Stack.Screen
        name={ROUTES.CREATE_BUSINESS}
        component={SCREENS.CreateBusiness}
        options={() => ({ title: "Create business" })}
      />
      <Stack.Screen
        name={ROUTES.CREATE_PERSON}
        component={SCREENS.CreatePerson}
        options={() => ({ title: "Create person" })}
      />
    </Stack.Navigator>
  );
}

function Navigator() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

export default Navigator;
