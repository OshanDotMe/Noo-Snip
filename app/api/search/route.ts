export const dynamic = "force-dynamic";
export const maxDuration = 30;

import { NextResponse } from "next/server";
import { pipeline, env } from "@xenova/transformers";
import { supabase } from "@/lib/supabase";

env.allowLocalModels = false;
env.useFS = false;
env.cacheDir = "/tmp/.cache";

if (env.backends && env.backends.onnx) {
  env.backends.onnx.wasm.numThreads = 1;
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const output = await extractor(query, { pooling: "mean", normalize: true });
    const query_embedding = Array.from(output.data);

    const { data: snippets, error } = await supabase.rpc("match_snippets", {
      query_embedding,
      match_threshold: 0.2,
      match_count: 10,
    });

    if (error) throw error;

    return NextResponse.json({ snippets: snippets || [] });
  } catch (err: any) {
    console.error("Semantic search error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}