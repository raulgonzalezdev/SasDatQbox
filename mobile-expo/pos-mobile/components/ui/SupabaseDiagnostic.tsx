import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform, TextInput } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../config/env';
import Constants from 'expo-constants';

interface SupabaseDiagnosticProps {
  visible: boolean;
  onClose: () => void;
}

const SupabaseDiagnostic: React.FC<SupabaseDiagnosticProps> = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{ name: string; status: 'success' | 'error' | 'pending'; message: string }>>([]);
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    setResults([]);

    // Iniciar con resultados pendientes
    addResult('Entorno', 'pending', 'Verificando entorno...');
    addResult('Configuración', 'pending', 'Verificando configuración...');
    addResult('Cliente', 'pending', 'Creando cliente de Supabase...');
    addResult('Health Check', 'pending', 'Verificando estado del servidor...');
    addResult('Sesión Anónima', 'pending', 'Verificando sesión anónima...');
    addResult('Consulta Simple', 'pending', 'Realizando consulta simple...');
    addResult('Prueba de Login', 'pending', 'Probando inicio de sesión...');

    try {
      // 0. Verificar entorno
      const deviceType = Platform.OS === 'android' ? 'Android' : Platform.OS === 'ios' ? 'iOS' : 'Web';
      const isEmulator = Constants.executionEnvironment === 'bare';
      const deviceInfo = `${deviceType} ${isEmulator ? '(Emulador/Simulador)' : '(Dispositivo físico)'}`;
      
      updateResult('Entorno', 'success', `Dispositivo: ${deviceInfo}, Expo: ${Constants.expoVersion || 'N/A'}`);

      // 1. Verificar configuración
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        updateResult('Configuración', 'error', `Configuración incompleta: URL=${SUPABASE_URL}, KEY=${SUPABASE_ANON_KEY ? 'Presente' : 'Ausente'}`);
      } else {
        // Verificar formato de URL
        const urlFormatCorrect = !SUPABASE_URL.endsWith('/');
        const urlMessage = urlFormatCorrect 
          ? `URL: ${SUPABASE_URL}, KEY: ${SUPABASE_ANON_KEY.substring(0, 5)}...`
          : `URL tiene formato incorrecto (termina con /): ${SUPABASE_URL}`;
        
        updateResult('Configuración', urlFormatCorrect ? 'success' : 'error', urlMessage);
        
        // Verificar si la URL es adecuada para el entorno
        if (Platform.OS === 'android' && isEmulator && !SUPABASE_URL.includes('10.0.2.2')) {
          updateResult('Configuración', 'error', `Para emulador Android, la URL debería usar 10.0.2.2 en lugar de localhost o 127.0.0.1. URL actual: ${SUPABASE_URL}`);
        }
        
        if (Platform.OS === 'ios' && isEmulator && !SUPABASE_URL.includes('localhost') && !SUPABASE_URL.includes('127.0.0.1')) {
          updateResult('Configuración', 'error', `Para simulador iOS, la URL debería usar localhost o 127.0.0.1. URL actual: ${SUPABASE_URL}`);
        }
      }

      // 2. Crear cliente
      let supabase;
      try {
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
          },
        });
        updateResult('Cliente', 'success', 'Cliente creado correctamente');
      } catch (error: any) {
        updateResult('Cliente', 'error', `Error al crear cliente: ${error.message}`);
        setLoading(false);
        return;
      }

      // 3. Health check
      try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/health`);
        const responseText = await response.text();
        
        try {
          // Intentar parsear como JSON
          const responseJson = JSON.parse(responseText);
          updateResult('Health Check', 'success', `Estado: ${JSON.stringify(responseJson)}`);
        } catch (e) {
          // Si no es JSON, mostrar como texto
          if (responseText.includes('OK') || response.status === 200) {
            updateResult('Health Check', 'success', `Estado: ${responseText.substring(0, 100)}`);
          } else {
            updateResult('Health Check', 'error', `Respuesta no válida: ${responseText.substring(0, 100)}`);
          }
        }
      } catch (error: any) {
        updateResult('Health Check', 'error', `Error en health check: ${error.message}`);
      }

      // 4. Verificar sesión anónima
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          updateResult('Sesión Anónima', 'error', `Error al obtener sesión: ${error.message}`);
        } else {
          updateResult('Sesión Anónima', 'success', `Sesión: ${data.session ? 'Activa' : 'No hay sesión activa'}`);
        }
      } catch (error: any) {
        updateResult('Sesión Anónima', 'error', `Error al verificar sesión: ${error.message}`);
      }

      // 5. Realizar una consulta simple
      try {
        const { count, error } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          updateResult('Consulta Simple', 'error', `Error en consulta: ${error.message}`);
        } else {
          updateResult('Consulta Simple', 'success', `Conteo de usuarios: ${count !== null ? count : 'N/A'}`);
        }
      } catch (error: any) {
        updateResult('Consulta Simple', 'error', `Error en consulta: ${error.message}`);
      }

      // 6. Probar login con credenciales
      try {
        // Usar credenciales proporcionadas o las de prueba
        const email = testEmail || 'test@example.com';
        const password = testPassword || 'password123';
        
        updateResult('Prueba de Login', 'pending', `Probando login con: ${email}`);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          // Es normal que falle si las credenciales no existen
          if (error.message.includes('Invalid login credentials')) {
            updateResult('Prueba de Login', 'success', 'El servidor rechazó las credenciales incorrectas (comportamiento esperado)');
          } else {
            updateResult('Prueba de Login', 'error', `Error en login: ${error.message}`);
          }
        } else {
          updateResult('Prueba de Login', 'success', `Login exitoso con usuario: ${data.user?.email}`);
          // Cerrar sesión para limpiar
          await supabase.auth.signOut();
        }
      } catch (error: any) {
        updateResult('Prueba de Login', 'error', `Error en login: ${error.message}`);
        
        // Intentar capturar más detalles sobre el error
        if (error.message && error.message.includes('JSON Parse error')) {
          updateResult('Prueba de Login', 'error', `Error de análisis JSON. La respuesta del servidor no es JSON válido. Esto puede ocurrir si la URL de Supabase es incorrecta o si hay un problema con CORS.`);
          
          // Intentar hacer una solicitud simple para verificar la conexión
          try {
            const response = await fetch(`${SUPABASE_URL}/auth/v1/health`);
            const responseText = await response.text();
            updateResult('Prueba de Login', 'error', `Respuesta de health check: ${responseText.substring(0, 100)}`);
          } catch (healthCheckError: any) {
            updateResult('Prueba de Login', 'error', `Error al verificar la salud del servidor: ${healthCheckError.message}`);
          }
        }
      }

    } catch (error: any) {
      addResult('Error General', 'error', `Error en diagnóstico: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addResult = (name: string, status: 'success' | 'error' | 'pending', message: string) => {
    setResults(prev => [...prev, { name, status, message }]);
  };

  const updateResult = (name: string, status: 'success' | 'error' | 'pending', message: string) => {
    setResults(prev => prev.map(result => 
      result.name === name ? { ...result, status, message } : result
    ));
  };

  useEffect(() => {
    if (visible) {
      runDiagnostics();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Diagnóstico de Supabase</Text>
          
          <ScrollView style={styles.resultsContainer}>
            {results.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultName}>{result.name}</Text>
                  {result.status === 'pending' && <ActivityIndicator size="small" color="#0000ff" />}
                  {result.status === 'success' && <Text style={styles.successText}>✓</Text>}
                  {result.status === 'error' && <Text style={styles.errorText}>✗</Text>}
                </View>
                <Text style={[
                  styles.resultMessage,
                  result.status === 'success' && styles.successMessage,
                  result.status === 'error' && styles.errorMessage
                ]}>
                  {result.message}
                </Text>
              </View>
            ))}
            
            {loading && results.length === 0 && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Ejecutando diagnóstico...</Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.credentialsToggle}
              onPress={() => setShowCredentials(!showCredentials)}
            >
              <Text style={styles.credentialsToggleText}>
                {showCredentials ? 'Ocultar credenciales de prueba' : 'Mostrar credenciales de prueba'}
              </Text>
            </TouchableOpacity>
            
            {showCredentials && (
              <View style={styles.credentialsContainer}>
                <Text style={styles.credentialsTitle}>Credenciales para prueba de login</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email:</Text>
                  <TextInput
                    style={styles.input}
                    value={testEmail}
                    onChangeText={setTestEmail}
                    placeholder="Email para prueba (opcional)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Contraseña:</Text>
                  <TextInput
                    style={styles.input}
                    value={testPassword}
                    onChangeText={setTestPassword}
                    placeholder="Contraseña para prueba (opcional)"
                    secureTextEntry
                  />
                </View>
                
                <Text style={styles.credentialsNote}>
                  Si no se proporcionan credenciales, se usarán valores de prueba.
                </Text>
              </View>
            )}
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            {!loading && (
              <TouchableOpacity 
                style={[styles.button, styles.buttonRefresh]} 
                onPress={runDiagnostics}
              >
                <Text style={styles.buttonText}>Reintentar</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.button, styles.buttonClose]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultsContainer: {
    maxHeight: 400,
  },
  resultItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  resultName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultMessage: {
    fontSize: 14,
  },
  successText: {
    color: 'green',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
  },
  successMessage: {
    color: 'green',
  },
  errorMessage: {
    color: 'red',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  credentialsToggle: {
    marginTop: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  credentialsToggleText: {
    color: '#0066CC',
    fontWeight: 'bold',
  },
  credentialsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  credentialsTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    fontSize: 14,
  },
  credentialsNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  buttonRefresh: {
    backgroundColor: '#2196F3',
  },
  buttonClose: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SupabaseDiagnostic; 