// pages/api/generate-plan.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Initialize OpenAI client using environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log("✅ will the function trigger?");
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ✅ Confirm handler is being called
  console.log("✅ /api/generate-plan handler triggered");

  // ✅ Confirm API key is loaded
  console.log("🔐 OPENAI_API_KEY present?", !!process.env.OPENAI_API_KEY);

  // Block non-POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input } = req.body;

  // Validate input
  if (!input) {
    return res.status(400).json({ error: "Missing input" });
  }

  // Prepare the prompt
  const prompt = `Generate a calendar plan for this request: "${input}". Return a JSON array of events with "title", "start", and "end".`;

  try {
    // Call OpenAI Chat Completion
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    // Extract and return result
    const plan = completion.choices[0]?.message?.content || "";
    res.status(200).json({ plan });
  } catch (error: any) {
    // Log full error for debug
    console.error("❌ OpenAI API error:", error);

    res.status(500).json({
      error: error?.message || "OpenAI API error",
    });
  }
}
