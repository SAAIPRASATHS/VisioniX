import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LearningProvider } from './context/LearningContext';
import HomeScreen from './screens/HomeScreen';
import LearnScreen from './screens/LearnScreen';
import ResultsScreen from './screens/ResultsScreen';

export type RootStackParamList = {
  Home: undefined;
  Learn: undefined;
  Results: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <LearningProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#ffffff',
              },
              headerTintColor: '#111827',
              headerTitleStyle: {
                fontWeight: '600',
              },
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'LearnSmart',
                headerTitleStyle: {
                  fontWeight: '700',
                  fontSize: 20,
                },
              }}
            />
            <Stack.Screen
              name="Learn"
              component={LearnScreen}
              options={{ title: 'Quiz' }}
            />
            <Stack.Screen
              name="Results"
              component={ResultsScreen}
              options={{
                title: 'Results',
                headerLeft: () => null, // Prevent going back
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </LearningProvider>
    </SafeAreaProvider>
  );
}
