import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/GlobalStyles';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useAppStore } from '@/store/appStore';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '@/components/ui/Header'; // Importamos nuestro nuevo header
import AuthGuard from '@/components/auth/AuthGuard';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
// NavigationProvider ya no es necesario - usando Zustand store

// Componente personalizado para el drawer con gradiente
const CustomDrawerContent = (props: any) => {
  const { navigation, state } = props;
  
  const drawerItems = [
    { name: '(tabs)', title: 'Inicio', icon: 'home-outline' },
    { name: 'explore', title: 'Explorar', icon: 'search-outline' },
    { name: 'help', title: 'Ayuda', icon: 'help-circle-outline' },
    { name: 'profile', title: 'Perfil', icon: 'person-outline' },
    { name: 'settings', title: 'Configuración', icon: 'settings-outline' },
    { name: 'about', title: 'Acerca de', icon: 'information-circle-outline' },
  ];

  return (
    <View style={styles.drawerContainer}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]} // Ajustamos para que coincida mejor con el header
        style={styles.gradientContainer}
      >
        <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
          <View style={styles.drawerContent}>
            {drawerItems.map((item, index) => {
              const isActive = state.index === index;
              return (
                <TouchableOpacity
                  key={item.name}
                  style={[
                    styles.drawerItem,
                    isActive && styles.drawerItemActive
                  ]}
                  onPress={() => navigation.navigate(item.name)}
                >
                  <Ionicons 
                    name={item.icon as any} 
                    size={24} 
                    color={Colors.white} 
                    style={styles.drawerIcon}
                  />
                  <Text style={styles.drawerLabel}>{item.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </DrawerContentScrollView>
      </LinearGradient>
    </View>
  );
};

// Componente principal usando directamente el store
export default function DrawerLayout() {
  const { user, isInChat } = useAppStore(); // Directamente del store
  const isDoctor = user?.role === 'doctor';

  return (
    <AuthGuard requireAuth={true}>
      <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        headerShown: !isInChat, // Ocultar header cuando estamos en chat
        header: (props) => (
            <LinearGradient
                colors={[Colors.primaryLight, Colors.primaryDark]}
                style={{ height: 80, paddingTop: 20 }} // Reducida altura de 100 a 80 y padding de 30 a 20
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
      }}
    >
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
          title: 'Inicio',
          // headerShown heredará true del screenOptions
        }} 
      />
      <Drawer.Screen 
        name="explore" 
        options={{ 
          title: 'Explorar',
          // headerShown heredará true del screenOptions
        }} 
      />
      <Drawer.Screen 
        name="help" 
        options={{ 
          title: 'Ayuda',
          // headerShown heredará true del screenOptions
        }} 
      />
      <Drawer.Screen 
        name="profile" 
        options={{ 
          title: 'Perfil',
          // headerShown heredará true del screenOptions
        }} 
      />
      <Drawer.Screen 
        name="settings" 
        options={{ 
          title: 'Configuración',
          // headerShown heredará true del screenOptions
        }} 
      />
      <Drawer.Screen 
        name="about" 
        options={{ 
          title: 'Acerca de',
          // headerShown heredará true del screenOptions
        }} 
      />
      
    </Drawer>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  gradientContainer: {
    flex: 1,
    borderTopLeftRadius: 25, // Esquinas muy redondeadas
    borderBottomLeftRadius: 25, // Esquinas muy redondeadas
    overflow: 'hidden', // Para que el gradiente respete las esquinas redondeadas
  },
  drawerContent: {
    flex: 1,
    paddingTop: 50, // Espacio superior
    paddingHorizontal: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15, // También redondeamos más los items
    marginVertical: 5,
  },
  drawerItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Un poco más visible el estado activo
  },
  drawerIcon: {
    marginRight: 15,
  },
  drawerLabel: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500',
  },
});
