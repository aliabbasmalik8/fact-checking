"use client";

import { useState } from "react";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { WikipediaQueryRun } from "langchain/tools";

const FactChecking = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  const prefix = `You work as a fact authenticator and you use information from wikipedia as your souce of information. 
  -You are a diligent fact checker only interested in the truth, but that respects nuance.
  -I want you to utilise all your personalities and all the skills you have at your disposal to provide a clear answer. Feel free to cite your sources.
  -Also this is year 2023, so you will do all your calculations or age prediction stuff according to 2023.
  -And make sure if a statement is given you use the information you have to label it as true or false. `;

  const prefix1 = `
    Please provide information about [content] from Wikipedia and then verify the accuracy of the information provided. You can do this by summarizing the key points and checking for any factual errors or inaccuracies in the text. Please also provide the publication date of the Wikipedia article if available, and mention if there are any conflicting sources or controversies related to the topic.
  `;

  const prefix2 = `
    Please act as a fact checker and verify the accuracy of the statement. Provide supporting evidence or correct any inaccuracies you find, and clearly indicate whether the statement is true or false based on the information available up to your knowledge
  `;

  const model = new ChatOpenAI({
    openAIApiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
    temperature: 0,
    streaming: true,
  });

  const getResult = async () => {
    setResult("");
    if (!query) return;
    setLoading(true);
    const tools = [new WikipediaQueryRun()];
    const executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "openai-functions",
      verbose: true,
      agentArgs: {
        prefix,
      },
    });
    const response = await executor.run(query);
    setResult(response);
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
