import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { messages } = data;

    const groqApiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
    const geminiApiKey = process.env.GEMINI_API_KEY || "";

    if (!groqApiKey && !geminiApiKey) {
      return NextResponse.json(
        { detail: "Neither GROQ_API_KEY nor GEMINI_API_KEY is configured in environment." },
        { status: 400 }
      );
    }

    // Extract prompt from messages array
    let prompt = "";
    if (Array.isArray(messages)) {
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
          prompt = typeof messages[i].content === 'string'
            ? messages[i].content
            : JSON.stringify(messages[i].content);
          break;
        }
      }
    }

    if (!prompt && Array.isArray(messages) && messages.length > 0) {
      prompt = messages[messages.length - 1].content || "";
    }

    if (!prompt) {
      return NextResponse.json(
        { detail: "No user message found in prompt history." },
        { status: 400 }
      );
    }

    // 1. PRIMARY: Groq Free-Tier API
    if (groqApiKey) {
      const primaryModel = process.env.GROQ_PRIMARY_MODEL || "groq/compound";
      const fallbackModel = process.env.GROQ_FALLBACK_MODEL || "groq/compound-mini";
      const groqModels = [
        primaryModel,
        fallbackModel,
        "openai/gpt-oss-120b"
      ];

      const formattedMessages = Array.isArray(messages) && messages.length > 0
        ? messages
        : [{ role: 'user', content: prompt }];

      for (const modelName of groqModels) {
        try {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
              model: modelName,
              messages: formattedMessages,
              temperature: data.temperature ?? 0.6,
              max_tokens: 4000,
            }),
          });

          if (res.ok) {
            const resData = await res.json();
            const content = resData.choices?.[0]?.message?.content || "";
            if (content) {
              return NextResponse.json({
                choices: [
                  {
                    message: {
                      role: "assistant",
                      content: content,
                    },
                  },
                ],
                provider: "groq",
                model: modelName,
              });
            }
          } else {
            const errText = await res.text();
            console.warn(`Groq model ${modelName} returned HTTP ${res.status}:`, errText.substring(0, 120));
          }
        } catch (err: any) {
          console.warn(`Groq model ${modelName} failed:`, err?.message || err);
          continue;
        }
      }
    }

    // 2. TERTIARY BACKUP: Google Gemini API
    if (geminiApiKey) {
      console.log("Groq unavailable or limit reached. Falling back to Gemini backup...");
      const genai = new GoogleGenerativeAI(geminiApiKey);
      const geminiModels = [
        "gemini-2.5-flash"
      ];

      for (const modelName of geminiModels) {
        try {
          const model = genai.getGenerativeModel({ model: modelName });
          const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: data.temperature ?? 0.6,
              maxOutputTokens: 8192,
            },
          });

          if (result) {
            const response = await result.response;
            const text = response.text();
            if (text) {
              return NextResponse.json({
                choices: [
                  {
                    message: {
                      role: "assistant",
                      content: text,
                    },
                  },
                ],
                provider: "gemini",
                model: modelName,
              });
            }
          }
        } catch (err: any) {
          console.warn(`Gemini backup model ${modelName} failed:`, err?.message || err);
          continue;
        }
      }
    }

    return NextResponse.json(
      { detail: "All LLM providers (Groq and Gemini) failed to generate a response." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { detail: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
