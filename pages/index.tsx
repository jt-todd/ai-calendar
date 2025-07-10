import { useState } from "react";

export default function Home() {
  // State to store user input text
  const [input, setInput] = useState("");
  // State to store the AI-generated calendar plan returned from backend
  const [plan, setPlan] = useState("");

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Prevent page reload on form submit

    // Call backend API route /api/generate-plan with user input
    const res = await fetch("/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }), // Send input as JSON
    });

    const data = await res.json(); // Parse JSON response
    setPlan(data.plan); // Save AI plan to state to display
  }

  return (
    <main>
      <h1>AI Calendar Planner</h1>
      <form onSubmit={handleSubmit}>
        {/* Text input for user to describe calendar request */}
        <input
          type="text"
          placeholder="Describe your calendar plan"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
          style={{ width: "300px" }}
        />
        <button type="submit">Generate Plan</button>
      </form>

      {/* Display AI-generated calendar plan */}
      {plan && (
        <pre style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
          {plan}
        </pre>
      )}
    </main>
  );
}
