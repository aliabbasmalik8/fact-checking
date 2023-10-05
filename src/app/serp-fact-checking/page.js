"use client";

import { useState } from "react";
import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";

const FactChecking = () => {
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [responseTime, setResponseTime] = useState(0)


  const prompt = PromptTemplate.fromTemplate(
    `You work as a fact authenticatior and you use {info} (which is in JSON format) as your souce of information. I will provide the {info} (which is in JSON format), you will train on the {info} and then verify the {question} according to it. Another helpful information is that it's 2023, so do your mathematical calculation according to 2023 and be as much accurate as possible. Do not add according to the data or sentence similar to it in your response.
  is the {question} true or false according to {info}. Also provide the link you used to verify from {info} (which is in JSON format). `
  );


  const model = new OpenAI({
    openAIApiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
    temperature: 0,
    streaming: true,
  });

  const getResult = async () => {
    setResponseTime(0)
    setResult('');
    if (!query) return
    setLoading(true);
    const startAPICall = new Date().getTime()
    // get data from serp api
    let res = await fetch("/api/serp", {
      method: 'POST',
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    // ----------


    const first_3_sites = data?.data?.organic_results?.slice(0,1)

    const formattedPrompt = await prompt.format({
      info: JSON.stringify(first_3_sites),
      question: query,
    });

    await model.call(formattedPrompt, {
      callbacks: [
        {
          handleLLMNewToken(token) {
            setLoading(false)
            setResult((result) => result + token);
          },
        },
      ],
    })
    const endAPICall = new Date().getTime()
    setResponseTime(endAPICall-startAPICall)
  }

  return (
    <main className="min-h-screen pt-12 w-[1000px] max-w-full px-4 mx-auto">
      <div className="flex justify-center py-4">
        <h1 className="text-[16px] font-bold">Serp Fact Checker</h1>
      </div>
      <div>
        <textarea onChange={(e) => setQuery(e.target.value)} className="text-black w-full h-32 p-2 outline-none resize-none" />
        <div className="flex justify-end">
          <button onClick={getResult} className="flex bg-slate-900 text-white p-2 justify-center w-32" disabled={loading}>
            {!loading && 'Get Result'}
            {loading && <span className="animate-spin h-5 w-5 ml-3 bg-white" />}
          </button>
        </div>
      </div>
      {responseTime !== 0 &&<div className="mt-5">Response Time: {responseTime} ms</div>}
      <div className="mt-8">{result}</div>
    </main>
  )
}

export default FactChecking