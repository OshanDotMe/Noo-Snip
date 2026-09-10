import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(query);
    const query_embedding = result.embedding.values;
    const { data: snippets, error } = await supabase.rpc("match_snippets", {
      query_embedding,
      match_threshold: 0.2,
      match_count: 10,
    });

    if (error) throw error;

    return NextResponse.json({ snippets });
  } catch (err: any) {
    console.error("Semantic search error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}