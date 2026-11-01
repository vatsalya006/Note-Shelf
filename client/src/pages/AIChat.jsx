import { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function AIChat() {
    const [message, setMessage] = useState("");
    const [responseStyle, setResponseStyle] = useState("Detailed");
    const [showSources, setShowSources] = useState(true);
    const [useNotesOnly, setUseNotesOnly] = useState(true);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePrompt = (prompt) => {
        setMessage(prompt);
    };

    const [totalNotes, setTotalNotes] = useState(0);

    useEffect(() => {
        const fetchNotesCount = async () => {
            try {
                const data = await apiRequest("/notes");
                setTotalNotes(data.notes?.length || 0);
            } catch (error) {
                console.error("Failed to fetch notes count:", error.message);
            }
        };

        fetchNotesCount();
    }, []);

    const handleSend = async () => {
        const question = message.trim();

        if (!question || loading) return;

        setMessages(prev => [
            ...prev,
            {
                role: "user",
                content: question
            },
            {
                role: "assistant",
                content: "",
                sources: []
            }
        ]);

        setMessage("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:3000/api/ai/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && {
                        Authorization: `Bearer ${token}`,
                    }),
                },
                body: JSON.stringify({ question })
            });

            if (!response.ok) {
                throw new Error("Failed to start AI chat");
            }

            if (!response.body) {
                throw new Error("Streaming response is not available");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                const events = buffer.split("\n\n");
                buffer = events.pop() || "";

                for (const event of events) {
                    const line = event
                        .split("\n")
                        .find(line => line.startsWith("data: "));

                    if (!line) continue;

                    const payload = JSON.parse(line.slice(6));

                    if (payload.type === "chunk") {
                        setMessages(prev => {
                            const updated = [...prev];
                            const lastMessage = updated[updated.length - 1];

                            if (lastMessage?.role === "assistant") {
                                updated[updated.length - 1] = {
                                    ...lastMessage,
                                    content: lastMessage.content + payload.text
                                };
                            }

                            return updated;
                        });
                    }

                    if (payload.type === "sources") {
                        setMessages(prev => {
                            const updated = [...prev];
                            const lastMessage = updated[updated.length - 1];

                            if (lastMessage?.role === "assistant") {
                                updated[updated.length - 1] = {
                                    ...lastMessage,
                                    sources: payload.sources || []
                                };
                            }

                            return updated;
                        });
                    }

                    if (payload.type === "error") {
                        throw new Error(payload.message || "Streaming failed");
                    }
                }
            }

        } catch (error) {
            console.error("AI Chat Error:", error);

            setMessages(prev => {
                const updated = [...prev];
                const lastMessage = updated[updated.length - 1];

                if (lastMessage?.role === "assistant" && !lastMessage.content) {
                    updated[updated.length - 1] = {
                        ...lastMessage,
                        content: "Sorry, something went wrong. Please try again."
                    };
                }

                return updated;
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="ai-chat-page">

            {/* ================= HEADER ================= */}

            <div className="ai-chat-header">

                <div>
                    <h1>AI Chat</h1>

                    <p>
                        Answers only from your saved notes
                    </p>
                </div>

                <div className="notes-indexed">
                    {totalNotes} notes indexed
                </div>

            </div>

            {/* ================= CHAT LAYOUT ================= */}

            <div className="chat-layout">

                {/* ================= MAIN CHAT ================= */}

                <div className="chat-main">

                    {messages.length === 0 && !loading && (
                        <div className="chat-welcome">
                            <div className="chat-welcome-icon">✦</div>

                            <h2>Your knowledge, one conversation away.</h2>

                            <p>
                                Ask questions, explore ideas, and discover connections
                                across your {totalNotes} saved notes.
                            </p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={
                                msg.role === "user"
                                    ? "user-message"
                                    : "ai-response"
                            }
                        >
                            {msg.role === "assistant" && (
                                <div className="ai-avatar">✦</div>
                            )}

                            <div
                                className={
                                    msg.role === "user"
                                        ? "user-message-text"
                                        : "ai-response-card"
                                }
                            >
                                <div className="markdown-content">
                                    {msg.role === "assistant" && loading && !msg.content
                                        ? "Thinking..."
                                        : <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    }
                                </div>

                                {msg.role === "assistant" && msg.sources?.length > 0 && (
                                    <div className="answer-sources">
                                        <span className="source-label">Sources:</span>

                                        {msg.sources.map((source, sourceIndex) => (
                                            <button
                                                key={sourceIndex}
                                                className="source-chip"
                                                type="button"
                                                onClick={() =>
                                                    navigate(`/notes/${source.noteId}`)
                                                }
                                            >
                                                {source.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* ================= INPUT ================= */}

                    <div className="chat-input-area">

                        <div className="chat-input-box">

                            <input
                                className="chat-input"
                                type="text"
                                placeholder="Ask anything about your notes..."
                                value={message}
                                onChange={(event) =>
                                    setMessage(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleSend();
                                    }
                                }}
                            />


                            <div className="chat-input-bottom">

                                <button
                                    className="primary send-chat"
                                    type="button"
                                    onClick={handleSend}
                                >
                                    ➤ Send
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default AIChat;