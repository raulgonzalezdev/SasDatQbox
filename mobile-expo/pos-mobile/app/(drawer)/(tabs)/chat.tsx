import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { CommonStyles, Colors, Spacing, Typography, BordersAndShadows } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import { useChatStore, Conversation, getConversationById } from '@/store/chatStore';
import { Ionicons } from '@expo/vector-icons';
import MedicalChatInterface from '@/components/chat/MedicalChatInterface';

// Componente principal del chat médico
const MedicalChatView = () => {
    const { user, isInChat, currentChatId, enterChat, exitChat } = useAppStore();
    const { conversations, setConversations, setActiveConversation, setMessages } = useChatStore();
    const [refreshing, setRefreshing] = useState(false);

    // Inicializar datos de prueba al cargar (solo una vez)
    useEffect(() => {
        console.log('🚀 Inicializando datos del chat...');
        initializeMockData();
        
        // Cleanup al desmontar: salir del chat si estamos en uno
        return () => {
            if (isInChat) {
                exitChat();
                setActiveConversation(null);
            }
        };
    }, []); // Solo se ejecuta una vez

    const initializeMockData = () => {
        // Datos simulados más realistas para el sistema médico
        const mockConversations: Conversation[] = [
            {
                id: 'conv_1',
                type: 'medical_consultation',
                appointment_id: 'apt_1',
                participants: [
                    {
                        id: user?.id || 'user_1',
                        first_name: user?.first_name || 'Dr. María',
                        last_name: user?.last_name || 'González',
                        email: user?.email || 'maria.gonzalez@hospital.com',
                        role: user?.role || 'doctor',
                        is_online: true,
                    },
                    {
                        id: 'patient_1',
                        first_name: 'Ana',
                        last_name: 'García',
                        email: 'ana.garcia@email.com',
                        role: 'patient',
                        is_online: true,
                    },
                ],
                title: 'Consulta - Ana García',
                unread_count: 2,
                is_muted: false,
                created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                patient_id: 'patient_1',
                doctor_id: user?.id || 'user_1',
                appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                medical_priority: 'medium',
                last_message: {
                    id: 'msg_1',
                    conversation_id: 'conv_1',
                    sender_id: 'patient_1',
                    sender: {
                        id: 'patient_1',
                        first_name: 'Ana',
                        last_name: 'García',
                        email: 'ana.garcia@email.com',
                        role: 'patient',
                        is_online: true,
                    },
                    content: 'Gracias, doctor. Me siento mucho mejor después del tratamiento.',
                    message_type: 'text',
                    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                },
            },
            {
                id: 'conv_2',
                type: 'medical_consultation',
                participants: [
                    {
                        id: user?.id || 'user_1',
                        first_name: user?.first_name || 'Dr. María',
                        last_name: user?.last_name || 'González',
                        email: user?.email || 'maria.gonzalez@hospital.com',
                        role: user?.role || 'doctor',
                        is_online: true,
                    },
                    {
                        id: 'patient_2',
                        first_name: 'Carlos',
                        last_name: 'Sánchez',
                        email: 'carlos.sanchez@email.com',
                        role: 'patient',
                        is_online: false,
                    },
                ],
                title: 'Seguimiento - Carlos Sánchez',
                unread_count: 0,
                is_muted: false,
                created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                medical_priority: 'low',
                last_message: {
                    id: 'msg_2',
                    conversation_id: 'conv_2',
                    sender_id: 'patient_2',
                    sender: {
                        id: 'patient_2',
                        first_name: 'Carlos',
                        last_name: 'Sánchez',
                        email: 'carlos.sanchez@email.com',
                        role: 'patient',
                        is_online: false,
                    },
                    content: '¿Podría revisar mis últimos resultados de laboratorio?',
                    message_type: 'text',
                    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                },
            },
        ];

        console.log('📝 Configurando conversaciones:', mockConversations.length);
        setConversations(mockConversations);
        
        // También cargar mensajes de muestra para estas conversaciones
        console.log('💬 Configurando mensajes...');
        setMessages('conv_1', [
            {
                id: 'msg_1',
                conversation_id: 'conv_1',
                sender_id: 'patient_1',
                sender: {
                    id: 'patient_1',
                    first_name: 'Ana',
                    last_name: 'García',
                    email: 'ana.garcia@email.com',
                    role: 'patient',
                    is_online: true,
                },
                content: 'Hola doctor, ¿cómo está? Tengo algunas preguntas sobre mi tratamiento.',
                message_type: 'text',
                created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'msg_2',
                conversation_id: 'conv_1',
                sender_id: user?.id || 'user_1',
                sender: {
                    id: user?.id || 'user_1',
                    first_name: user?.first_name || 'Dr. María',
                    last_name: user?.last_name || 'González',
                    email: user?.email || 'maria.gonzalez@hospital.com',
                    role: user?.role || 'doctor',
                    is_online: true,
                },
                content: 'Hola Ana, muy bien gracias. Claro, dime qué dudas tienes sobre el tratamiento.',
                message_type: 'text',
                created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
                updated_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
            },
            {
                id: 'msg_3',
                conversation_id: 'conv_1',
                sender_id: 'patient_1',
                sender: {
                    id: 'patient_1',
                    first_name: 'Ana',
                    last_name: 'García',
                    email: 'ana.garcia@email.com',
                    role: 'patient',
                    is_online: true,
                },
                content: 'Gracias, doctor. Me siento mucho mejor después del tratamiento.',
                message_type: 'text',
                created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            },
        ]);

        setMessages('conv_2', [
            {
                id: 'msg_4',
                conversation_id: 'conv_2',
                sender_id: 'patient_2',
                sender: {
                    id: 'patient_2',
                    first_name: 'Carlos',
                    last_name: 'Sánchez',
                    email: 'carlos.sanchez@email.com',
                    role: 'patient',
                    is_online: false,
                },
                content: '¿Podría revisar mis últimos resultados de laboratorio?',
                message_type: 'text',
                created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            },
        ]);
    };

    // Función optimizada usando store - no useEffect
    const handleConversationPress = (conversation: Conversation) => {
        console.log('🔄 Seleccionando conversación:', conversation.id, conversation.title);
        setActiveConversation(conversation);
        enterChat(conversation.id); // Una sola llamada al store
        console.log('🔄 Estado actualizado en store');
    };

    // Función optimizada usando store - no useEffect
    const handleBackFromChat = () => {
        console.log('🔙 Saliendo del chat, restaurando tabs...');
        setActiveConversation(null);
        exitChat(); // Una sola llamada al store
        console.log('🔄 Estado limpiado en store');
    };

    const getOtherParticipant = (conversation: Conversation) => {
        return conversation.participants.find(p => p.id !== user?.id);
    };

    const formatLastMessageTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        
        if (diff < 60 * 1000) return 'Ahora';
        if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m`;
        if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h`;
        
        return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    };

    const renderConversationItem = ({ item }: { item: Conversation }) => {
        const otherParticipant = getOtherParticipant(item);

    return (
            <TouchableOpacity 
                style={styles.chatItem} 
                onPress={() => handleConversationPress(item)}
            >
                <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {otherParticipant?.first_name?.charAt(0) || 'U'}
                        </Text>
                        {otherParticipant?.is_online && <View style={styles.onlineIndicator} />}
                    </View>
                        </View>
                
                        <View style={styles.chatContent}>
                    <View style={styles.chatHeader}>
                        <Text style={styles.chatName} numberOfLines={1}>
                            {otherParticipant?.first_name} {otherParticipant?.last_name}
                        </Text>
                        <Text style={styles.chatTime}>
                            {formatLastMessageTime(item.updated_at)}
                        </Text>
                        </View>
                    
                    <Text style={styles.chatMessage} numberOfLines={1}>
                        {item.last_message?.content || 'Nueva conversación'}
                    </Text>
                    
                    {item.unread_count > 0 && (
                            <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{item.unread_count}</Text>
                            </View>
                        )}
                </View>
                    </TouchableOpacity>
        );
    };

    // Si hay una conversación seleccionada en el store, mostrar el chat
    if (currentChatId && isInChat) {
        return (
            <MedicalChatInterface
                conversationId={currentChatId}
                onBack={handleBackFromChat}
            />
        );
    }

    // Vista de lista de conversaciones
    console.log('🗂️ Renderizando lista de conversaciones:', conversations.length);
    
    return (
        <View style={styles.container}>
            {conversations.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>Cargando conversaciones...</Text>
                </View>
            ) : (
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.id}
                    renderItem={renderConversationItem}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

export default function ChatScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <MedicalChatView />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        backgroundColor: Colors.white,
        borderRadius: 15,
        marginVertical: Spacing.xs,
        marginHorizontal: Spacing.md,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: Spacing.md,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: Colors.white,
        fontSize: Typography.fontSizes.lg,
        fontWeight: 'bold',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.success,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    chatContent: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    chatName: {
        fontSize: Typography.fontSizes.md,
        fontWeight: 'bold',
        color: Colors.dark,
        flex: 1,
    },
    chatTime: {
        fontSize: Typography.fontSizes.xs,
        color: Colors.darkGray,
    },
    chatMessage: {
        fontSize: Typography.fontSizes.sm,
        color: Colors.darkGray,
    },
    unreadBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
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
        fontSize: Typography.fontSizes.xs,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    emptyTitle: {
        fontSize: Typography.fontSizes.lg,
        fontWeight: Typography.fontWeights.bold as any,
        color: Colors.dark,
        textAlign: 'center',
    },
});
