export const dynamic = "force-dynamic";
export const maxDuration = 30;

import { NextResponse } from "next/server";
import { pipeline, env } from "@xenova/transformers";
import { supabase } from "@/lib/supabase";

env.allowLocalModels = false;
env.useFS = false;

if (env.backends && env.backends.onnx) {
  env.backends.onnx.wasm.numThreads = 1;
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const output = await extractor(query, { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data);

    const { data: snippets, error } = await supabase.rpc("match_snippets", {
      query_embedding: embedding,
      match_threshold: 0.3,
      match_count: 10,
    });

    if (error) {
      console.error("Supabase RPC Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(snippets || []);
  } catch (err: any) {
    console.error("Search API Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}