import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BordersAndShadows } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import { mockUsers } from '@/data/mockUsers';

const RoleSwitcher: React.FC = () => {
  const { user, setUser } = useAppStore();

  const handleRoleSwitch = (newRole: 'doctor' | 'patient' | 'admin') => {
    Alert.alert(
      'Cambiar Rol',
      `¿Deseas cambiar a ${newRole === 'doctor' ? 'Doctor' : newRole === 'patient' ? 'Paciente' : 'Administrador'}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cambiar',
          onPress: () => {
            switch (newRole) {
              case 'doctor':
                setUser(mockUsers.doctor);
                break;
              case 'patient':
                setUser(mockUsers.patient);
                break;
              case 'admin':
                setUser(mockUsers.admin);
                break;
            }
          },
        },
      ]
    );
  };

  const roles = [
    {
      key: 'doctor',
      title: 'Doctor',
      icon: 'medical',
      color: Colors.success,
      description: 'Vista médica profesional',
    },
    {
      key: 'patient',
      title: 'Paciente',
      icon: 'person',
      color: Colors.primary,
      description: 'Vista de paciente',
    },
    {
      key: 'admin',
      title: 'Admin',
      icon: 'settings',
      color: Colors.warning,
      description: 'Vista administrativa',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="swap-horizontal" size={24} color={Colors.primary} />
        <ThemedText style={styles.title}>Cambiar Rol (Testing)</ThemedText>
      </View>
      
      <View style={styles.currentRole}>
        <ThemedText style={styles.currentText}>
          Rol actual: {user?.role === 'doctor' ? 'Doctor' : 
                      user?.role === 'patient' ? 'Paciente' : 
                      user?.role === 'admin' ? 'Administrador' : 'No definido'}
        </ThemedText>
        <ThemedText style={styles.currentUser}>
          {user?.first_name} {user?.last_name}
        </ThemedText>
      </View>

      <View style={styles.rolesList}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.key}
            style={[
              styles.roleCard,
              user?.role === role.key && styles.activeRoleCard
            ]}
            onPress={() => handleRoleSwitch(role.key as any)}
          >
            <View style={[styles.roleIcon, { backgroundColor: role.color }]}>
              <Ionicons name={role.icon as any} size={24} color={Colors.white} />
            </View>
            
            <View style={styles.roleContent}>
              <ThemedText style={[
                styles.roleTitle,
                user?.role === role.key && styles.activeRoleTitle
              ]}>
                {role.title}
              </ThemedText>
              <ThemedText style={styles.roleDescription}>
                {role.description}
              </ThemedText>
            </View>
            
            {user?.role === role.key && (
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.warning}>
        <Ionicons name="information-circle" size={16} color={Colors.warning} />
        <ThemedText style={styles.warningText}>
          Solo para desarrollo. En producción los roles se asignan desde el backend.
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    margin: Spacing.lg,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginLeft: Spacing.sm,
  },
  currentRole: {
    backgroundColor: Colors.lightGray,
    borderRadius: 15,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  currentText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.dark,
    fontWeight: Typography.fontWeights.medium,
    marginBottom: Spacing.xs,
  },
  currentUser: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  rolesList: {
    marginBottom: Spacing.lg,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 15,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeRoleCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: Colors.success,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  activeRoleTitle: {
    color: Colors.success,
  },
  roleDescription: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 10,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  warningText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.warning,
    marginLeft: Spacing.sm,
    flex: 1,
  },
});

export default RoleSwitcher;
