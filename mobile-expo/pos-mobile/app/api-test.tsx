import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { checkHealth, HealthResponse } from '../services';
import { API_BASE_URL } from '../constants/api';

export default function ApiTestScreen() {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);
    
    try {
      console.log('Intentando conectar con el backend en:', API_BASE_URL);
      const response = await checkHealth();
      console.log('Respuesta del backend:', response);
      setHealthData(response);
    } catch (err: any) {
      console.error('Error al conectar con el backend:', err);
      setError(err.message || 'Error al conectar con el backend');
      
      // Mostrar más detalles sobre el error
      if (err.status) {
        setErrorDetails(`Código de estado: ${err.status}`);
      } else if (err.name === 'TypeError' && err.message.includes('Network request failed')) {
        setErrorDetails('Error de red: No se pudo conectar con el servidor. Verifica que el backend esté corriendo y que la URL sea correcta.');
      } else {
        setErrorDetails(`Tipo de error: ${err.name || 'Desconocido'}`);
      }
      
      setHealthData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testApiConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Prueba de API' }} />
      
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Estado de la conexión con el backend</Text>
        <Text style={styles.subtitle}>URL: {API_BASE_URL}</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066CC" />
            <Text style={styles.loadingText}>Conectando con el backend...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error de conexión</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            {errorDetails && (
              <Text style={styles.errorDetails}>{errorDetails}</Text>
            )}
            <TouchableOpacity style={styles.button} onPress={testApiConnection}>
              <Text style={styles.buttonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : healthData ? (
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>Conexión exitosa</Text>
            <View style={styles.dataContainer}>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Estado:</Text>
                <Text style={styles.dataValue}>{healthData.status}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Mensaje:</Text>
                <Text style={styles.dataValue}>{healthData.message}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Entorno:</Text>
                <Text style={styles.dataValue}>{healthData.environment}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Timestamp:</Text>
                <Text style={styles.dataValue}>{new Date(healthData.timestamp).toLocaleString()}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={testApiConnection}>
              <Text style={styles.buttonText}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff3b30',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff3b30',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  errorDetails: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  successContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#34c759',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34c759',
    marginBottom: 20,
  },
  dataContainer: {
    marginBottom: 20,
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 100,
    color: '#333',
  },
  dataValue: {
    fontSize: 16,
    flex: 1,
    color: '#666',
  },
  button: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 