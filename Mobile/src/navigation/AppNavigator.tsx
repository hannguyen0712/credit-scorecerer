import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useAuth} from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import DashboardScreen from '../screens/DashboardScreen';
import CreditAnalysisScreen from '../screens/CreditAnalysisScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import SpendingScreen from '../screens/SpendingScreen';
import EducationScreen from '../screens/EducationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {theme} from '../styles/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Credit':
              iconName = 'credit-card';
              break;
            case 'Recommendations':
              iconName = 'lightbulb';
              break;
            case 'Spending':
              iconName = 'trending-up';
              break;
            case 'Education':
              iconName = 'school';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{title: 'Overview'}}
      />
      <Tab.Screen
        name="Credit"
        component={CreditAnalysisScreen}
        options={{title: 'Credit Health'}}
      />
      <Tab.Screen
        name="Recommendations"
        component={RecommendationsScreen}
        options={{title: 'AI Tips'}}
      />
      <Tab.Screen
        name="Spending"
        component={SpendingScreen}
        options={{title: 'Spending'}}
      />
      <Tab.Screen
        name="Education"
        component={EducationScreen}
        options={{title: 'Learn'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const {isAuthenticated, isLoading} = useAuth();

  if (isLoading) {
    return null; // You can add a loading screen here
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;

