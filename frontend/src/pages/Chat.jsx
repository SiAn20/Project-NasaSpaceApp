import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, User, Bot } from "lucide-react";

const ChatIA = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "¡Hola! 👋 Soy ChocoSpace AI. Puedo ayudarte a planificar tus actividades al aire libre analizando datos climáticos de la NASA. ¿Qué te gustaría saber?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error("Error en la respuesta");
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        role: "assistant",
        content:
          "❌ Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    { icon: "🏔️", text: "¿Cuándo hacer trekking en los Andes?" },
    { icon: "🏖️", text: "¿Mejor época para ir a la playa?" },
    { icon: "⛷️", text: "¿Cuándo hay más nieve para esquiar?" },
    { icon: "🎣", text: "¿Buen clima para pescar este mes?" },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 p-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Chat con IA Meteorológica
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Pregunta sobre clima y actividades al aire libre
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-start space-x-3 max-w-[80%]">
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                
                <div
                  className={`rounded-2xl p-4 transition-all duration-200 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "bg-white/90 backdrop-blur-sm shadow-md border border-gray-100 text-gray-800"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles size={14} className="text-purple-500" />
                      <span className="text-xs font-semibold text-purple-600">
                        ChocoSpace AI
                      </span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
                    {message.content}
                  </p>
                  <p className={`text-xs mt-3 ${
                    message.role === "user" ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white/90 backdrop-blur-sm shadow-md rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="animate-spin text-purple-500" size={20} />
                    <span className="text-sm text-gray-600">Pensando...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {messages.length === 1 && (
        <div className="px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-600 mb-4 text-center font-medium">
              Preguntas sugeridas:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputMessage(q.text)}
                  className="bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200/60 rounded-xl p-4 text-sm text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group"
                >
                  <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform duration-200">
                    {q.icon}
                  </span>
                  <span className="text-gray-700 font-medium leading-tight">
                    {q.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/60 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-3 shadow-sm transition-all duration-200 focus-within:shadow-md focus-within:border-purple-300">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Pregunta sobre el clima de cualquier lugar..."
              className="flex-1 bg-transparent outline-none text-gray-800 px-3 placeholder-gray-500 text-[15px]"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            💡 Tip: Pregunta por lugares específicos y fechas para mejores resultados
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatIA;