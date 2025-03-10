import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../config/env';
import { checkSupabaseConnection, checkSupabaseAuth } from '../../config/supabase';
import { Colors } from '../../constants/GlobalStyles';

interface SupabaseInfoProps {
  showDetails?: boolean;
}

const SupabaseInfo: React.FC<SupabaseInfoProps> = ({ showDetails = false }) => {
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [authStatus, setAuthStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [expanded, setExpanded] = useState(showDetails);

  useEffect(() => {
    if (expanded) {
      checkConnection();
    }
  }, [expanded]);

  const checkConnection = async () => {
    const connection = await checkSupabaseConnection();
    setConnectionStatus(connection);
    
    const auth = await checkSupabaseAuth();
    setAuthStatus(auth);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.title}>Supabase</Text>
        <View style={[
          styles.statusIndicator, 
          connectionStatus?.success ? styles.statusSuccess : 
          connectionStatus === null ? styles.statusUnknown : styles.statusError
        ]} />
      </TouchableOpacity>
      
      {expanded && (
        <ScrollView style={styles.detailsContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>URL:</Text>
            <Text style={styles.value}>{SUPABASE_URL || 'No definida'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Clave anónima:</Text>
            <Text style={styles.value}>
              {SUPABASE_ANON_KEY 
                ? `${SUPABASE_ANON_KEY.substring(0, 5)}...${SUPABASE_ANON_KEY.substring(SUPABASE_ANON_KEY.length - 5)}` 
                : 'No definida'}
            </Text>
          </View>
          
          {connectionStatus && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Conexión:</Text>
              <Text style={[
                styles.value, 
                connectionStatus.success ? styles.successText : styles.errorText
              ]}>
                {connectionStatus.success ? 'Conectado' : 'Error'}
              </Text>
            </View>
          )}
          
          {connectionStatus && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Detalles:</Text>
              <Text style={styles.value}>{connectionStatus.message}</Text>
            </View>
          )}
          
          {authStatus && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Autenticación:</Text>
              <Text style={[
                styles.value, 
                authStatus.success ? styles.successText : styles.errorText
              ]}>
                {authStatus.message}
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={checkConnection}
          >
            <Text style={styles.refreshButtonText}>Actualizar</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusSuccess: {
    backgroundColor: 'green',
  },
  statusError: {
    backgroundColor: 'red',
  },
  statusUnknown: {
    backgroundColor: 'gray',
  },
  detailsContainer: {
    padding: 12,
    maxHeight: 200,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    width: 100,
    color: '#555',
  },
  value: {
    flex: 1,
    color: '#333',
  },
  successText: {
    color: 'green',
  },
  errorText: {
    color: 'red',
  },
  refreshButton: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SupabaseInfo; 