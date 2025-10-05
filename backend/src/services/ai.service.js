import Groq from "groq-sdk";
import { env } from "../config/env.js";

class AIService {
  constructor() {
    if (!env.groqApiKey) {
      console.warn("⚠️  GROQ_API_KEY no está configurada");
    }
    this.groq = new Groq({
      apiKey: env.groqApiKey || process.env.GROQ_API_KEY,
    });
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
      const completion = await this.groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "Eres un meteorólogo experto que explica el clima de forma clara y práctica en español.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 600,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Error en AIService.interpretWeatherData:", error);
      throw new Error("No se pudo generar la interpretación con IA");
    }
  }

  async chatWithAI(userMessage, conversationHistory = []) {
    try {
      const messages = [
        {
          role: "system",
          content: `Eres WeatherWise AI, un asistente meteorológico experto que ayuda a las personas a planificar actividades al aire libre usando datos de la NASA. Responde SIEMPRE en español de forma amigable y usa emojis. Máximo 250 palabras.`,
        },
        ...conversationHistory.map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        })),
        {
          role: "user",
          content: userMessage,
        },
      ];

      const completion = await this.groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.8,
        max_tokens: 500,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Error en AIService.chatWithAI:", error);
      throw new Error("No se pudo procesar tu mensaje");
    }
  }
}

export default new AIService();
