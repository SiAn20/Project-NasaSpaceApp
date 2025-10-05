import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";

class AIService {
  constructor() {
    if (!env.geminiApiKey) {
      throw new Error(
        "GEMINI_API_KEY no está configurada en las variables de entorno"
      );
    }
    this.genAI = new GoogleGenerativeAI(env.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async interpretWeatherData(weatherData, location) {
    const prompt = `
Eres un meteorólogo experto y consejero de actividades al aire libre. Analiza los siguientes datos climáticos de NASA y proporciona una interpretación clara y amigable para personas comunes.

📍 Ubicación: Lat ${location.latitude}, Lon ${location.longitude}

📊 Datos Climáticos:
- Temperatura promedio: ${weatherData.statistics.T2M.avg}°C (Min: ${weatherData.statistics.T2M.min}°C, Max: ${weatherData.statistics.T2M.max}°C)
- Humedad promedio: ${weatherData.statistics.RH2M.avg}% (Min: ${weatherData.statistics.RH2M.min}%, Max: ${weatherData.statistics.RH2M.max}%)
- Velocidad del viento: ${weatherData.statistics.WS10M.avg} m/s (Min: ${weatherData.statistics.WS10M.min}, Max: ${weatherData.statistics.WS10M.max})
- Precipitación promedio: ${weatherData.statistics.PRECTOTCORR.avg} mm/día

Por favor proporciona:
1. 🌡️ **Interpretación del clima**: Explica qué significan estos números de forma simple
2. ☀️ **Condiciones esperadas**: Describe cómo se sentirá estar ahí
3. 🎯 **Actividades recomendadas**: Qué actividades son ideales con este clima
4. ⚠️ **Precauciones**: Qué tener en cuenta o evitar
5. 👕 **Qué llevar**: Ropa y equipo recomendado

Sé amigable, conciso y usa emojis. Máximo 300 palabras.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error en AIService.interpretWeatherData:", error);
      throw new Error("No se pudo generar la interpretación con IA");
    }
  }

  async chatWithAI(userMessage, conversationHistory = []) {
    const systemPrompt = `
Eres WeatherWise AI, un asistente meteorológico experto que ayuda a las personas a planificar actividades al aire libre usando datos de la NASA.

Tus capacidades:
- Interpretar datos climáticos históricos de la NASA
- Recomendar las mejores fechas para actividades específicas
- Explicar probabilidades climáticas de forma simple
- Dar consejos sobre qué llevar y cómo prepararse

Características de tus respuestas:
- Amigable y conversacional
- Usa emojis relevantes
- Conciso pero informativo (máximo 250 palabras)
- Enfócate en consejos prácticos
- Si te preguntan por un lugar y fecha específicos, menciona que pueden usar el mapa interactivo para datos precisos de la NASA

Responde SIEMPRE en español.
`;

    try {
      const fullPrompt = `${systemPrompt}\n\nHistorial de conversación:\n${conversationHistory
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n")}\n\nUsuario: ${userMessage}\n\nAsistente:`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error en AIService.chatWithAI:", error);
      throw new Error("No se pudo procesar tu mensaje");
    }
  }
}

export default new AIService();
