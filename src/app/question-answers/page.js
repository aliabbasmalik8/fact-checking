"use client";

import { useState } from "react";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

const FactChecking = () => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [urls, setUrls] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [responseTime, setResponseTime] = useState(0);

  const handleGenerateAnswers = async () => {
    setResponseTime(0);
    if (!question || urls?.length === 0) {
      console.log("Please enter question and atleast one url");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://13.53.190.57/generate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, urls, innerText: null }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response:", data); // Add this line
        setResult(data.output);
        setResponseTime(data.responseTime);
      } else {
        console.error("Error:", response.statusText);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const addUrl = () => {
    if (inputValue.trim() !== "") {
      setUrls([...urls, inputValue]);
      setInputValue("");
    }
  };

  return (
    <main className="min-h-screen pt-12  max-w-full px-20 mx-auto">
      <div className="flex justify-center py-4">
        <h1 className="text-[16px] font-bold">Question Answer Fact Checker</h1>
      </div>
      <div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-10 w-[60%]">
            <div className="flex gap-10">
              <label className="font-bold mr-5">Question:</label>
              <input
                onChange={(e) => setQuestion(e.target.value)}
                className="text-black w-[50%] rounded-[10px] p-2 outline-none resize-none"
                placeholder="Enter Question"
              />
            </div>
            <div className="flex gap-10">
              <label className="font-bold mr-12">Urls:</label>
              <input
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
                className="text-black w-[50%] rounded-[10px] p-2 outline-none resize-none"
                placeholder="Enter Url"
              />

              <button
                className="flex bg-slate-900 text-white  rounded-md justify-center w-20 p-3 text-[13px]"
                onClick={addUrl}
              >
                Add URL
              </button>
            </div>
          </div>
          {urls?.length > 0 && (
            <div className="bg-white w-[40%] p-4 rounded-lg h-[150px]  overflow-scroll">
              <h3 className="font-bold underline">Urls</h3>
              <ul>
                {urls?.map((url, index) => (
                  <div key={index} className="flex gap-5">
                    <li className="text-black">{url}</li>
                    <div
                      className="cursor-pointer font-bold text-red-700 w-[20px] h-[20px] border-2 border-red-800 bg-red rounded-full flex justify-center align-middle items-center"
                      onClick={() => {
                        console.log("hello", index);

                        urls.splice(index, 1);
                        setUrls([...urls]);
                      }}
                    >
                      x
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-10">
          <button
            onClick={handleGenerateAnswers}
            className="flex bg-slate-900 text-white p-2 justify-center w-32 rounded-lg"
            disabled={loading}
          >
            {!loading && "Get Result"}
            {loading && <span className="animate-spin h-5 w-5 ml-3 bg-white" />}
          </button>
        </div>
      </div>
      {result && (
        <div className="flex flex-col justify-center">
          <div className="py-4">Response Time: {responseTime}s</div>
          <div className="font-bold mt-8">Result:</div>
          <div>{result}</div>
        </div>
      )}
    </main>
  );
};

export default FactChecking;
