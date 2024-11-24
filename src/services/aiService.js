import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const generateTaskDescription = async (taskName) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Actúa como un asistente experto en gestión de tareas. 
        Genera una descripción detallada y práctica para la siguiente tarea: "${taskName}".
        La descripción debe ser concisa pero informativa, incluyendo los pasos más importantes.
        Formato deseado:
        - Máximo 5 pasos numerados
        - Cada paso debe ser claro y accionable
        - No uses más de 150 caracteres por paso`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error al generar la descripción:', error);
        throw new Error('No se pudo generar la descripción de la tarea');
    }
};
