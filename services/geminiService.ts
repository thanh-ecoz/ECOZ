import { GoogleGenAI, Type, Modality } from "@google/genai";
import { decodeAudioData } from './audioService';

// Ensure API Key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Singleton AudioContext to adhere to browser policies (must resume on interaction)
let audioContext: AudioContext | null = null;

export const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 24000, 
    });
  }
  return audioContext;
};

export interface RiddleResponse {
  riddle: string;
}

export const generateRiddle = async (animalName: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Schema for structured output
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        riddle: {
          type: Type.STRING,
          description: "A simple riddle for a child about the animal, including its sound.",
        }
      },
      required: ["riddle"],
    };

    const response = await ai.models.generateContent({
      model: model,
      contents: `Create a very simple riddle for a Primary School student (English Movers level) about a ${animalName}. 
      
      Strict Rules:
      1. Use ONLY simple vocabulary (A1/Movers level).
      2. Maximum 2 short sentences. Keep it very short.
      3. YOU MUST include the sound the animal makes (onomatopoeia) like 'Woof', 'Moo', 'Roar', 'Meow', etc.
      4. Do NOT say the name of the animal (${animalName}) in the text.
      5. Example format: "I have a long trunk. I say Pa-woo!"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText) as RiddleResponse;
    return data.riddle;

  } catch (error) {
    console.error("Error generating riddle:", error);
    return `I make a sound and I am a ${animalName}. Who am I?`; // Fallback
  }
};

export const generateAndPlaySpeech = async (text: string): Promise<void> => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Puck' }, // Puck is friendly for kids
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
        throw new Error("No audio data received");
    }

    const audioBuffer = await decodeAudioData(base64Audio, ctx, 24000);
    
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start();

    return new Promise((resolve) => {
        source.onended = () => resolve();
    });

  } catch (error) {
    console.error("TTS Error:", error);
    // Simple fallback if TTS fails - reading it via browser speech synthesis
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.8; // Slower for kids
        utterance.onend = () => resolve();
        window.speechSynthesis.speak(utterance);
    });
  }
};