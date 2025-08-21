import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/GlobalStyles';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useAppStore } from '@/store/appStore';

export default function DrawerLayout() {
  const { user } = useAppStore();
  const isDoctor = user?.role === 'doctor';

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
      <Drawer.Screen 
        name="explore" 
        options={{ 
          title: 'Explorar',
          headerShown: false,
          drawerIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="help" 
        options={{ 
          title: 'Ayuda',
          headerShown: false,
          drawerIcon: ({ color, size }) => <Ionicons name="help-circle-outline" size={size} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="profile" 
        options={{ 
          title: 'Perfil',
          headerShown: false,
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="settings" 
        options={{ 
          title: 'Configuración',
          headerShown: false,
          drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />
        }} 
      />
      
    </Drawer>
  );
}
