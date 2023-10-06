"use client";
import { useState } from "react";

const FactChecking = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [responseTime, setResponseTime] = useState(0);

  const handleAsk = async (question) => {
    setResponseTime(0);
    try {
      const response = await fetch("http://13.53.190.57/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response:", data); // Add this line
        setResult(data.answer);
        setResponseTime(data.responseTime);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getResult = async () => {
    setResult("");
    if (!query) return;

    setLoading(true);
    await handleAsk(query);

    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-12 w-[1000px] max-w-full px-4 mx-auto">
      <div className="flex justify-center py-4">
        <h1 className="text-[16px] font-bold">Wikipedia Fact Checker</h1>
      </div>
      <div>
        <textarea
          onChange={(e) => setQuery(e.target.value)}
          className="text-black w-full h-32 p-2 outline-none resize-none"
        />
        <div className="flex justify-end">
          <button
            onClick={getResult}
            className="flex bg-slate-900 text-white p-2 justify-center w-32"
            disabled={loading}
          >
            {!loading && "Get Result"}
            {loading && <span className="animate-spin h-5 w-5 ml-3 bg-white" />}
          </button>
        </div>
        <div></div>
      </div>

      {responseTime !== 0 && (
        <div className="mt-5">Response Time: {responseTime} s</div>
      )}
      <div className="mt-8">{result}</div>
    </main>
  );
};

export default FactChecking;
