import { supabase } from "@/lib/supabase";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { error } from "console";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { title, description, language, code_content, tags } = await req.json();

    if (!title || !code_content) {
      return NextResponse.json({ error: "Title and Code are required" }, { status: 400 });
    }

    const textToEmbed = `Title: ${title}\nDescription: ${description || ""}\nLanguage: ${language}\nTags: ${tags ? tags.join(", ") : ""}\nCode:\n${code_content}`;

    // Generate Embedding using Gemini text-embedding-004 model
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(textToEmbed);
    const embedding = result.embedding.values;

    const { data, error } = await supabase
      .from("snippets")
      .insert([
        {
          title,
          description: description || null,
          language: language.toLowerCase(),
          code_content,
          tags: tags || [],
          embedding,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    console.error("Snippet creation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}