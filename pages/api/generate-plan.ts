// Import Next.js API types
import type { NextApiRequest, NextApiResponse } from "next";
// Import OpenAI SDK
import OpenAI from "openai";

// Instantiate OpenAI client with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API route handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("🔐 OPENAI_API_KEY:", process.env.OPENAI_API_KEY?.slice(0, 6)); // safe preview
  console.log("📥 Request body:", req.body);

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Missing input" });
  }
}

  // Construct the prompt
  const prompt = `
Generate a calendar plan for this request: "${input}".
Return a JSON array of events with "title", "start", and "end".
`;

  try {
    // Make OpenAI API call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    // Extract response content
    const plan = completion.choices[0]?.message?.content || "";

    // Return plan
    res.status(200).json({ plan });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    res
      .status(500)
      .json({ error: error?.message || "OpenAI API error occurred" });
  }
}
