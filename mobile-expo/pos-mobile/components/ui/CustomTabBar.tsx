import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/GlobalStyles';

// Aceptamos la nueva prop 'onCenterPress'
const CustomTabBar = ({ state, descriptors, navigation, onCenterPress }) => {

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        const isFocused = state.index === index;

        // Si es el tab "center" (índice 2), renderizamos el botón central
        if (route.name === 'center') {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onCenterPress} // Usamos la nueva prop
                style={styles.centerButton}
              >
                <Ionicons
                  name="chevron-up"
                  size={32}
                  color={Colors.white}
                />
              </TouchableOpacity>
            );
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
          >
            <Ionicons
              name={options.tabBarIconName || 'ellipse'} // Icono por defecto
              size={28}
              color={isFocused ? Colors.primary : Colors.darkGray}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBar,
    paddingBottom: 10,
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF7A00', // Color naranja como en la imagen
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 25, // Lo elevamos para que sobresalga
    left: '50%',
    marginLeft: -30, // Centrado perfecto (mitad del ancho)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
    zIndex: 10,
  },
});

export default CustomTabBar;
