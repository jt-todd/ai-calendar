// pages/api/generate-plan.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Instantiate OpenAI client with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Log to confirm if API key is loaded
  console.log("🔐 OPENAI_API_KEY present? ", !!process.env.OPENAI_API_KEY);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Missing input" });
  }

  // Compose the prompt to send OpenAI
  const prompt = `Generate a calendar plan for this request: "${input}". Return a JSON array of events with "title", "start", and "end".`;

  try {
    // Call OpenAI Chat Completion API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    // Extract generated plan text
    const plan = completion.choices[0]?.message?.content || "";

    // Return successful response with plan
    res.status(200).json({ plan });
  } catch (error: any) {
    // Log error details for debugging
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: error.message || "OpenAI API error" });
  }
}
