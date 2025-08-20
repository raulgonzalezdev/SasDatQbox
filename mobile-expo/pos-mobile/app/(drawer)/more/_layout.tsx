import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/GlobalStyles';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerInactiveTintColor: Colors.white,
        drawerActiveTintColor: Colors.primary,
        drawerActiveBackgroundColor: Colors.white,
        drawerStyle: {
          backgroundColor: Colors.primary,
        },
        headerLeft: () => <DrawerToggleButton tintColor={Colors.white} />,
      }}
    >
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
          title: 'Inicio',
          headerShown: false,
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />
        }} 
      />
      
    </Drawer>
  );
}
