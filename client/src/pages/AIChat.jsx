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
            }
        ]);

        setMessage("");
        setLoading(true);

        try {
            const data = await apiRequest("/ai/chat", {
                method: "POST",
                body: JSON.stringify({ question })
            });

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: data.answer,
                    sources: data.sources || []
                }
            ]);

        } catch (error) {
            console.error("AI Chat Error:", error);

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, something went wrong. Please try again.",
                    sources: []
                }
            ]);
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
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
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

                    {loading && (
                        <div className="ai-response">
                            <div className="ai-avatar">✦</div>
                            <div className="ai-response-card">
                                Thinking...
                            </div>
                        </div>
                    )}


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

                                <div className="input-tools">

                                    <button
                                        type="button"
                                        title="Attach"
                                    >
                                        ⌕
                                    </button>

                                    <button
                                        type="button"
                                        title="Image"
                                    >
                                        ▧
                                    </button>

                                    <button
                                        type="button"
                                        title="Voice"
                                    >
                                        ♩
                                    </button>

                                </div>


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