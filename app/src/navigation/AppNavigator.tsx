import React from "react";
import GroceryListScreen from "../screens/GroceryListScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  GroceryList: undefined;
};

export default function AppNavigator() {
  return <GroceryListScreen />;
}
