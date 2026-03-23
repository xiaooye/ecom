"use client";

import { useState } from "react";
import { MessageSquare, ChevronDown, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sampleQuestions = [
  {
    id: "1",
    question: "Is this true to size?",
    answer: "Yes, this item fits true to size. If you're between sizes, we recommend going with your usual size.",
    askedBy: "Customer",
    date: "2 weeks ago",
  },
  {
    id: "2",
    question: "What material is this made of?",
    answer: "This is made from 100% premium cotton for maximum comfort and durability.",
    askedBy: "Customer",
    date: "1 month ago",
  },
];

export function ProductQA() {
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    toast.success("Question submitted! We'll answer it shortly.");
    setQuestion("");
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sampleQuestions.length} questions
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          <MessageSquare className="mr-2 h-3.5 w-3.5" />
          Ask a Question
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex gap-2 overflow-hidden"
          >
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question..."
              className="h-9"
            />
            <Button type="submit" size="sm" className="h-9 shrink-0">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {sampleQuestions.map((qa) => (
          <div key={qa.id} className="rounded-lg border">
            <button
              onClick={() =>
                setExpandedId(expandedId === qa.id ? null : qa.id)
              }
              className="flex w-full items-center justify-between p-3 text-left text-sm"
            >
              <span className="font-medium">Q: {qa.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                  expandedId === qa.id ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {expandedId === qa.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-t px-3 pb-3 pt-2">
                    <p className="text-sm text-muted-foreground">
                      A: {qa.answer}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground/70">
                      Asked by {qa.askedBy} · {qa.date}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
