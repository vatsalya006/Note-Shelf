import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <section className="public-screen">

            {/* ================= NAVBAR ================= */}

            <header className="public-nav">

                <div className="public-brand">
                    <div className="logo">NS</div>
                    <span className="brand-name">Note Shelf</span>
                </div>

                <nav className="public-links">
                    <a href="#features">Features</a>
                    <a href="#about">About</a>
                    <a
                        href="https://github.com/vatsalya_006/notefy"
                        target="_blank"
                        rel="noreferrer"
                    >
                        GitHub
                    </a>
                </nav>

                <div className="public-actions">
                    <button
                        className="text-button"
                        onClick={() => navigate("/login")}
                    >
                        Log in
                    </button>

                    <button
                        className="primary"
                        onClick={() => navigate("/login")}
                    >
                        Get Started
                    </button>
                </div>

            </header>


            {/* ================= HERO ================= */}

            <main className="landing-hero">

                <div className="brain-row" aria-hidden="true">

                    <div className="brain-node">
                        <div className="brain-face">
                            📄
                        </div>
                        <span>Documents</span>
                    </div>

                    <div className="brain-node">
                        <div className="brain-face">
                            ▶
                        </div>
                        <span>Videos</span>
                    </div>

                    <div className="brain-node">
                        <div className="brain-face">
                            🤖
                        </div>
                        <span>AI</span>
                    </div>

                    <div className="brain-node">
                        <div className="brain-face">
                            🧠
                        </div>
                        <span>Knowledge</span>
                    </div>

                    <div className="brain-node">
                        <div className="brain-face">
                            🔍
                        </div>
                        <span>Search</span>
                    </div>

                </div>


                <h1>
                    Where notes and AI{" "}
                    <span className="highlight-pill">connect</span>
                </h1>

                <p>
                    Store notes, PDFs, and YouTube lectures in one intelligent workspace.
                    <br />
                    Turn scattered information into AI-powered summaries,
                    semantic search, and contextual conversations.
                </p>


                <div className="hero-actions">

                    <button
                        className="primary"
                        onClick={() => navigate("/login")}
                    >
                        Get Started
                    </button>

                    <button className="ghost">
                        View demo
                    </button>

                </div>


                {/* ================= WORKSPACE PREVIEW ================= */}

                <div className="hero-preview">

                    <div className="preview-bar">
                        <span className="window-dot"></span>
                        <span className="window-dot"></span>
                        <span className="window-dot"></span>

                        <span className="preview-bar-title">
                            Note Shelf / Knowledge workspace
                        </span>
                    </div>


                    <div className="preview-grid">

                        <aside className="preview-side">

                            <div className="section-title">
                                Today
                            </div>

                            <div className="preview-card">
                                <h3>Review due</h3>
                                <p>
                                    Normalization, scheduling, and memory pointers.
                                </p>
                            </div>

                            <div className="preview-card">
                                <h3>New links</h3>
                                <p>
                                    18 fresh connections found across your notes.
                                </p>
                            </div>

                        </aside>


                        <section className="preview-doc">

                            <span className="badge">
                                Note
                            </span>

                            <h2 className="preview-title">
                                System Design - Load Balancing
                            </h2>

                            <p className="preview-description">
                                Horizontal scaling distributes traffic across multiple
                                servers. Related ideas: DBMS sharding, OS scheduling,
                                TCP/IP routing.
                            </p>

                            <div className="tags">
                                <span className="tag">engineering</span>
                                <span className="tag">backend</span>
                                <span className="tag">distributed systems</span>
                            </div>

                            <div className="bar">
                                <span style={{ width: "88%" }}></span>
                            </div>

                            <div className="preview-stats">

                                <div className="stat-box">
                                    <span className="stat-number">152</span>
                                    <span className="stat-label">
                                        Knowledge Links
                                    </span>
                                </div>

                                <div className="stat-box">
                                    <span className="stat-number">24</span>
                                    <span className="stat-label">
                                        AI Summaries
                                    </span>
                                </div>

                                <div className="stat-box">
                                    <span className="stat-number">98%</span>
                                    <span className="stat-label">
                                        Context Match
                                    </span>
                                </div>

                            </div>

                        </section>


                        <aside className="preview-context">

                            <div className="section-title">
                                AI Context
                            </div>

                            <div className="chain">

                                <div className="chain-item">
                                    <span className="chain-dot"></span>
                                    DBMS Notes
                                </div>

                                <div className="chain-item">
                                    <span className="chain-dot"></span>
                                    OS Scheduling
                                </div>

                                <div className="chain-item">
                                    <span className="chain-dot"></span>
                                    TCP/IP Stack
                                </div>

                            </div>

                            <button
                                className="primary"
                                style={{ width: "100%", marginTop: "24px" }}
                                onClick={() => navigate("/login")}
                            >
                                Open dashboard
                            </button>

                        </aside>

                    </div>

                </div>

            </main>


            {/* ================= FEATURES ================= */}

            <section className="landing-band" id="features">

                <div className="landing-band-inner">

                    <div className="features-heading">
                        <span className="features-label">
                            FEATURES
                        </span>

                        <h2>
                            Everything in one place
                            <span className="heading-dot">.</span>
                        </h2>
                    </div>


                    <div className="feature-grid">

                        <article className="feature feature-purple">

                            <div className="feature-icon">
                                🔍
                            </div>

                            <span className="badge">
                                Semantic Search
                            </span>

                            <h3>
                                Find ideas, not exact words.
                            </h3>

                            <p>
                                Ask by meaning and get matched notes, PDFs, and video
                                summaries with relevance scores.
                            </p>

                        </article>


                        <article className="feature feature-cyan">

                            <div className="feature-icon">
                                🕸️
                            </div>

                            <span className="badge cyan">
                                Knowledge Graph
                            </span>

                            <h3>
                                See how topics connect.
                            </h3>

                            <p>
                                Every upload becomes a connected map of concepts, sources,
                                and related study paths.
                            </p>

                        </article>


                        <article className="feature feature-green">

                            <div className="feature-icon">
                                💬
                            </div>

                            <span className="badge green">
                                AI Chat
                            </span>

                            <h3>
                                Answers from your notes only.
                            </h3>

                            <p>
                                Chat with your saved content and see source chips for every
                                useful answer.
                            </p>

                        </article>


                        <article className="feature feature-purple">

                            <div className="feature-icon">
                                📄
                            </div>

                            <span className="badge">
                                PDF Upload
                            </span>

                            <h3>
                                Upload and understand PDFs.
                            </h3>

                            <p>
                                Upload PDFs and get instant AI summaries, key points,
                                and semantic search across the content.
                            </p>

                        </article>


                        <article className="feature feature-pink">

                            <div className="feature-icon">
                                ▶
                            </div>

                            <span className="badge pink">
                                YouTube Learning
                            </span>

                            <h3>
                                Learn from any video.
                            </h3>

                            <p>
                                Paste any YouTube link and get transcripts, summaries,
                                timestamps, and smart takeaways.
                            </p>

                        </article>


                        <article className="feature feature-yellow">

                            <div className="feature-icon">
                                📝
                            </div>

                            <span className="badge yellow">
                                Smart Notes
                            </span>

                            <h3>
                                Write. Organize. Connect.
                            </h3>

                            <p>
                                Create smart notes, link ideas, and let AI suggest connections
                                across your entire knowledge base.
                            </p>

                        </article>

                    </div>

                </div>

            </section>

        </section>
    );
}

export default Home;