import { useState } from "react";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { User } from "firebase/auth";
import { gemini } from "../services/geminiService";
import { toast } from "sonner";

export function useAgent(user: User | null) {
  const [chatInput, setChatInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAgentChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || !user || isProcessing) return;

    setIsProcessing(true);
    const currentInput = chatInput;
    setChatInput("");

    try {
      toast.info("Analyzing intent...");
      const analysis = await gemini.detectIntent(currentInput);
      
      if (analysis.intent === "UNKNOWN") {
        toast.error("I'm not sure how to help with that. Try asking to summarize an email or extract data.");
        setIsProcessing(false);
        return;
      }

      toast.success(`Intent Detected: ${analysis.intent}`);

      // Create Workflow Entry
      const wfRef = await addDoc(collection(db, "workflows"), {
        userId: user.uid,
        type: analysis.intent,
        status: "PENDING",
        inputContext: currentInput,
        createdAt: serverTimestamp()
      });

      // Simple branching logic for prototype
      if (analysis.intent === "SUMMARIZE_EMAIL") {
        const summary = await gemini.summarizeEmail(currentInput);
        await setDoc(doc(db, "workflows", wfRef.id), {
          status: "COMPLETED",
          outputResult: summary,
          completedAt: serverTimestamp()
        }, { merge: true });
      } else if (analysis.intent === "EXTRACT_DATA") {
        const data = await gemini.extractEntities(currentInput);
        await addDoc(collection(db, "intelligence"), {
          userId: user.uid,
          source: currentInput.substring(0, 50) + "...",
          extractedEntities: data,
          vetted: false,
          createdAt: serverTimestamp()
        });
        await setDoc(doc(db, "workflows", wfRef.id), {
          status: "COMPLETED",
          completedAt: serverTimestamp()
        }, { merge: true });
      }

      toast.success("Workflow completed successfully.");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  return { chatInput, setChatInput, isProcessing, handleAgentChat };
}
