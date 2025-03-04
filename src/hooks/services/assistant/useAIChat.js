import { useState, useEffect } from "react";
import axios from "axios";

const useAIChat = (apiEndpoint, apiKey, TaskInfo) => {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (message) => {
    try {
      setMessages((prev) => [...prev, { sender: "user", text: message }]);

      if (!apiKey) {
        const errorMessage = "No se encontró la clave de API. Por favor, configura la variable de entorno REACT_APP_OPEN_AI_KEY en el archivo .env";
        setMessages(prev => [...prev, { sender: "assistant", text: errorMessage }]);
        throw new Error(errorMessage);
      }

      const response = await axios.post(
        apiEndpoint,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `
                Eres CheckMate, un asistente diseñado para ayudar a estudiantes a organizarse mejor y completar sus tareas de manera eficiente. 
                Tu objetivo es proporcionar pasos claros y detallados sobre cómo abordar las tareas, dividiendo la información en secciones numeradas para mejor comprensión.

                Al responder:
                1. Usa un tono amigable y profesional
                2. Divide tus respuestas en pasos numerados
                3. Usa negritas (**texto**) para resaltar puntos importantes
                4. Si es relevante, sugiere recursos o herramientas útiles
                5. Mantén tus respuestas concisas pero informativas
              `
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: aiResponse },
      ]);

      return aiResponse;
    } catch (error) {
      console.error("Error al consultar la IA:", error);
      if (error.response) {
        console.error("Respuesta de error:", error.response.data);
      }
      if (error.message.includes('REACT_APP_OPEN_AI_KEY')) {
        throw error; // Re-lanzar el error específico de la API key
      }
      const errorMessage = "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.";
      setMessages(prev => [...prev, { sender: "assistant", text: errorMessage }]);
      return errorMessage;
    }
  };

  useEffect(() => {
    if (TaskInfo?.titulo) {
      const initialMessage = `¡Hola! Soy CheckMate, aquí tienes los pasos para tu tarea "${TaskInfo.titulo}":\n\n` +
        `1. **Identificar:** Clarifica qué necesitas saber/hacer con "${TaskInfo.titulo}". ¿Es un proyecto? ¿Una investigación? ¡Define el objetivo!\n` +
        `2. **Planificar:** Vamos a dividir la tarea en pasos más pequeños y manejables.\n` +
        `3. **Recursos:** ¿Qué materiales o información necesitas? Te ayudaré a encontrarlos.\n` +
        `4. **Organizar:** Estableceremos un plan de trabajo con fechas y prioridades.\n` +
        `5. **¡Empezar!:** ¿Por dónde quieres comenzar? ¡Estoy aquí para guiarte!`;
      setMessages([{ sender: "assistant", text: initialMessage }]);
    } else {
      setMessages([{ 
        sender: "assistant", 
        text: "¡Hola! Soy CheckMate, tu asistente para organizar y completar tareas. ¿En qué puedo ayudarte hoy?" 
      }]);
    }
  }, [TaskInfo]);

  return {
    messages,
    sendMessage,
  };
};

export default useAIChat;
