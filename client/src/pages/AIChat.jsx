import { useState } from "react";

function AIChat() {
    const [message, setMessage] = useState("");
    const [responseStyle, setResponseStyle] = useState("Detailed");
    const [showSources, setShowSources] = useState(true);
    const [useNotesOnly, setUseNotesOnly] = useState(true);

    const handlePrompt = (prompt) => {
        setMessage(prompt);
    };

    const handleSend = () => {
        if (!message.trim()) {
            return;
        }

        console.log("AI Chat message:", message);

        setMessage("");
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
                    47 notes indexed
                </div>

            </div>

            {/* ================= CHAT LAYOUT ================= */}

            <div className="chat-layout">

                {/* ================= MAIN CHAT ================= */}

                <div className="chat-main">

                    <div className="chat-messages">

                        {/* USER MESSAGE */}

                        <div className="user-message">

                            <div className="user-message-text">
                                Explain the difference between horizontal and
                                vertical scaling from my notes
                            </div>

                            <div className="message-time">
                                10:32 AM ✓✓
                            </div>

                        </div>


                        {/* AI RESPONSE */}

                        <div className="ai-response">

                            <div className="ai-avatar">
                                ✦
                            </div>


                            <div className="ai-response-card">

                                <p>
                                    Based on your System Design notes, the difference
                                    between horizontal and vertical scaling is:
                                </p>


                                {/* COMPARISON */}

                                <div className="comparison-grid">

                                    <div className="comparison-column">

                                        <h3 className="purple-text">
                                            Horizontal Scaling (Scale Out)
                                        </h3>

                                        <ul>

                                            <li>
                                                Adding more servers to distribute load
                                            </li>

                                            <li>
                                                Increases system capacity by adding more machines
                                            </li>

                                            <li>
                                                Better fault tolerance and high availability
                                            </li>

                                            <li>
                                                More complex to manage
                                            </li>

                                            <li>
                                                Examples: Load balancer, distributed databases
                                            </li>

                                        </ul>

                                    </div>


                                    <div className="comparison-column">

                                        <h3 className="cyan-text">
                                            Vertical Scaling (Scale Up)
                                        </h3>

                                        <ul>

                                            <li>
                                                Adding more power to an existing server
                                            </li>

                                            <li>
                                                Increases capacity by upgrading CPU, RAM, etc.
                                            </li>

                                            <li>
                                                Simpler to implement
                                            </li>

                                            <li>
                                                Limited by hardware capacity
                                            </li>

                                            <li>
                                                Examples: Upgrading server specs
                                            </li>

                                        </ul>

                                    </div>

                                </div>


                                <p className="ai-extra-text">
                                    Your DBMS notes connect this idea to distributed
                                    databases and sharding for horizontal scaling.
                                </p>


                                {/* SOURCES */}

                                {showSources && (

                                    <div className="answer-sources">

                                        <span className="source-label">
                                            Sources:
                                        </span>

                                        <span className="source-chip">
                                            System Design - Load Balancing
                                        </span>

                                        <span className="source-chip">
                                            DBMS - Distributed DB
                                        </span>

                                    </div>

                                )}


                                {/* RESPONSE FOOTER */}

                                <div className="response-footer">

                                    <span>
                                        10:32 AM
                                    </span>

                                    <div className="response-actions">

                                        <button
                                            type="button"
                                            title="Helpful"
                                        >
                                            ♡
                                        </button>

                                        <button
                                            type="button"
                                            title="Not helpful"
                                        >
                                            ♧
                                        </button>

                                        <button
                                            type="button"
                                            title="Copy"
                                            onClick={() =>
                                                navigator.clipboard?.writeText(
                                                    "Based on your System Design notes, horizontal scaling adds more servers while vertical scaling adds more power to an existing server."
                                                )
                                            }
                                        >
                                            □
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


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


                {/* ================= RIGHT SIDEBAR ================= */}

                <aside className="ai-chat-sidebar">

                    {/* TRY ASKING */}

                    <div className="chat-side-card">

                        <div className="chat-side-title">
                            ✦ &nbsp; TRY ASKING
                        </div>


                        <button
                            className="side-prompt"
                            type="button"
                            onClick={() =>
                                handlePrompt("Summarize my DBMS notes")
                            }
                        >
                            Summarize my DBMS notes
                        </button>


                        <button
                            className="side-prompt"
                            type="button"
                            onClick={() =>
                                handlePrompt("What is CAP theorem?")
                            }
                        >
                            What is CAP theorem?
                        </button>


                        <button
                            className="side-prompt"
                            type="button"
                            onClick={() =>
                                handlePrompt("Compare OS scheduling algorithms")
                            }
                        >
                            Compare OS scheduling algorithms
                        </button>


                        <button
                            className="side-prompt"
                            type="button"
                            onClick={() =>
                                handlePrompt("Explain TCP vs UDP")
                            }
                        >
                            Explain TCP vs UDP
                        </button>

                    </div>


                    {/* USED SOURCES */}

                    <div className="chat-side-card">

                        <div className="chat-side-title">
                            ▣ &nbsp; USED SOURCES
                        </div>


                        <div className="used-source">

                            <span className="source-dot"></span>

                            <span>
                                System Design
                            </span>

                            <strong>
                                18
                            </strong>

                        </div>


                        <div className="used-source">

                            <span className="source-dot"></span>

                            <span>
                                DBMS Notes
                            </span>

                            <strong>
                                12
                            </strong>

                        </div>


                        <div className="used-source">

                            <span className="source-dot"></span>

                            <span>
                                OS Scheduling
                            </span>

                            <strong>
                                9
                            </strong>

                        </div>


                        <div className="used-source">

                            <span className="source-dot"></span>

                            <span>
                                Networking
                            </span>

                            <strong>
                                8
                            </strong>

                        </div>

                    </div>


                    {/* AI SETTINGS */}

                    <div className="chat-side-card ai-settings">

                        <div className="chat-side-title">
                            ⚙ &nbsp; AI SETTINGS
                        </div>


                        <label>
                            Response Style
                        </label>

                        <select
                            value={responseStyle}
                            onChange={(event) =>
                                setResponseStyle(event.target.value)
                            }
                        >
                            <option>
                                Detailed
                            </option>

                            <option>
                                Concise
                            </option>

                            <option>
                                Simple
                            </option>
                        </select>


                        <div className="setting-row">

                            <span>
                                Sources
                            </span>

                            <label className="toggle">

                                <input
                                    type="checkbox"
                                    checked={showSources}
                                    onChange={(event) =>
                                        setShowSources(event.target.checked)
                                    }
                                />

                                <span className="toggle-slider"></span>

                            </label>

                        </div>


                        <div className="setting-row">

                            <span>
                                Notes only
                            </span>

                            <label className="toggle">

                                <input
                                    type="checkbox"
                                    checked={useNotesOnly}
                                    onChange={(event) =>
                                        setUseNotesOnly(event.target.checked)
                                    }
                                />

                                <span className="toggle-slider"></span>

                            </label>

                        </div>


                        <p className="settings-info">
                            {useNotesOnly
                                ? "AI answers are restricted to your saved knowledge."
                                : "AI can use broader context when answering."
                            }
                        </p>

                    </div>

                </aside>

            </div>

        </section>
    );
}

export default AIChat;