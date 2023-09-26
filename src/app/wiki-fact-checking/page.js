"use client";

import { useState } from "react";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

const FactChecking = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  const handleAsk = async (question) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/ask", {
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
            {loading && <span class="animate-spin h-5 w-5 ml-3 bg-white" />}
          </button>
        </div>
      </div>
      <div className="mt-8">{result}</div>
    </main>
  );
};

export default FactChecking;
