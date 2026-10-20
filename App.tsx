import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider, useApp } from './src/AppContext';
import DishList from './src/screens/DishList';
import DishDetail from './src/screens/DishDetail';
import DishForm from './src/screens/DishForm';
import Categories from './src/screens/Categories';
import type { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function Nav() {
  const { t } = useApp();   // đổi ngôn ngữ => tiêu đề header đổi theo
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List" component={DishList} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DishDetail} options={{ title: t('dishes') }} />
        <Stack.Screen name="Form" component={DishForm}
          options={({ route }) => ({ title: route.params?.id ? t('editDish') : t('addDish') })} />
        <Stack.Screen name="Categories" component={Categories} options={{ title: t('categories') }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default function App() {
  return <AppProvider><Nav /></AppProvider>;
}
