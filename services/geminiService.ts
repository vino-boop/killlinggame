
import { GoogleGenAI, Type } from "@google/genai";
import { PlayerState, AIScenario, LocationId } from "../types.ts";

const LOCATIONS_DATA: Record<LocationId, string> = {
  'pioneer-square': "Pioneer Square (The Depths): Oldest part of Seattle, heart of the homeless crisis. Cheap 'reinforcements' (fentanyl/blues) are everywhere. High survival risk.",
  'downtown': "Downtown Core: Corporate glass towers, reminders of your lost tech job. High police presence, hard to find a quiet corner.",
  'capitol-hill': "Capitol Hill: Social hub, nightlife, activists. You might find help here, but everything costs money.",
  'ballard': "Ballard: Industrial roots, fishing docks, van-life settlements. Gritty but potentially safe for a while.",
  'rainier-valley': "Rainier Valley: Diverse, residential, far from the center. Cheaper food, but transportation is a nightmare.",
  'bellevue': "Bellevue: Across the lake. Clean, wealthy, hostile to 'outsiders'. If you look too poor, you'll be moved along immediately.",
  'u-district': "University District: Academic life meets street survival. Cheap food but high competition for resources.",
  'fremont': "Fremont: Artistic and tech-heavy. The 'Center of the Universe' has plenty of places to hide, but few places to belong."
};

const SYSTEM_INSTRUCTION = `
You are the Game Master for "Escape the Kill Line" (逃离斩杀线), a dark text adventure set in modern Seattle.
Player: 35yo former middle-class professional, recently evicted.
Theme: Debt survival, social collapse, addiction ("Reinforcements" / 强化剂).
Location: Real Seattle districts with their specific vibes.

The "Reinforcement" system (强化剂) represents drug use or high-risk 'shortcuts' to stay sane.
Generate daily scenarios based on the player's current location and addiction level.

Return valid JSON format ONLY.
`;

export const generateNextScenario = async (state: PlayerState): Promise<AIScenario> => {
  // 安全获取 API Key
  const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
  const ai = new GoogleGenAI({ apiKey: apiKey || '' });
  
  const locationContext = LOCATIONS_DATA[state.currentLocation];
  
  const prompt = `
  Current Day: ${state.day}
  Location: ${locationContext}
  Cash: $${state.cash}
  Debt: $${state.debt}
  Health: ${state.health}/100
  Stress: ${state.stress}/100
  Addiction (强化剂依赖): ${state.addiction}/100
  Stats: ${JSON.stringify(state.stats)}
  Traits: ${state.traits.join(", ")}
  
  Generate a scenario specific to this location in Seattle. 
  If addiction is high (>50), include choices about seeking "reinforcements" to deal with withdrawal.
  One choice should always be a "Reinforcement" option (isReinforcement: true) which offers immediate relief (lowers stress/health boost) but increases addiction.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            choices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  isReinforcement: { type: Type.BOOLEAN },
                  statChanges: {
                    type: Type.OBJECT,
                    properties: {
                      cash: { type: Type.NUMBER },
                      debt: { type: Type.NUMBER },
                      health: { type: Type.NUMBER },
                      stress: { type: Type.NUMBER },
                      addiction: { type: Type.NUMBER },
                      stats: {
                        type: Type.OBJECT,
                        properties: {
                          survival: { type: Type.NUMBER },
                          intellect: { type: Type.NUMBER },
                          social: { type: Type.NUMBER },
                          sanity: { type: Type.NUMBER },
                          luck: { type: Type.NUMBER },
                        }
                      }
                    }
                  }
                },
                required: ["text", "impact", "statChanges"]
              }
            }
          },
          required: ["title", "description", "choices"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating scenario:", error);
    return {
      title: "Rain in Seattle",
      description: "The grey clouds over the Space Needle offer no comfort. Your vision blurs.",
      choices: [{ text: "Keep moving", impact: "Walking hurts but you have to", statChanges: { stress: 2 } }]
    } as AIScenario;
  }
};
