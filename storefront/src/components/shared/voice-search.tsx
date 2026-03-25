"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface VoiceSearchProps {
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition) as
    | (new () => SpeechRecognitionInstance)
    | null;
}

/**
 * Voice search component using Web Speech API (SpeechRecognition).
 * Shows a microphone button that turns red when listening, displays real-time
 * transcript, and triggers search on completion. Falls back to a message
 * for unsupported browsers.
 */
export function VoiceSearch({
  onSearch,
  className,
  placeholder = "Tap the mic and speak...",
}: VoiceSearchProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    setIsSupported(getSpeechRecognition() !== null);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      setInterimTranscript("");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let final = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        setTranscript((prev) => prev + final);
        setInterimTranscript("");
      } else {
        setInterimTranscript(interim);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const handleSubmit = useCallback(() => {
    const query = transcript.trim();
    if (query) {
      onSearch(query);
    }
  }, [transcript, onSearch]);

  const handleClear = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  // Submit on transcript completion when not listening
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      handleSubmit();
    }
  }, [isListening, transcript, handleSubmit]);

  if (!isSupported) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border border-dashed border-muted-foreground/30 p-4 text-sm text-muted-foreground",
          className
        )}
      >
        <MicOff className="h-4 w-4 shrink-0" />
        <span>Voice search is not supported in this browser. Try Chrome or Edge.</span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Microphone button */}
      <motion.div className="relative">
        {/* Pulsing ring when listening */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-red-500"
            />
          )}
        </AnimatePresence>
        <Button
          variant={isListening ? "destructive" : "outline"}
          size="icon-lg"
          onClick={isListening ? stopListening : startListening}
          className={cn(
            "relative rounded-full transition-colors",
            isListening && "bg-red-500 hover:bg-red-600"
          )}
          aria-label={isListening ? "Stop listening" : "Start voice search"}
        >
          <Mic className={cn("h-5 w-5", isListening && "animate-pulse")} />
        </Button>
      </motion.div>

      {/* Transcript display */}
      <AnimatePresence mode="wait">
        {isListening || transcript || interimTranscript ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="w-full max-w-md"
          >
            <div className="relative rounded-lg border bg-background p-3">
              <p className="min-h-[1.5rem] text-sm">
                {transcript && <span className="text-foreground">{transcript}</span>}
                {interimTranscript && (
                  <span className="text-muted-foreground">{interimTranscript}</span>
                )}
                {isListening && !transcript && !interimTranscript && (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </p>

              {/* Actions */}
              {transcript && !isListening && (
                <div className="mt-2 flex items-center justify-end gap-2">
                  <Button variant="ghost" size="xs" onClick={handleClear}>
                    <X className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                  <Button size="xs" onClick={handleSubmit}>
                    <Search className="mr-1 h-3 w-3" />
                    Search
                  </Button>
                </div>
              )}

              {/* Listening indicator */}
              {isListening && (
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  <span className="text-xs text-muted-foreground">Listening...</span>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
