import { ChatMessage, Conversation } from '@/store/chatStore';

// Datos mock para mensajes de prueba
export const generateMockMessages = (conversationId: string, currentUserId: string): ChatMessage[] => {
  const baseMessages: Omit<ChatMessage, 'id' | 'conversation_id' | 'created_at' | 'updated_at'>[] = [
    {
      sender_id: 'patient_1',
      sender: {
        id: 'patient_1',
        first_name: 'Ana',
        last_name: 'García',
        email: 'ana.garcia@email.com',
        role: 'patient',
        is_online: true,
      },
      content: 'Buenos días, doctor. ¿Cómo está?',
      message_type: 'text',
    },
    {
      sender_id: currentUserId,
      sender: {
        id: currentUserId,
        first_name: 'Dr. María',
        last_name: 'González',
        email: 'maria.gonzalez@hospital.com',
        role: 'doctor',
        is_online: true,
      },
      content: 'Buenos días, Ana. Muy bien, gracias. ¿Cómo se siente después del último tratamiento?',
      message_type: 'text',
    },
    {
      sender_id: 'patient_1',
      sender: {
        id: 'patient_1',
        first_name: 'Ana',
        last_name: 'García',
        email: 'ana.garcia@email.com',
        role: 'patient',
        is_online: true,
      },
      content: 'Mucho mejor, doctora. El dolor ha disminuido considerablemente.',
      message_type: 'text',
    },
    {
      sender_id: currentUserId,
      sender: {
        id: currentUserId,
        first_name: 'Dr. María',
        last_name: 'González',
        email: 'maria.gonzalez@hospital.com',
        role: 'doctor',
        is_online: true,
      },
      content: 'Excelente. Le voy a enviar una nueva receta para continuar con el tratamiento.',
      message_type: 'text',
    },
    {
      sender_id: currentUserId,
      sender: {
        id: currentUserId,
        first_name: 'Dr. María',
        last_name: 'González',
        email: 'maria.gonzalez@hospital.com',
        role: 'doctor',
        is_online: true,
      },
      content: 'Ibuprofeno 400mg - Tomar 1 tableta cada 8 horas con alimentos durante 7 días.\n\nParacetamol 500mg - Tomar 1 tableta cada 6 horas si persiste el dolor.\n\nRecomendaciones:\n- Descanso relativo\n- Aplicar calor local 15 min, 3 veces al día\n- Evitar esfuerzos físicos intensos',
      message_type: 'prescription',
      is_confidential: true,
      medical_category: 'prescription',
    },
    {
      sender_id: 'patient_1',
      sender: {
        id: 'patient_1',
        first_name: 'Ana',
        last_name: 'García',
        email: 'ana.garcia@email.com',
        role: 'patient',
        is_online: true,
      },
      content: 'Perfecto, doctora. Una pregunta, ¿puedo hacer ejercicio suave?',
      message_type: 'text',
    },
    {
      sender_id: 'patient_1',
      sender: {
        id: 'patient_1',
        first_name: 'Ana',
        last_name: 'García',
        email: 'ana.garcia@email.com',
        role: 'patient',
        is_online: true,
      },
      content: 'Le adjunto una foto de cómo está la zona afectada hoy.',
      message_type: 'image',
      media_files: [
        {
          id: 'img_1',
          name: 'foto_evolucion.jpg',
          url: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Foto+Médica',
          type: 'image',
          size: 245760,
          mime_type: 'image/jpeg',
        },
      ],
      is_confidential: true,
      medical_category: 'report',
    },
    {
      sender_id: currentUserId,
      sender: {
        id: currentUserId,
        first_name: 'Dr. María',
        last_name: 'González',
        email: 'maria.gonzalez@hospital.com',
        role: 'doctor',
        is_online: true,
      },
      content: 'Sí, puede hacer caminatas ligeras de 15-20 minutos. Evite correr o levantar peso por ahora.',
      message_type: 'text',
    },
    {
      sender_id: currentUserId,
      sender: {
        id: currentUserId,
        first_name: 'Dr. María',
        last_name: 'González',
        email: 'maria.gonzalez@hospital.com',
        role: 'doctor',
        is_online: true,
      },
      content: 'Veo muy buena evolución en la foto. La inflamación ha disminuido notablemente.',
      message_type: 'text',
    },
    {
      sender_id: 'patient_1',
      sender: {
        id: 'patient_1',
        first_name: 'Ana',
        last_name: 'García',
        email: 'ana.garcia@email.com',
        role: 'patient',
        is_online: true,
      },
      content: 'Gracias, doctora. Me siento mucho mejor después del tratamiento.',
      message_type: 'text',
      read_at: new Date().toISOString(),
    },
  ];

  // Generar mensajes con timestamps realistas
  const now = new Date();
  return baseMessages.map((msg, index) => {
    const messageTime = new Date(now.getTime() - (baseMessages.length - index) * 15 * 60 * 1000);
    
    return {
      ...msg,
      id: `msg_${conversationId}_${index + 1}`,
      conversation_id: conversationId,
      created_at: messageTime.toISOString(),
      updated_at: messageTime.toISOString(),
    };
  });
};

// Datos mock para llamadas de audio/video
export const generateMockCall = (conversationId: string, type: 'audio' | 'video') => {
  return {
    id: `call_${Date.now()}`,
    conversation_id: conversationId,
    type,
    participants: [
      {
        id: 'user_1',
        first_name: 'Dr. María',
        last_name: 'González',
        email: 'maria.gonzalez@hospital.com',
        role: 'doctor' as const,
        is_online: true,
      },
      {
        id: 'patient_1',
        first_name: 'Ana',
        last_name: 'García',
        email: 'ana.garcia@email.com',
        role: 'patient' as const,
        is_online: true,
      },
    ],
    status: 'connecting' as const,
    started_at: new Date().toISOString(),
    is_muted: false,
    is_video_enabled: type === 'video',
    is_screen_sharing: false,
  };
};

// Simular archivos médicos
export const generateMockMedicalFiles = () => [
  {
    id: 'file_1',
    name: 'Resultados_Laboratorio_2024.pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'document' as const,
    size: 2048576,
    mime_type: 'application/pdf',
  },
  {
    id: 'file_2',
    name: 'Radiografia_Torax.jpg',
    url: 'https://via.placeholder.com/400x300/2E8B57/FFFFFF?text=Radiografía',
    type: 'image' as const,
    size: 1024000,
    mime_type: 'image/jpeg',
  },
  {
    id: 'file_3',
    name: 'Nota_de_Voz_Sintomas.m4a',
    url: 'mock://audio/voice_note.m4a',
    type: 'audio' as const,
    size: 512000,
    mime_type: 'audio/m4a',
  },
];

// Generar conversaciones adicionales para demo
export const generateAdditionalConversations = (currentUserId: string): Conversation[] => [
  {
    id: 'conv_4',
    type: 'appointment_discussion',
    appointment_id: 'apt_4',
    participants: [
      {
        id: currentUserId,
        first_name: 'Dr. María',
        last_name: 'González',
        email: 'maria.gonzalez@hospital.com',
        role: 'doctor',
        is_online: true,
      },
      {
        id: 'patient_4',
        first_name: 'Roberto',
        last_name: 'Martínez',
        email: 'roberto.martinez@email.com',
        role: 'patient',
        is_online: false,
        last_seen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    title: 'Consulta - Roberto Martínez',
    unread_count: 0,
    is_muted: false,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    patient_id: 'patient_4',
    doctor_id: currentUserId,
    appointment_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    medical_priority: 'low',
    last_message: {
      id: 'msg_last_4',
      conversation_id: 'conv_4',
      sender_id: 'patient_4',
      sender: {
        id: 'patient_4',
        first_name: 'Roberto',
        last_name: 'Martínez',
        email: 'roberto.martinez@email.com',
        role: 'patient',
        is_online: false,
      },
      content: 'Perfecto, doctor. Nos vemos la próxima semana.',
      message_type: 'text',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: 'conv_5',
    type: 'medical_consultation',
    participants: [
      {
        id: currentUserId,
        first_name: 'Dr. María',
        last_name: 'González',
        email: 'maria.gonzalez@hospital.com',
        role: 'doctor',
        is_online: true,
      },
      {
        id: 'patient_5',
        first_name: 'Elena',
        last_name: 'Ruiz',
        email: 'elena.ruiz@email.com',
        role: 'patient',
        is_online: true,
        last_seen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
    ],
    title: 'Urgente - Elena Ruiz',
    unread_count: 3,
    is_muted: false,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    patient_id: 'patient_5',
    doctor_id: currentUserId,
    medical_priority: 'urgent',
    last_message: {
      id: 'msg_last_5',
      conversation_id: 'conv_5',
      sender_id: 'patient_5',
      sender: {
        id: 'patient_5',
        first_name: 'Elena',
        last_name: 'Ruiz',
        email: 'elena.ruiz@email.com',
        role: 'patient',
        is_online: true,
      },
      content: 'Doctor, he empeorado. ¿Podría atenderme hoy?',
      message_type: 'text',
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
  },
];

// Función para inicializar el store con datos de prueba completos
export const initializeChatWithMockData = (currentUserId: string, setChatData: any) => {
  const conversations = generateAdditionalConversations(currentUserId);
  const messages: { [key: string]: ChatMessage[] } = {};
  
  conversations.forEach(conv => {
    messages[conv.id] = generateMockMessages(conv.id, currentUserId);
  });

  setChatData({
    conversations,
    messages,
  });
};
