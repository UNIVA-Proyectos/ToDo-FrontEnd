import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

export const generateTaskDescription = async (taskName) => {
  try {
    if (!API_KEY) {
      throw new Error("API key no configurada");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = {
      contents: [{
        parts: [{
          text: `Eres CheckMate, un asistente IA experto en gestión de tareas, diseñado para ayudar a los usuarios a organizar mejor su tiempo y proyectos.
          
          Como CheckMate, genera una descripción detallada y práctica para la siguiente tarea: "${taskName}".
          
          Responde con el siguiente formato:
          "¡Hola! Soy CheckMate, aquí tienes los pasos para tu tarea:
          1. [Primer paso]
          2. [Segundo paso]
          3. [Tercer paso]
          4. [Cuarto paso]
          5. [Quinto paso]
          
          ¡Éxito en tu tarea! "
          
          - Cada paso debe ser claro y accionable
          - No uses más de 150 caracteres por paso
          - Mantén un tono amigable y motivador`
        }]
      }]
    };

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error al generar la descripción:", error);
    if (!API_KEY) {
      throw new Error("La API key de Gemini no está configurada. Por favor, configura REACT_APP_GEMINI_API_KEY en el archivo .env");
    }
    throw new Error("No se pudo generar la descripción de la tarea");
  }
};
