import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { User } from "firebase/auth";

export interface Workflow {
  id: string;
  type: "SUMMARIZE_EMAIL" | "EXTRACT_DATA" | "GENERATE_REPORT" | string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  inputContext: string;
  outputResult?: string;
  createdAt: any;
}

export interface Intelligence {
  id: string;
  source: string;
  extractedEntities: any;
  vetted: boolean;
  createdAt: any;
}

export function useWorkspaceData(user: User | null) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [intelligence, setIntelligence] = useState<Intelligence[]>([]);

  useEffect(() => {
    if (!user) {
      setWorkflows([]);
      setIntelligence([]);
      return;
    }

    const wfQuery = query(
      collection(db, "workflows"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsubWf = onSnapshot(wfQuery, (snap) => {
      setWorkflows(snap.docs.map(d => ({ id: d.id, ...d.data() } as Workflow)));
    });

    const intelQuery = query(
      collection(db, "intelligence"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsubIntel = onSnapshot(intelQuery, (snap) => {
      setIntelligence(snap.docs.map(d => ({ id: d.id, ...d.data() } as Intelligence)));
    });

    return () => {
      unsubWf();
      unsubIntel();
    };
  }, [user]);

  return { workflows, intelligence };
}
