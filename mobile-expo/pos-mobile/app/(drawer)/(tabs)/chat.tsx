import React from 'react';
import { View, SafeAreaView, StyleSheet, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { CommonStyles, Colors, Spacing, Typography, BordersAndShadows } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';


// --- Vista para el Doctor ---
const DoctorChatView = () => {
    // Datos simulados de pacientes/conversaciones
    const conversations = [
        { id: '1', name: 'Ana García', lastMessage: 'Gracias, doctor. Me siento mucho mejor.', unread: 2 },
        { id: '2', name: 'Carlos Sánchez', lastMessage: '¿Podría revisar mis resultados?', unread: 0 },
        { id: '3', name: 'Lucía Fernández', lastMessage: 'Adjunto la foto de la receta.', unread: 1 },
    ];

    return (
        <View style={styles.container}>
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.chatItem} onPress={() => router.push(`/chat/${item.id}`)}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{item.name.substring(0, 1)}</Text>
                        </View>
                        <View style={styles.chatContent}>
                            <Text style={styles.chatName}>{item.name}</Text>
                            <Text style={styles.chatMessage} numberOfLines={1}>{item.lastMessage}</Text>
                        </View>
                        {item.unread > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>{item.unread}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

// --- Vista para el Paciente ---
const PatientChatView = () => {
    // Aquí iría la lógica para cargar y mostrar los mensajes de una conversación específica
    return (
        <View style={[styles.container, styles.centered]}>
            <Ionicons name="chatbubbles-outline" size={64} color={Colors.lightGray} />
            <ThemedText style={styles.title}>Mi Chat con el Doctor</ThemedText>
            <ThemedText style={styles.subtitle}>La interfaz de conversación individual se implementará aquí.</ThemedText>
        </View>
    );
};


export default function ChatScreen() {
    const { user } = useAppStore();
    const isDoctor = user?.role === 'doctor';

    return (
        <SafeAreaView style={CommonStyles.safeArea}>
            {isDoctor ? <DoctorChatView /> : <PatientChatView />}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    title: {
        fontSize: Typography.fontSizes.xl,
        fontWeight: 'bold',
        color: Colors.dark,
        marginTop: Spacing.md,
    },
    subtitle: {
        fontSize: Typography.fontSizes.md,
        color: Colors.darkGray,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
    // Estilos para la lista de chats del doctor
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    avatarText: {
        color: Colors.white,
        fontSize: Typography.fontSizes.lg,
        fontWeight: 'bold',
    },
    chatContent: {
        flex: 1,
    },
    chatName: {
        fontSize: Typography.fontSizes.md,
        fontWeight: 'bold',
        color: Colors.dark,
    },
    chatMessage: {
        fontSize: Typography.fontSizes.sm,
        color: Colors.darkGray,
    },
    unreadBadge: {
        backgroundColor: Colors.secondary,
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
});
