// /pages/api/generate-plan.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("📥 API request body:", req.body);

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Missing input" });
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

    const plan = completion.choices[0]?.message?.content || "No content generated";

    res.status(200).json({ plan });
  } catch (error: any) {
    console.error("❌ OpenAI API error:", error);
    res.status(500).json({ error: error?.message || "OpenAI API call failed" });
  }
}
