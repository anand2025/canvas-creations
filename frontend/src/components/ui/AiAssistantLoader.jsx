"use client";

import dynamic from "next/dynamic";

// Lazy-load AI assistant — only ships JS when the user actually opens the chat
const AiAssistant = dynamic(() => import("@/components/ui/AiAssistant"), { ssr: false });

export default function AiAssistantLoader() {
    return <AiAssistant />;
}
