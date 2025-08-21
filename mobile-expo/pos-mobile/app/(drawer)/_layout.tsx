import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/GlobalStyles';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useAppStore } from '@/store/appStore';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '@/components/ui/Header'; // Importamos nuestro nuevo header

export default function DrawerLayout() {
  const { user } = useAppStore();
  const isDoctor = user?.role === 'doctor';

  return (
    <Drawer
      screenOptions={{
        drawerPosition: 'right',
        headerShown: true,
        header: (props) => (
            <LinearGradient
                colors={[Colors.primaryLight, Colors.primaryDark]}
                style={{ height: 100, paddingTop: 30 }} // Ajustar altura y padding
            >
                <AppHeader 
                    showDrawerButton={true}
                    DrawerButton={() => <DrawerToggleButton tintColor={Colors.white} />}
                />
            </LinearGradient>
        ),
        headerStyle: {
          backgroundColor: 'transparent', // Hacemos transparente para que se vea el gradiente
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerInactiveTintColor: Colors.white,
        drawerActiveTintColor: Colors.primary,
        drawerActiveBackgroundColor: Colors.white,
        drawerStyle: {
          backgroundColor: Colors.primary, // Mantenemos el fondo del drawer sólido
        },
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
          <Drawer.Screen 
        name="about" 
        options={{ 
          title: 'Acerca de',
          headerShown: false,
          drawerIcon: ({ color, size }) => <Ionicons name="information-circle-outline" size={size} color={color} />
        }} 
      />
      
    </Drawer>
  );
}
