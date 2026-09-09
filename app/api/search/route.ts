import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    const query_embedding = embeddingResponse.data[0].embedding;

    const { data: snippets, error } = await supabase.rpc("match_snippets", {
      query_embedding,
      match_threshold: 0.2,
      match_count: 10,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ snippets });
  } catch (err: any) {
    console.error("Semantic search error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}