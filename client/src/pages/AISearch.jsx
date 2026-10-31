import { useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";

function AISearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const quickSearches = [
        "What is database normalization?",
        "Explain React useEffect hook",
        "How does JWT authentication work?",
        "What is time complexity?",
    ];

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);

        try {
            const data = await apiRequest(
                `/ai/search?q=${encodeURIComponent(query.trim())}`
            );

            setResults(data.results || []);
        } catch (error) {
            console.error("AI Search Error:", error.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickSearch = (value) => {
        setQuery(value);
    };

    return (
        <section className="ai-search-page">

            {/* ================= HEADER ================= */}

            <div className="ai-search-header">

                <div>
                    <h1>AI Search</h1>

                    <p className="sub">
                        Search your knowledge base using natural language.
                        Get AI-powered answers from your notes.
                    </p>
                </div>

            </div>


            {/* ================= HERO SEARCH ================= */}

            <div className="ai-search-hero">

                <div className="ai-search-content">

                    <h2>
                        Ask anything from your knowledge
                    </h2>

                    <div className="ai-search-input-row">

                        <input
                            className="ai-search-input"
                            type="text"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            placeholder="Example: Explain load balancing in distributed systems"
                        />

                        <button
                            id="ai-search-button"
                            className="ai-search-button"
                            type="button"
                            onClick={handleSearch}
                        >
                            ✨ Search
                        </button>

                    </div>


                    <div className="quick-searches">

                        <span className="quick-label">
                            Try asking:
                        </span>

                        {quickSearches.map((item) => (
                            <button
                                className="quick-search"
                                key={item}
                                type="button"
                                onClick={() => handleQuickSearch(item)}
                            >
                                {item}
                            </button>
                        ))}

                    </div>

                </div>


                {/* AI visual */}

                <div className="ai-search-visual">

                    <div className="ai-glow"></div>

                    <div className="ai-brain">
                        🧠
                    </div>

                    <span className="ai-node node-1"></span>
                    <span className="ai-node node-2"></span>
                    <span className="ai-node node-3"></span>
                    <span className="ai-node node-4"></span>

                </div>

            </div>

            {/* ================= RESULTS + FILTERS ================= */}

            <div className="search-results-layout" style={{ gridTemplateColumns: "1fr" }}>


                {/* ===== RESULTS ===== */}

                <div className="search-results-panel">

                    <div className="search-panel-header">

                        <div>
                            <h2>Top {results.length} Results - </h2>
                        </div>

                    </div>


                    {results.map((result) => (

                        <article
                            className="ai-result"
                            key={result.title}
                        >

                            <div className={`result-source-icon ${result.iconClass}`}>
                                {result.type}
                            </div>


                            <div className="ai-result-content">

                                <div className="ai-result-title-row">

                                    <div>

                                        <h3>
                                            {result.title}
                                        </h3>

                                        <span className="result-meta">
                                            {result.meta}
                                        </span>

                                    </div>


                                    <div className="result-actions">

                                        <span className="result-score">
                                            Score: {result.score}
                                        </span>

                                        <span className="result-source-tag">
                                            {result.source}
                                        </span>

                                    </div>

                                </div>


                                <p className="ai-result-excerpt">
                                    {result.content
                                        ? result.content.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").slice(0, 250) +
                                        (result.content.length > 250 ? "..." : "")
                                        : "No content available for this result."}
                                </p>


                                <div className="result-bottom">
                                    <div className="result-tags">
                                        <span className="tag">
                                            {result.sourceType || "Knowledge"}
                                        </span>
                                    </div>

                                    <button
                                        className="result-open"
                                        type="button"
                                        onClick={() => navigate(`/notes/${result.noteId}`)}
                                    >
                                        Open source →
                                    </button>

                                </div>

                            </div>

                        </article>

                    ))}


                    <button
                        className="view-all-results"
                        type="button"
                    >
                        View all results →
                    </button>

                </div>

            </div>


            {/* ================= SEARCH TIPS ================= */}

            <div className="search-tips">

                <div className="tips-header">

                    <div className="tips-icon">
                        💡
                    </div>

                    <h2>
                        Search Tips
                    </h2>

                </div>


                <div className="tips-grid">

                    <div className="search-tip">

                        <strong>
                            Be specific
                        </strong>

                        <p>
                            Use specific terms for better results.
                        </p>

                    </div>


                    <div className="search-tip">

                        <strong>
                            Use natural language
                        </strong>

                        <p>
                            Ask questions like you normally would.
                        </p>

                    </div>


                    <div className="search-tip">

                        <strong>
                            Try different keywords
                        </strong>

                        <p>
                            Different words can find different results.
                        </p>

                    </div>


                    <div className="search-tip">

                        <strong>
                            Filter results
                        </strong>

                        <p>
                            Use filters to narrow down results.
                        </p>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default AISearch;