import { useCallback, useRef, useState } from "react";
import { translate } from "@/utils/translate";
import type { LanguageOption } from "@/utils/flagsUtils";

type TranslationCache = {
  [messageId: string]: {
    [lang: string]: string;
  };
};

export function useChatTranslation() {
  // Cache local: messageId -> lang -> texto traduzido
  const cacheRef = useRef<TranslationCache>({});

  // Controle de idioma
  const [isTranslateEnabled, setIsTranslateEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageOption | null>(null);

  // Trava lógica (não causa re-render)
  const isTranslatingRef = useRef<Set<string>>(new Set());

  // Estado reativo para UI (loader, shimmer etc)
  const [translatingIds, setTranslatingIds] = useState<Set<string>>(new Set());

  const enableTranslation = (lang: LanguageOption) => {
    setSelectedLanguage(lang);
    setIsTranslateEnabled(lang.translate);
  };

  const startTranslating = (messageId: string) => {
    isTranslatingRef.current.add(messageId);
    setTranslatingIds(prev => new Set(prev).add(messageId));
  };

  const stopTranslating = (messageId: string) => {
    isTranslatingRef.current.delete(messageId);
    setTranslatingIds(prev => {
      const next = new Set(prev);
      next.delete(messageId);
      return next;
    });
  };

  const getTranslation = useCallback(
    async (messageId: string, text: string) => {
      if (!isTranslateEnabled || !selectedLanguage) return null;

      const lang = selectedLanguage.code;

      // Já traduzido → cache
      const cached = cacheRef.current[messageId]?.[lang];
      if (cached) return cached;

      // Já em tradução → não duplica
      if (isTranslatingRef.current.has(messageId)) return null;

      startTranslating(messageId);

      try {
        const translated = await translate(text, lang);

        cacheRef.current[messageId] = {
          ...cacheRef.current[messageId],
          [lang]: translated,
        };

        return translated;
      } catch (err) {
        console.error("Erro ao traduzir mensagem", err);
        return null;
      } finally {
        stopTranslating(messageId);
      }
    },
    [isTranslateEnabled, selectedLanguage]
  );

  const getCachedTranslation = (messageId: string): string | undefined => {
    if (!selectedLanguage) return;
    return cacheRef.current[messageId]?.[selectedLanguage.code];
  };

  const isTranslating = (messageId: string) =>
    translatingIds.has(messageId);

  return {
    selectedLanguage,
    isTranslateEnabled,
    enableTranslation,
    getTranslation,
    getCachedTranslation,
    isTranslating,
  };
}
