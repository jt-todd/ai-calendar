import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "Present" : "Missing");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input } = req.body;
  if (!input) {
    return res.status(400).json({ error: "Missing input" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a calendar plan for this request: "${input}"`,
        },
      ],
    });

    const plan = completion.choices[0]?.message?.content || "";
    res.status(200).json({ plan });
  } catch (error: any) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: error.message || "OpenAI error" });
  }
}
