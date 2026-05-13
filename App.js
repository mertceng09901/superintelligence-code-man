import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import { COLORS } from './src/config/theme';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Auth Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

// User Screens
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import HomeScreen from './src/screens/HomeScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Admin Screens
import AddEditProductScreen from './src/screens/AddEditProductScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import AdminProductsScreen from './src/screens/AdminProductsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ============================================
// USER Tab Navigator
// ============================================
function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Mağaza') iconName = focused ? 'storefront' : 'storefront-outline';
          else if (route.name === 'Sepet') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'Siparişlerim') iconName = focused ? 'cube' : 'cube-outline';
          else if (route.name === 'Profil') iconName = focused ? 'person-circle' : 'person-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 0,
          height: 85,
          paddingBottom: 20,
          paddingTop: 8,
          elevation: 20,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Mağaza" component={HomeScreen} />
      <Tab.Screen name="Sepet" component={CartScreen} />
      <Tab.Screen name="Siparişlerim" component={OrdersScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ============================================
// ADMIN Tab Navigator
// ============================================
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Panel') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'Ürünler') iconName = focused ? 'phone-portrait' : 'phone-portrait-outline';
          else if (route.name === 'Profil') iconName = focused ? 'person-circle' : 'person-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 0,
          height: 85,
          paddingBottom: 20,
          paddingTop: 8,
          elevation: 20,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Panel" component={AdminDashboardScreen} />
      <Tab.Screen name="Ürünler" component={AdminProductsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ============================================
// Main Navigation Logic
// ============================================
function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={COLORS.gradientDark} style={styles.loadingGradient}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </LinearGradient>
      </View>
    );
  }

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SELLER';

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : isAdmin ? (
          <>
            <Stack.Screen name="AdminHome" component={AdminTabs} />
            <Stack.Screen name="AddEditProduct" component={AddEditProductScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="UserHome" component={UserTabs} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ============================================
// Root App Component
// ============================================
import { registerRootComponent } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);

export default App;

const styles = StyleSheet.create({
  loadingContainer: { flex: 1 },
  loadingGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});