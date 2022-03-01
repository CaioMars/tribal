import React from "react";
import Navigator from "./navigation/Navigator";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { QueryClientProvider, QueryClient } from "react-query";
import Toast from "react-native-toast-message";

/**
 * React Query issue
 * Ref: https://github.com/tannerlinsley/react-query/issues/1259
 */
LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Navigator>
        <StatusBar style="auto" />
        <Toast />
      </Navigator>
    </QueryClientProvider>
  );
}
