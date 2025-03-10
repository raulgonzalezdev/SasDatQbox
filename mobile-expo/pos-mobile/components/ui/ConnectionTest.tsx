import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/env';

interface ConnectionTestProps {
  visible: boolean;
  onClose: () => void;
}

const ConnectionTest: React.FC<ConnectionTestProps> = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [details, setDetails] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setDetails(null);
    
    try {
      console.log('Probando conexión con Supabase:', SUPABASE_URL);
      
      // Crear cliente de Supabase para la prueba
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      
      // Probar la conexión con una consulta simple
      const startTime = Date.now();
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .limit(1);
      const endTime = Date.now();
      
      if (error) {
        console.error('Error al conectar con Supabase:', error.message);
        setError('No se pudo conectar con Supabase');
        setDetails(`Error: ${error.message}`);
        return;
      }
      
      // Probar la autenticación anónima
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('Error al verificar la sesión de Supabase:', authError.message);
        setError('Conexión establecida pero hay problemas con la autenticación');
        setDetails(`Error de autenticación: ${authError.message}`);
        return;
      }
      
      setSuccess(true);
      setDetails(
        `Conexión exitosa a Supabase\n` +
        `URL: ${SUPABASE_URL}\n` +
        `Tiempo de respuesta: ${endTime - startTime}ms\n` +
        `Usuarios encontrados: ${count || 0}\n` +
        `Sesión anónima: ${authData.session ? 'Disponible' : 'No disponible'}`
      );
      
    } catch (err: any) {
      console.error('Error de conexión:', err);
      
      setError('Error al conectar con Supabase');
      
      if (err.message && err.message.includes('Network request failed')) {
        setDetails('Error de red: Verifica que Supabase esté en ejecución y que la URL sea correcta.');
      } else {
        setDetails(`Error: ${err.message || 'Desconocido'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Prueba de conexión con Supabase</Text>
          <Text style={styles.subtitle}>URL: {SUPABASE_URL}</Text>
          
          {loading ? (
            <View style={styles.statusContainer}>
              <ActivityIndicator size="large" color="#0066CC" />
              <Text style={styles.statusText}>Conectando...</Text>
            </View>
          ) : error ? (
            <View style={[styles.statusContainer, styles.errorContainer]}>
              <Text style={styles.errorText}>Error de conexión</Text>
              <Text style={styles.detailsText}>{error}</Text>
              {details && <Text style={styles.detailsSubtext}>{details}</Text>}
            </View>
          ) : success ? (
            <View style={[styles.statusContainer, styles.successContainer]}>
              <Text style={styles.successText}>Conexión exitosa</Text>
              {details && <Text style={styles.detailsText}>{details}</Text>}
            </View>
          ) : (
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>Presiona el botón para probar la conexión</Text>
            </View>
          )}
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={onClose}
            >
              <Text style={styles.secondaryButtonText}>Cerrar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={testConnection}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Conectando...' : 'Probar conexión'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffeeee',
    borderLeftWidth: 4,
    borderLeftColor: '#ff3b30',
  },
  successContainer: {
    backgroundColor: '#eeffee',
    borderLeftWidth: 4,
    borderLeftColor: '#34c759',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff3b30',
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34c759',
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  detailsSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#0066CC',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#666',
  },
});

export default ConnectionTest; 