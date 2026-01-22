"use client";

import { useState } from "react";
import styles from "./Chat.module.css";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content:
                "Hi! I'm your learning assistant. I can help you with questions about your current skill, suggest resources, and keep you motivated. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages([...messages, userMessage]);
        setInput("");
        setLoading(true);

        // Simulated AI response for MVP (replace with actual AI API later)
        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: `I understand you want to know about "${input}". For the MVP, this is a placeholder response. In the full version, I'll provide context-aware assistance based on your current skill plan and progress. Keep up the great work! 🚀`,
            };
            setMessages((prev) => [...prev, aiMessage]);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Learning Assistant</h1>
                <p className={styles.subtitle}>
                    Ask questions about your learning journey
                </p>
            </div>

            <div className={styles.messagesContainer}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`${styles.message} ${message.role === "user" ? styles.userMessage : styles.aiMessage
                            }`}
                    >
                        <div className={styles.messageContent}>{message.content}</div>
                    </div>
                ))}
                {loading && (
                    <div className={`${styles.message} ${styles.aiMessage}`}>
                        <div className={styles.messageContent}>
                            <div className={styles.typing}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className={styles.inputForm}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="input"
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !input.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
}
