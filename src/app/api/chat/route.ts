import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { messages } = data;

    // Use the API key from the python backend wrapper (from previous implementation)
    // Wait, let's just use the key if provided, or an environment variable.
    // The previous python backend had this key hardcoded as default if not in env.
    const apiKey = process.env.GEMINI_API_KEY || "";

    if (!apiKey) {
      return NextResponse.json(
        { detail: "Gemini API Key is not configured." },
        { status: 400 }
      );
    }

    // Find the last user message to use as the prompt
    let prompt = "";
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        prompt = messages[i].content;
        break;
      }
    }

    if (!prompt) {
      return NextResponse.json(
        { detail: "No user message found in prompt history." },
        { status: 400 }
      );
    }

    // Since the key has a proxy prefix 'AQ.', it might not be a standard Gemini key
    // Let's strip the prefix if we are directly calling the Google API, or wait, is 'AQ.' a Gemini key?
    // Gemini keys usually start with 'AIza'.
    // If the key starts with 'AQ.', it might be a custom proxy key. Wait, the Python backend used it directly!
    // `gemini_key = os.getenv("GEMINI_API_KEY", "REDACTED")`
    // Wait, the python code says: `genai.configure(api_key=gemini_key)` and uses `model = genai.GenerativeModel("gemini-2.5-flash")`.
    // So 'AQ.' must be a valid key or something that works with the Python SDK. Wait, the Python SDK might not validate the key format.
    const genai = new GoogleGenerativeAI(apiKey);
    let result;
    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-flash-latest", "gemini-2.5-pro", "gemini-pro-latest"];
    let lastErr;

    for (const modelName of modelsToTry) {
      try {
        const model = genai.getGenerativeModel({ model: modelName });
        result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: data.temperature ?? 0.7,
            maxOutputTokens: 8192,
          },
        });
        break; // Success!
      } catch (err: any) {
        lastErr = err;
        if (err.status === 429 || err.status === 404 || err.status === 403 || err.status === 503 || err.status === 500) {
          // Try next model on quota/rate-limit, missing model, or server errors
          continue;
        }
        // Throw for other errors (e.g. invalid prompt)
        throw err;
      }
    }

    if (!result) throw lastErr || new Error("Failed to generate content with all models");

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      choices: [
        {
          message: {
            role: "assistant",
            content: text,
          },
        },
      ],
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { detail: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
