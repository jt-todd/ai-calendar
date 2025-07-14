// Import Next.js API types
import type { NextApiRequest, NextApiResponse } from "next";
// Import OpenAI SDK
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this env var is set properly
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("🔐 OPENAI_API_KEY present?", !!process.env.OPENAI_API_KEY);
  console.log("📥 Request method:", req.method);
  console.log("📥 Request body:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed, use POST" });
  }

  const { input } = req.body;

  if (!input || typeof input !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'input' parameter" });
  }

  const prompt = `
Generate a calendar plan for this request: "${input}".
Return a JSON array of events with "title", "start", and "end".
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const plan = completion.choices[0]?.message?.content || "";

    res.status(200).json({ plan });
  } catch (error: any) {
    console.error("OpenAI API error:", error);

    res.status(500).json({
      error: error.message || "OpenAI API error occurred",
      details: error.response?.data || null,
    });
  }
}
