import { supabase } from "@/lib/supabase";
import { error } from "console";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request){
  try{
    const {title, description,language, code_content, tags} = await req.json();

    if(!title || !code_content){
      return NextResponse.json({error: "Title and Code are required"}, {status: 400});
    }

    const textToEmbed = `Title: ${title}\nDescription: ${description || ""}\nLanguage: ${language}\nTags: ${tags ? tags.join(",") : ""}\nCode: ${code_content}`

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: textToEmbed,
    });

    const embedding = embeddingResponse.data[0].embedding;

    const {data, error} = await supabase.from("snippets").insert([
      {
        title,
        description: description || null,
        language: language.toLowerCase(),
        code_content,
        tags: tags || [],
        embedding,
      },
    ]).select();
    if(error){
      throw error;
    }
    return NextResponse.json({success: true, data}, {status: 201});
  }catch(err: any){
    console.error("Snippet creation error:", err);
    return NextResponse.json({error: err.message}, {status: 500});
  }
}