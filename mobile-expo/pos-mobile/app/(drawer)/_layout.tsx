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
      <Drawer.Screen 
        name="profile" 
        options={{ 
          title: 'Perfil',
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="settings" 
        options={{ 
          title: 'Configuración',
          drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="help" 
        options={{ 
          title: 'Ayuda',
          drawerIcon: ({ color, size }) => <Ionicons name="help-circle-outline" size={size} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="about" 
        options={{ 
          title: 'Acerca de',
          drawerIcon: ({ color, size }) => <Ionicons name="information-circle-outline" size={size} color={color} />
        }} 
      />
    </Drawer>
  );
}
