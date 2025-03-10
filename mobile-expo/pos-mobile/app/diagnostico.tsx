import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, TextInput, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles } from '@/constants/GlobalStyles';
import ConnectionTest from '@/components/ui/ConnectionTest';
import SupabaseDiagnostic from '@/components/ui/SupabaseDiagnostic';
import SupabaseInfo from '@/components/ui/SupabaseInfo';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/env';
import supabase from '@/config/supabase';

export default function DiagnosticoScreen() {
  const [showConnectionTest, setShowConnectionTest] = useState(false);
  const [showSupabaseDiagnostic, setShowSupabaseDiagnostic] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleTestLogin = async () => {
    if (!testEmail || !testPassword) {
      Alert.alert('Error', 'Por favor, ingresa email y contraseña para la prueba');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      if (error) {
        Alert.alert('Error de login', `Error: ${error.message}`);
      } else {
        Alert.alert('Login exitoso', `Usuario autenticado: ${data.user?.email}`);
        // Cerrar sesión para limpiar
        await supabase.auth.signOut();
      }
    } catch (error: any) {
      Alert.alert('Error', `Error al intentar login: ${error.message}`);
      
      // Intentar capturar más detalles sobre el error
      if (error.message && error.message.includes('JSON Parse error')) {
        Alert.alert(
          'Error de análisis JSON',
          'La respuesta del servidor no es JSON válido. Esto puede ocurrir si la URL de Supabase es incorrecta o si hay un problema con CORS.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterUser = async () => {
    if (!registerEmail || !registerPassword) {
      Alert.alert('Error', 'Por favor, ingresa email y contraseña para el registro');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            first_name: 'Usuario',
            last_name: 'Prueba'
          }
        }
      });

      if (error) {
        Alert.alert('Error de registro', `Error: ${error.message}`);
      } else {
        if (data.user) {
          Alert.alert(
            'Registro exitoso', 
            `Usuario creado: ${data.user.email}\n${data.session ? 'Sesión creada' : 'Confirma tu email para iniciar sesión'}`
          );
          
          // Si hay sesión, cerrarla para limpiar
          if (data.session) {
            await supabase.auth.signOut();
          }
          
          // Copiar el email al campo de login para facilitar la prueba
          setTestEmail(registerEmail);
          setTestPassword(registerPassword);
        } else {
          Alert.alert('Registro incompleto', 'Se creó el usuario pero no se recibieron datos completos');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', `Error al intentar registro: ${error.message}`);
      
      // Intentar capturar más detalles sobre el error
      if (error.message && error.message.includes('JSON Parse error')) {
        Alert.alert(
          'Error de análisis JSON',
          'La respuesta del servidor no es JSON válido. Esto puede ocurrir si la URL de Supabase es incorrecta o si hay un problema con CORS.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const checkUserExists = async () => {
    if (!testEmail) {
      Alert.alert('Error', 'Por favor, ingresa un email para verificar');
      return;
    }

    setLoading(true);

    try {
      // Intentar recuperar contraseña como forma de verificar si el usuario existe
      const { error } = await supabase.auth.resetPasswordForEmail(testEmail);
      
      if (error) {
        if (error.message.includes('User not found')) {
          Alert.alert('Usuario no encontrado', `El email ${testEmail} no está registrado en Supabase.`);
        } else {
          Alert.alert('Error al verificar usuario', `Error: ${error.message}`);
        }
      } else {
        Alert.alert(
          'Usuario encontrado', 
          `El email ${testEmail} está registrado en Supabase. Se ha enviado un correo de recuperación de contraseña.`
        );
      }
    } catch (error: any) {
      Alert.alert('Error', `Error al verificar usuario: ${error.message}`);
      
      // Intentar capturar más detalles sobre el error
      if (error.message && error.message.includes('JSON Parse error')) {
        Alert.alert(
          'Error de análisis JSON',
          'La respuesta del servidor no es JSON válido. Esto puede ocurrir si la URL de Supabase es incorrecta o si hay un problema con CORS.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!testEmail) {
      Alert.alert('Error', 'Por favor, ingresa un email para recuperar la contraseña');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
        redirectTo: 'https://example.com/reset-password'
      });
      
      if (error) {
        Alert.alert('Error al recuperar contraseña', `Error: ${error.message}`);
      } else {
        Alert.alert(
          'Recuperación de contraseña', 
          `Se ha enviado un correo de recuperación de contraseña a ${testEmail}.`
        );
      }
    } catch (error: any) {
      Alert.alert('Error', `Error al recuperar contraseña: ${error.message}`);
      
      // Intentar capturar más detalles sobre el error
      if (error.message && error.message.includes('JSON Parse error')) {
        Alert.alert(
          'Error de análisis JSON',
          'La respuesta del servidor no es JSON válido. Esto puede ocurrir si la URL de Supabase es incorrecta o si hay un problema con CORS.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentSession = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        Alert.alert('Error al verificar sesión', `Error: ${error.message}`);
      } else {
        if (data.session) {
          Alert.alert(
            'Sesión activa', 
            `Usuario: ${data.session.user.email}\nExpira: ${new Date(data.session.expires_at! * 1000).toLocaleString()}`
          );
        } else {
          Alert.alert('Sin sesión', 'No hay una sesión activa actualmente.');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', `Error al verificar sesión: ${error.message}`);
      
      // Intentar capturar más detalles sobre el error
      if (error.message && error.message.includes('JSON Parse error')) {
        Alert.alert(
          'Error de análisis JSON',
          'La respuesta del servidor no es JSON válido. Esto puede ocurrir si la URL de Supabase es incorrecta o si hay un problema con CORS.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        Alert.alert('Error al cerrar sesión', `Error: ${error.message}`);
      } else {
        Alert.alert('Sesión cerrada', 'Se ha cerrado la sesión correctamente.');
      }
    } catch (error: any) {
      Alert.alert('Error', `Error al cerrar sesión: ${error.message}`);
      
      // Intentar capturar más detalles sobre el error
      if (error.message && error.message.includes('JSON Parse error')) {
        Alert.alert(
          'Error de análisis JSON',
          'La respuesta del servidor no es JSON válido. Esto puede ocurrir si la URL de Supabase es incorrecta o si hay un problema con CORS.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/health`);
      const responseText = await response.text();
      
      let message = '';
      try {
        // Intentar parsear como JSON
        const responseJson = JSON.parse(responseText);
        message = `Respuesta: ${JSON.stringify(responseJson)}`;
      } catch (e) {
        // Si no es JSON, mostrar como texto
        message = `Respuesta: ${responseText.substring(0, 200)}`;
      }
      
      Alert.alert(
        response.ok ? 'Conexión exitosa' : 'Error de conexión',
        `Status: ${response.status}\n${message}`
      );
    } catch (error: any) {
      Alert.alert(
        'Error de conexión',
        `No se pudo conectar con Supabase: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const testEndpoint = async () => {
    const endpoint = '/rest/v1/users?select=count';
    setLoading(true);
    
    try {
      const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      
      const responseText = await response.text();
      
      let message = '';
      try {
        // Intentar parsear como JSON
        const responseJson = JSON.parse(responseText);
        message = `Respuesta: ${JSON.stringify(responseJson)}`;
      } catch (e) {
        // Si no es JSON, mostrar como texto
        message = `Respuesta: ${responseText.substring(0, 200)}`;
      }
      
      Alert.alert(
        response.ok ? 'Conexión exitosa' : 'Error de conexión',
        `Endpoint: ${endpoint}\nStatus: ${response.status}\n${message}`
      );
    } catch (error: any) {
      Alert.alert(
        'Error de conexión',
        `No se pudo conectar con el endpoint ${endpoint}: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Diagnóstico</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ThemedView style={styles.container}>
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Información de Supabase</ThemedText>
            <SupabaseInfo showDetails={true} />
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Configuración</ThemedText>
            
            <View style={styles.configItem}>
              <ThemedText style={styles.configLabel}>URL de Supabase:</ThemedText>
              <ThemedText style={styles.configValue}>{SUPABASE_URL || 'No definida'}</ThemedText>
            </View>
            
            <View style={styles.configItem}>
              <ThemedText style={styles.configLabel}>Clave anónima:</ThemedText>
              <ThemedText style={styles.configValue}>
                {SUPABASE_ANON_KEY 
                  ? `${SUPABASE_ANON_KEY.substring(0, 5)}...${SUPABASE_ANON_KEY.substring(SUPABASE_ANON_KEY.length - 5)}` 
                  : 'No definida'}
              </ThemedText>
            </View>
            
            <TouchableOpacity 
              style={styles.testConnectionButton}
              onPress={testConnection}
              disabled={loading}
            >
              <Ionicons name="pulse-outline" size={20} color={Colors.white} style={styles.buttonIcon} />
              <ThemedText style={styles.diagnosticButtonText}>
                {loading ? 'Probando...' : 'Probar conexión directa'}
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.testConnectionButton, { backgroundColor: '#9b59b6' }]}
              onPress={testEndpoint}
              disabled={loading}
            >
              <Ionicons name="code-outline" size={20} color={Colors.white} style={styles.buttonIcon} />
              <ThemedText style={styles.diagnosticButtonText}>
                {loading ? 'Probando...' : 'Probar endpoint REST'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Registro de usuario</ThemedText>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Email:</ThemedText>
              <TextInput
                style={styles.input}
                value={registerEmail}
                onChangeText={setRegisterEmail}
                placeholder="Email para registro"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Contraseña:</ThemedText>
              <TextInput
                style={styles.input}
                value={registerPassword}
                onChangeText={setRegisterPassword}
                placeholder="Contraseña para registro"
                secureTextEntry
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.loginButton, { backgroundColor: '#27ae60' }]}
              onPress={handleRegisterUser}
              disabled={loading}
            >
              <Ionicons name="person-add-outline" size={20} color={Colors.white} style={styles.buttonIcon} />
              <ThemedText style={styles.diagnosticButtonText}>
                {loading ? 'Registrando...' : 'Registrar usuario'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Prueba de login directa</ThemedText>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Email:</ThemedText>
              <TextInput
                style={styles.input}
                value={testEmail}
                onChangeText={setTestEmail}
                placeholder="Email para prueba"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Contraseña:</ThemedText>
              <TextInput
                style={styles.input}
                value={testPassword}
                onChangeText={setTestPassword}
                placeholder="Contraseña para prueba"
                secureTextEntry
              />
            </View>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.loginButton, { flex: 1, marginRight: 5 }]}
                onPress={handleTestLogin}
                disabled={loading}
              >
                <Ionicons name="log-in-outline" size={20} color={Colors.white} style={styles.buttonIcon} />
                <ThemedText style={styles.diagnosticButtonText}>
                  {loading ? 'Probando...' : 'Probar login'}
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.loginButton, { flex: 1, marginLeft: 5, backgroundColor: '#e67e22' }]}
                onPress={checkUserExists}
                disabled={loading}
              >
                <Ionicons name="search-outline" size={20} color={Colors.white} style={styles.buttonIcon} />
                <ThemedText style={styles.diagnosticButtonText}>
                  {loading ? 'Verificando...' : 'Verificar usuario'}
                </ThemedText>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.loginButton, { backgroundColor: '#3498db', marginTop: 10 }]}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Ionicons name="key-outline" size={20} color={Colors.white} style={styles.buttonIcon} />
              <ThemedText style={styles.diagnosticButtonText}>
                {loading ? 'Enviando...' : 'Recuperar contraseña'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Herramientas de diagnóstico</ThemedText>
            
            <TouchableOpacity 
              style={styles.diagnosticButton}
              onPress={() => setShowConnectionTest(true)}
            >
              <Ionicons name="server-outline" size={24} color={Colors.white} style={styles.buttonIcon} />
              <ThemedText style={styles.diagnosticButtonText}>Probar conexión con API</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.diagnosticButton, styles.supabaseButton]}
              onPress={() => setShowSupabaseDiagnostic(true)}
            >
              <Ionicons name="construct-outline" size={24} color={Colors.white} style={styles.buttonIcon} />
              <ThemedText style={styles.diagnosticButtonText}>Ejecutar diagnóstico de Supabase</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.diagnosticButton, { backgroundColor: '#34495e' }]}
              onPress={checkCurrentSession}
              disabled={loading}
            >
              <Ionicons name="finger-print-outline" size={24} color={Colors.white} style={styles.buttonIcon} />
              <ThemedText style={styles.diagnosticButtonText}>Verificar sesión actual</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.diagnosticButton, { backgroundColor: '#e74c3c' }]}
              onPress={handleSignOut}
              disabled={loading}
            >
              <Ionicons name="log-out-outline" size={24} color={Colors.white} style={styles.buttonIcon} />
              <ThemedText style={styles.diagnosticButtonText}>Cerrar sesión</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Solución de problemas comunes</ThemedText>
            
            <View style={styles.troubleshootingItem}>
              <ThemedText style={styles.troubleshootingTitle}>Error "JSON Parse error: Unexpected character: T"</ThemedText>
              <ThemedText style={styles.troubleshootingText}>
                Este error ocurre cuando la respuesta del servidor no es JSON válido. Posibles causas:
              </ThemedText>
              <View style={styles.bulletList}>
                <ThemedText style={styles.bulletItem}>• URL de Supabase incorrecta</ThemedText>
                <ThemedText style={styles.bulletItem}>• Problemas de CORS</ThemedText>
                <ThemedText style={styles.bulletItem}>• Servidor Supabase no está ejecutándose</ThemedText>
                <ThemedText style={styles.bulletItem}>• URL termina con una barra (/)</ThemedText>
              </View>
            </View>
            
            <View style={styles.troubleshootingItem}>
              <ThemedText style={styles.troubleshootingTitle}>Error de conexión en emulador Android</ThemedText>
              <ThemedText style={styles.troubleshootingText}>
                Para emuladores Android, debes usar 10.0.2.2 en lugar de localhost o 127.0.0.1 en la URL de Supabase.
              </ThemedText>
            </View>
            
            <View style={styles.troubleshootingItem}>
              <ThemedText style={styles.troubleshootingTitle}>Error de conexión en dispositivo físico</ThemedText>
              <ThemedText style={styles.troubleshootingText}>
                Para dispositivos físicos, debes usar la IP local de tu computadora (ejemplo: 192.168.1.X) en la URL de Supabase.
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
      
      {/* Componente de prueba de conexión */}
      <ConnectionTest 
        visible={showConnectionTest} 
        onClose={() => setShowConnectionTest(false)} 
      />
      
      {/* Componente de diagnóstico de Supabase */}
      <SupabaseDiagnostic 
        visible={showSupabaseDiagnostic} 
        onClose={() => setShowSupabaseDiagnostic(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.dark,
  },
  configItem: {
    marginBottom: 8,
  },
  configLabel: {
    fontWeight: 'bold',
    color: Colors.darkGray,
    marginBottom: 4,
  },
  configValue: {
    color: Colors.dark,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontWeight: 'bold',
    color: Colors.darkGray,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  testConnectionButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  diagnosticButton: {
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  supabaseButton: {
    backgroundColor: '#3ECF8E', // Color de Supabase
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  diagnosticButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  troubleshootingItem: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  troubleshootingTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.dark,
  },
  troubleshootingText: {
    color: Colors.darkGray,
    marginBottom: 8,
  },
  bulletList: {
    marginLeft: 8,
  },
  bulletItem: {
    marginBottom: 4,
    color: Colors.darkGray,
  },
}); 