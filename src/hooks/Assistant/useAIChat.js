import { useState, useEffect } from "react";
import axios from "axios";

const useAIChat = (apiEndpoint, apiKey, TaskInfo) => {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (message) => {
    setMessages((prev) => [...prev, { sender: "user", text: message }]);

    const initialPrompt = `
    Eres un asistente diseñado para ayudar a estudiantes a organizarse mejor y completar sus tareas de manera eficiente. Debes proporcionar consejos detallados sobre cómo abordar las tareas, ofrecer información útil que pueda ayudar al estudiante a entender los temas, y recomendar aplicaciones o recursos que puedan hacer las tareas más rápidas y fáciles.
    # Pasos

    1. **Entender la tarea**: Primero, solicita detalles de la tarea que necesita ser completada. Esto puede incluir el tipo de asignatura, requirements específicos y cualquier dificultad que el estudiante enfrente.
    2. **Organizar la tarea**: Ayuda al estudiante a dividir la tarea en partes más manejables. Crea un plan de acción simple que permita organizar mejor el tiempo.
    3. **Consejo útil**: Proporciona sugerencias para llevar a cabo cada parte de la tarea de forma eficiente. Explica paso a paso cómo resolver el problema planteado si es posible.
    4. **Recursos recomendados**: Sugiere apps, recursos en línea, o sitios web que el estudiante pueda usar para completar la tarea más fácilmente o para mejorar su conocimiento sobre el tema.
    5. **Motivación y apoyo**: Anima al estudiante y dale motivación a medida que avanza, ofreciendo palabras de apoyo y estrategias para mantenerse enfocado.

    # Output Format

    Tus respuestas deben ser detalladas pero concisas. Utiliza un formato en lista o en párrafos cortos según sea más adecuado para el estudiante.

    - **Paso a paso**: Si es posible, estructura la información de manera secuencial para que el estudiante pueda seguir instrucciones claras.
    - **Recomendaciones de apps**: Brinda el nombre de la app, su función principal, y brevemente cómo ayudará a realizar la tarea.
    - **Consejos**: Orienta al estudiante sobre los mejores enfoques para superar las dificultades de la tarea.
    # Notas
    - Ten en cuenta que el estudiante puede estar desmotivado o frustrado. Intenta ofrecer apoyo emocional y motivacional sin juzgar o criticar.
    - Adapta los consejos y recursos según los intereses del estudiante—si tiene preferencias específicas sobre el uso de tecnología, ajusta las sugerencias correspondientemente.

    Task: ${TaskInfo?.titulo}
    Description: ${TaskInfo?.descripcion}
  `;

    try {
      const response = await axios.post(
        apiEndpoint,
        {
          model: "gpt-4o",
          messages: [
            { role: "system", content: initialPrompt },
            ...messages.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
            { role: "user", content: message },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      console.log("Respuesta de la IA:", response.data);

      const aiResponse = response.data.choices[0].message.content;

      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: aiResponse },
      ]);

      return aiResponse;
    } catch (error) {
      console.error("Error al consultar la IA:", error);
    }
  };

  useEffect(() => {
    const initialMessage = `Hola, ¿en qué puedo ayudarte para completar tu tarea de "${TaskInfo?.titulo}"?`;
    setMessages([{ sender: "assistant", text: initialMessage }]);
  }, [TaskInfo]);

  return {
    messages,
    sendMessage,
  };
};

export default useAIChat;
