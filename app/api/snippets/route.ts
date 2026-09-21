export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { pipeline } from "@xenova/transformers";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const {
      title,
      description,
      language,
      code_content,
      tags,
      collection_id,
      is_public,
      user_id,
    } = await req.json();

    if (!title || !code_content) {
      return NextResponse.json({ error: "Title and Code are required" }, { status: 400 });
    }

    const safeLanguage = language ? language.toLowerCase() : "text";

    const textToEmbed = `Title: ${title}\nDescription: ${description || ""}\nLanguage: ${safeLanguage}\nTags: ${tags ? tags.join(", ") : ""}\nCode:\n${code_content}`;

    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const output = await extractor(textToEmbed, { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data);

    const { data, error } = await supabase
      .from("snippets")
      .insert([
        {
          title,
          description: description || null,
          language: safeLanguage,
          code_content,
          tags: tags || [],
          collection_id: collection_id || null,
          is_public: is_public ?? true,
          user_id: user_id || null,
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