
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const optimizeSummary = async (summary: string, title: string): Promise<string> => {
  if (!summary) return "";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Melhore o seguinte resumo profissional para um currículo de ${title || 'um profissional'}. 
      Use palavras-chave poderosas, foque em conquistas e mantenha um tom profissional e conciso (máximo 4-5 linhas).
      Texto original: "${summary}"`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text?.trim() || summary;
  } catch (error) {
    console.error("Erro ao otimizar resumo:", error);
    return summary;
  }
};

export const improveExperience = async (description: string, position: string): Promise<string> => {
  if (!description) return "";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Reescreva a seguinte descrição de cargo para o cargo de "${position}" de forma que seja atraente para recrutadores. 
      Use o método STAR (Situação, Tarefa, Ação, Resultado), inclua verbos de ação e seja direto.
      Descrição original: "${description}"`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text?.trim() || description;
  } catch (error) {
    console.error("Erro ao melhorar experiência:", error);
    return description;
  }
};
