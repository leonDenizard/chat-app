import { supabase } from "@/lib/supabse";

export async function translate(text: string, target: string) {
  const res = await fetch(
    "https://gxksocnryelvgzcjtnnr.supabase.co/functions/v1/hyper-function",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        text,
        target,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Translate error:", err);
    throw new Error("Translation failed");
  }

  const data = await res.json();
  return data.text;
}

export const translateInBackground = async (messageId: string, text: string, lang: string) => {
  try {
    const translated = await translate(text, lang);

    await supabase
      .from("messages")
      .update({ translated })
      .eq("id", messageId);
  } catch (e) {
    console.error("Erro ao traduzir em background", e);
  }
};
