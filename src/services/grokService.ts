// Use the API key directly for now - in production, this should be stored in environment variables
const GROK_API_KEY = "xai-J7OMpUiU9zUhHzVljRfbNZVamDZfkT1AQSkZRXZCVEG01Iwlt8F1Ees4QMJfGq6OUrGIxJQbk3wkZ2TC";
const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

export interface Message {
  role: "system" | "assistant" | "user";
  content: string;
}

export const getGrokResponse = async (messages: Message[]): Promise<string> => {
  try {
    const response = await fetch(GROK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        messages,
        model: "grok-3-latest",
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Grok API:", error);
    throw error;
  }
}; 