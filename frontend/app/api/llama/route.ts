import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: `<s>[INST] ${message} [/INST]`,
    }),
  });

  const data = await response.json();

  if (data.error) {
    console.error(" LLaMA error:", data.error);
    return NextResponse.json({ error: data.error }, { status: 500 });
  }

  return NextResponse.json({ reply: data[0]?.generated_text || "No response" });
}
