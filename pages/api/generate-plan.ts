
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

// Configure OpenAI client with API key from environment variable
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { input } = req.body; // Extract input text from request body

  if (!input) {
    // If no input provided, return an error
    return res.status(400).json({ error: "Missing input" });
  }

  // Prompt OpenAI to generate a calendar plan based on user input
  const prompt = `
Generate a calendar plan for this request: "${input}".
Return JSON array of events with "title", "start", and "end".
`;

  try {
    // Call OpenAI's chat completion endpoint with the prompt
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    // Extract the AI's response text (the plan)
    const plan = completion.data.choices[0].message?.content || "";

    // Send the plan back as JSON to the frontend
    res.status(200).json({ plan });
  } catch (error) {
    // On error, return a 500 with message
    res.status(500).json({ error: "OpenAI API error" });
  }
}
