import { useState } from "react";

function AISearch() {
    const [query, setQuery] = useState("");

    const quickSearches = [
        "What is database normalization?",
        "Explain React useEffect hook",
        "How does JWT authentication work?",
        "What is time complexity?",
    ];

    const results = [
        {
            type: "PDF",
            iconClass: "pdf-icon",
            title: "Load Balancing in Distributed Systems",
            meta: "DBMS_Complete_Notes.pdf • Page 45",
            description:
                "Load balancing is the process of distributing network traffic across multiple servers to ensure no single server handles too much traffic.",
            score: "95%",
            source: "PDF",
        },
        {
            type: "DOC",
            iconClass: "doc-icon",
            title: "System Design - Scalability Patterns",
            meta: "System_Design_Notes.docx • Page 12",
            description:
                "Horizontal scaling and load balancing are key strategies for building scalable systems. Load balancers act as a reverse proxy.",
            score: "89%",
            source: "Document",
        },
        {
            type: "▶",
            iconClass: "video-icon",
            title: "Load Balancing Explained",
            meta: "Tech Concepts • YouTube Video • 12:34",
            description:
                "This video explains different types of load balancers, algorithms like round robin and least connections, and how they improve reliability.",
            score: "85%",
            source: "Video",
        },
    ];

    const handleSearch = () => {
        if (!query.trim()) {
            return;
        }

        console.log("AI Search query:", query);
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

                <div className="search-status">
                    <span className="status-dot"></span>
                    Searching 47 notes
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


            {/* ================= SEARCH STATS ================= */}

            <div className="search-stats">

                <div className="search-stat">

                    <div className="stat-icon purple">
                        📄
                    </div>

                    <div>
                        <span>Total Notes</span>
                        <strong>47</strong>
                        <small>Across all sources</small>
                    </div>

                </div>


                <div className="search-stat">

                    <div className="stat-icon green">
                        🔗
                    </div>

                    <div>
                        <span>Connections</span>
                        <strong>134</strong>
                        <small>Knowledge links</small>
                    </div>

                </div>


                <div className="search-stat">

                    <div className="stat-icon blue">
                        🗂️
                    </div>

                    <div>
                        <span>Sources</span>
                        <strong>12</strong>
                        <small>PDFs, Docs, Videos</small>
                    </div>

                </div>


                <div className="search-stat">

                    <div className="stat-icon yellow">
                        ✨
                    </div>

                    <div>
                        <span>AI Accuracy</span>
                        <strong>92%</strong>
                        <small>Relevant results</small>
                    </div>

                </div>

            </div>


            {/* ================= RESULTS + FILTERS ================= */}

            <div className="search-results-layout">


                {/* ===== RESULTS ===== */}

                <div className="search-results-panel">

                    <div className="search-panel-header">

                        <div>
                            <h2>Top Results</h2>

                            <span className="results-count">
                                6 results found
                            </span>
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
                                    {result.description}
                                </p>


                                <div className="result-bottom">

                                    <div className="result-tags">

                                        <span className="tag">
                                            system-design
                                        </span>

                                        <span className="tag">
                                            distributed-systems
                                        </span>

                                    </div>

                                    <button
                                        className="result-open"
                                        type="button"
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


                {/* ===== FILTERS ===== */}

                <aside className="search-filters">

                    <div className="filter-header">
                        <h2>Filter Results</h2>
                    </div>


                    <div className="filter-section">

                        <h3>
                            Source Type
                        </h3>


                        <label className="filter-option">

                            <span>
                                <input
                                    type="checkbox"
                                    defaultChecked
                                />
                                PDF Documents
                            </span>

                            <b>23</b>

                        </label>


                        <label className="filter-option">

                            <span>
                                <input
                                    type="checkbox"
                                    defaultChecked
                                />
                                Word Documents
                            </span>

                            <b>12</b>

                        </label>


                        <label className="filter-option">

                            <span>
                                <input
                                    type="checkbox"
                                    defaultChecked
                                />
                                Text Notes
                            </span>

                            <b>8</b>

                        </label>


                        <label className="filter-option">

                            <span>
                                <input
                                    type="checkbox"
                                    defaultChecked
                                />
                                YouTube Videos
                            </span>

                            <b>4</b>

                        </label>


                        <label className="filter-option disabled">

                            <span>
                                <input
                                    type="checkbox"
                                    disabled
                                />
                                CSV Files
                            </span>

                            <b>0</b>

                        </label>

                    </div>


                    <div className="filter-section">

                        <h3>
                            Time Range
                        </h3>

                        <select className="time-select" defaultValue="all">

                            <option value="all">
                                All Time
                            </option>

                            <option value="today">
                                Today
                            </option>

                            <option value="week">
                                This Week
                            </option>

                            <option value="month">
                                This Month
                            </option>

                        </select>

                    </div>


                    <div className="filter-section">

                        <h3>
                            Relevance Score
                        </h3>

                        <div className="relevance-control">

                            <input
                                type="range"
                                min="0"
                                max="100"
                                defaultValue="70"
                            />

                            <span>
                                70%+
                            </span>

                        </div>

                    </div>

                </aside>

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