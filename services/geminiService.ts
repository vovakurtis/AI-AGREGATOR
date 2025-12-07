import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem, SearchResult } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined");
  }
  return new GoogleGenAI({ apiKey });
};

export const fetchAiNews = async (): Promise<NewsItem[]> => {
  const ai = getAiClient();

  const prompt = `
    Generate 5 futuristic, cutting-edge news headlines about Artificial Intelligence, LLMs, Robotics, and Quantum Computing.
    Imagine this is a news feed from next week.
    Focus on breakthroughs, ethics, and hardware.
    The content should feel technical and exciting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              summary: { type: Type.STRING },
              source: { type: Type.STRING },
              visualPrompt: { type: Type.STRING, description: "A keyword to describe the thumbnail image" }
            },
            required: ["title", "category", "summary", "source", "visualPrompt"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || "[]");
    
    // Map to our internal type and add placeholder images based on keywords
    return rawData.map((item: any, index: number) => ({
      id: `news-${index}-${Date.now()}`,
      title: item.title,
      category: item.category.toUpperCase(),
      summary: item.summary,
      timestamp: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' }),
      source: item.source || "AI Daily",
      imageUrl: `https://picsum.photos/seed/${item.visualPrompt.replace(/\s/g, '')}${index}/800/600`
    }));

  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
  }
};

export const fetchTrendingNews = async (): Promise<NewsItem[]> => {
  const ai = getAiClient();

  const prompt = `
    Identify 4 distinct "Viral" or "Trending" topics in the world of AI right now.
    Focus on controversial, highly debated, or "mind-blowing" demonstrations.
    Examples: New model releases, deepfake controversies, AGI predictions.
    Return them as news items.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              summary: { type: Type.STRING },
              source: { type: Type.STRING },
              visualPrompt: { type: Type.STRING }
            },
            required: ["title", "category", "summary", "source", "visualPrompt"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || "[]");
    
    return rawData.map((item: any, index: number) => ({
      id: `trend-${index}-${Date.now()}`,
      title: item.title,
      category: 'TRENDING',
      summary: item.summary,
      timestamp: 'LIVE',
      source: item.source || "Social Sphere",
      imageUrl: `https://picsum.photos/seed/${item.visualPrompt.replace(/\s/g, '')}trend${index}/800/600`
    }));

  } catch (error) {
    console.error("Failed to fetch trends:", error);
    return [];
  }
};

export const performResearch = async (query: string): Promise<SearchResult> => {
  const ai = getAiClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No insights found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = chunks
      .map((chunk) => {
        const web = chunk.web;
        if (web && web.uri && web.title) {
          return { uri: web.uri, title: web.title };
        }
        return null;
      })
      .filter((s): s is { uri: string, title: string } => s !== null);

    // Deduplicate sources
    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values()) as { uri: string; title: string }[];

    return {
      text,
      sources: uniqueSources
    };

  } catch (error) {
    console.error("Research failed:", error);
    return {
      text: "Connection to global knowledge base interrupted. Please try again.",
      sources: []
    };
  }
};
