"use client";

import { useMemo, useState } from "react";

const BASE_PROMPT = `Create a clean, modern 2D informative illustration based on the following script quote:

"enter the script"

Style Requirements:
- Flat 2D illustration style
- Clean and minimal presentation design
- Professional finance education aesthetic
- Soft modern colors like navy blue, forest green, white, light gray, Midnight Navy, Deep Forest, Slate Gray, Champagne, Dusty Teal, Soft Sage, Terracotta, Off-White
- Simple but visually engaging composition
- Use clear visual storytelling and easy-to-understand metaphors
- Add subtle financial elements like charts, money, wallets, graphs, coins, savings, budgeting, or investing visuals when relevant
- Modern office or lifestyle environments
- Friendly and relatable human characters
- High visual clarity
- Informative YouTube explainer style
- Soft shadows and smooth gradients
- Balanced layout with plenty of negative space
- Premium presentation-slide quality
- Avoid clutter and unnecessary details
- Designed for educational finance videos
- 16:9 aspect ratio
- High quality vector-like illustration

Negative Prompt:
- Quote text on image
- blur and low quality
- not related to quote
- not related to financial`;

export default function Page() {
  const [input, setInput] = useState("");
  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState("sections");
  const [copied, setCopied] = useState("");

  const parseSections = () => {
    if (!input.trim()) return;

    const regex =
      /Section\s+\d+\s*[:—-]\s*.*?\n([\s\S]*?)(?=\n\s*Section\s+\d+\s*[:—-]|$)/gi;

    const matches = [...input.matchAll(regex)];

    const parsed = matches.map((match, index) => {
      const script = match[1].trim();

      return {
        id: index + 1,
        title: `Section ${index + 1}`,
        imageTitle: `Image ${index + 1}`,
        script,
        prompt: BASE_PROMPT.replace("enter the script", script),
      };
    });

    setSections(parsed);
  };

  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);

      setTimeout(() => {
        setCopied("");
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const currentData = useMemo(() => {
    return sections;
  }, [sections]);

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">
            Script Section Extractor
          </h1>

          <p className="text-gray-400 text-lg">
            Paste your AI script output and generate section cards +
            image prompts instantly.
          </p>
        </div>

        {/* INPUT */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-6 mb-8 shadow-2xl">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your full script output here..."
            className="w-full h-[300px] bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 text-sm outline-none resize-none text-gray-200 placeholder:text-gray-500"
          />

          <button
            onClick={parseSections}
            className="mt-5 bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:scale-[1.02] transition-all duration-200"
          >
            Generate Cards
          </button>
        </div>


        {/* TABS */}
        {sections.length > 0 && (
          <>
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab("sections")}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                  activeTab === "sections"
                    ? "bg-white text-black"
                    : "bg-[#111827] text-gray-300 border border-[#1f2937]"
                }`}
              >
                Sections
              </button>

              <button
                onClick={() => setActiveTab("images")}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                  activeTab === "images"
                    ? "bg-white text-black"
                    : "bg-[#111827] text-gray-300 border border-[#1f2937]"
                }`}
              >
                Images
              </button>
            </div>

            {/* COPY TOAST */}
            {copied && (
              <div className="fixed top-6 right-6 bg-green-500 text-black px-5 py-3 rounded-2xl font-semibold shadow-2xl z-50">
                {copied} copied
              </div>
            )}

            {/* GRID */}
            <div className="grid grid-cols-10 gap-4">
              {currentData.map((item) => {
                const isSections = activeTab === "sections";

                return (
                  <div
                    key={item.id}
                    onClick={() =>
                      handleCopy(
                        isSections ? item.script : item.prompt,
                        isSections ? item.title : item.imageTitle
                      )
                    }
                    className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 cursor-pointer hover:border-white hover:scale-[1.02] transition-all duration-200 h-[220px] overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-sm">
                        {isSections ? item.title : item.imageTitle}
                      </h3>

                      <div className="text-xs bg-[#1e293b] px-2 py-1 rounded-lg text-gray-300">
                        Click Copy
                      </div>
                    </div>

                    <p className="text-gray-400 text-xs leading-6 overflow-hidden">
                      {isSections
                        ? item.script.slice(0, 220)
                        : item.prompt.slice(0, 220)}
                      ...
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}