import { useState } from "react";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGeneratePlan() {
    if (!input.trim()) {
      setError("Please enter a request");
      return;
    }
    setError("");
    setLoading(true);
    setPlan("");

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "API error");
      } else {
        setPlan(data.plan);
      }
    } catch (e) {
      setError("Network or server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Calendar Plan Generator</h1>
      <textarea
        rows={4}
        placeholder="Describe your calendar request"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />
      <button onClick={handleGeneratePlan} disabled={loading}>
        {loading ? "Generating..." : "Generate Plan"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {plan && (
        <>
          <h2>Generated Plan:</h2>
          <pre
            style={{
              backgroundColor: "#f0f0f0",
              padding: 12,
              whiteSpace: "pre-wrap",
            }}
          >
            {plan}
          </pre>
        </>
      )}
    </main>
  );
}
