import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-page">

            {/* ================= HEADER ================= */}

            <div className="new-dashboard-header">

                <div>
                    <h1>Let's Start</h1>
                    <p>
                        Here's what's happening across your knowledge base.
                    </p>
                </div>

                <div className="dashboard-header-actions">

                    <div className="dashboard-search-box">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search your knowledge..."
                        />

                        <kbd>⌘ K</kbd>
                    </div>

                    <button
                        className="dashboard-notification"
                        type="button"
                    >
                        ♢
                    </button>

                    <div className="dashboard-user-avatar">
                        R
                    </div>

                </div>

            </div>


            {/* ================= STATS ================= */}

            <div className="dashboard-stat-grid">

                <div className="dashboard-stat health-stat">

                    <div className="stat-title">
                        Knowledge Health
                        <small>?</small>
                    </div>

                    <span className="stat-number purple-number">
                        87%
                    </span>

                    <div className="stat-status">
                        ● Excellent
                    </div>

                </div>


                <div className="dashboard-stat">

                    <div className="stat-icon purple">
                        ◫
                    </div>

                    <div className="stat-title">
                        Total Notes
                    </div>

                    <span className="stat-number">
                        47
                    </span>

                    <small>
                        +5 this week
                    </small>

                </div>


                <div className="dashboard-stat">

                    <div className="stat-icon blue">
                        PDF
                    </div>

                    <div className="stat-title">
                        PDFs Saved
                    </div>

                    <span className="stat-number">
                        12
                    </span>

                    <small>
                        3 processed today
                    </small>

                </div>


                <div className="dashboard-stat">

                    <div className="stat-icon red">
                        ▶
                    </div>

                    <div className="stat-title">
                        YouTube Links
                    </div>

                    <span className="stat-number">
                        8
                    </span>

                    <small>
                        2 new this week
                    </small>

                </div>


                <div className="dashboard-stat">

                    <div className="stat-icon yellow">
                        ◷
                    </div>

                    <div className="stat-title">
                        Review Due
                    </div>

                    <span className="stat-number">
                        6
                    </span>

                    <small>
                        75 min estimated
                    </small>

                </div>

            </div>


            {/* ================= MIDDLE ================= */}

            <div className="dashboard-middle-grid">

                {/* ===== KNOWLEDGE MAP ===== */}

                <div className="new-dashboard-panel knowledge-map-panel">

                    <div className="new-panel-header">

                        <h2>
                            <span className="cyan-symbol">⌘</span>
                            Knowledge Map Preview
                        </h2>

                        <button
                            type="button"
                            onClick={() => navigate("/graph")}
                        >
                            Open Graph ↗
                        </button>

                    </div>


                    <div className="knowledge-map-container">

                        <svg
                            viewBox="0 0 650 360"
                            preserveAspectRatio="xMidYMid meet"
                        >

                            {/* Connections */}

                            <g
                                fill="none"
                                stroke="#303248"
                                strokeWidth="1.5"
                            >
                                <line x1="325" y1="180" x2="160" y2="80" />
                                <line x1="325" y1="180" x2="490" y2="80" />
                                <line x1="325" y1="180" x2="165" y2="285" />
                                <line x1="325" y1="180" x2="485" y2="285" />
                                <line x1="325" y1="180" x2="325" y2="315" />
                            </g>

                            {/* Strong connections */}

                            <g
                                fill="none"
                                stroke="#7c3cff"
                                strokeWidth="2.5"
                            >
                                <line x1="325" y1="180" x2="160" y2="80" />
                                <line x1="325" y1="180" x2="165" y2="285" />
                            </g>


                            {/* Main node */}

                            <circle
                                cx="325"
                                cy="180"
                                r="48"
                                fill="#7c3cff"
                            />

                            <text
                                x="325"
                                y="175"
                                textAnchor="middle"
                                fill="#fff"
                                fontSize="14"
                                fontWeight="800"
                            >
                                System
                            </text>

                            <text
                                x="325"
                                y="193"
                                textAnchor="middle"
                                fill="#fff"
                                fontSize="14"
                                fontWeight="800"
                            >
                                Design
                            </text>


                            {/* Database */}

                            <circle
                                cx="325"
                                cy="50"
                                r="29"
                                fill="#11121c"
                                stroke="#16c8e8"
                                strokeWidth="2"
                            />

                            <text
                                x="325"
                                y="55"
                                textAnchor="middle"
                                fill="#16c8e8"
                                fontSize="10"
                                fontWeight="800"
                            >
                                Databases
                            </text>


                            {/* OS */}

                            <circle
                                cx="160"
                                cy="80"
                                r="30"
                                fill="#11121c"
                                stroke="#287cff"
                                strokeWidth="2"
                            />

                            <text
                                x="160"
                                y="85"
                                textAnchor="middle"
                                fill="#5ca1ff"
                                fontSize="12"
                                fontWeight="800"
                            >
                                OS
                            </text>


                            {/* Networking */}

                            <circle
                                cx="490"
                                cy="80"
                                r="31"
                                fill="#11121c"
                                stroke="#9b68ff"
                                strokeWidth="2"
                            />

                            <text
                                x="490"
                                y="85"
                                textAnchor="middle"
                                fill="#a875ff"
                                fontSize="10"
                                fontWeight="800"
                            >
                                Networking
                            </text>


                            {/* Algorithms */}

                            <circle
                                cx="165"
                                cy="285"
                                r="29"
                                fill="#11121c"
                                stroke="#ff4d5e"
                                strokeWidth="2"
                            />

                            <text
                                x="165"
                                y="290"
                                textAnchor="middle"
                                fill="#ff6674"
                                fontSize="9"
                                fontWeight="800"
                            >
                                Algorithms
                            </text>


                            {/* Scaling */}

                            <circle
                                cx="485"
                                cy="285"
                                r="29"
                                fill="#11121c"
                                stroke="#ffb020"
                                strokeWidth="2"
                            />

                            <text
                                x="485"
                                y="290"
                                textAnchor="middle"
                                fill="#ffb020"
                                fontSize="10"
                                fontWeight="800"
                            >
                                Scaling
                            </text>


                            {/* Memory */}

                            <circle
                                cx="325"
                                cy="315"
                                r="27"
                                fill="#11121c"
                                stroke="#00d68f"
                                strokeWidth="2"
                            />

                            <text
                                x="325"
                                y="320"
                                textAnchor="middle"
                                fill="#00d68f"
                                fontSize="10"
                                fontWeight="800"
                            >
                                Memory
                            </text>

                        </svg>


                        <div className="map-legend">

                            <span>
                                <i className="strong-line"></i>
                                Strong connection
                            </span>

                            <span>
                                <i className="medium-line"></i>
                                Medium connection
                            </span>

                            <span>
                                <i className="weak-line"></i>
                                Weak connection
                            </span>

                        </div>

                    </div>

                </div>


                {/* ===== KNOWLEDGE HEALTH ===== */}

                <div className="new-dashboard-panel health-dashboard-panel">

                    <div className="new-panel-header">

                        <h2>
                            <span className="purple-symbol">◉</span>
                            Knowledge Health
                        </h2>

                    </div>


                    <div className="health-ring">

                        <div>
                            <strong>87%</strong>
                            <span>Healthy</span>
                        </div>

                    </div>


                    <p className="health-message">
                        Your knowledge base is growing steadily.
                        Keep reviewing your older notes.
                    </p>


                    <div className="health-bars">

                        <div className="health-bar-row">

                            <span>Coverage</span>

                            <div>
                                <i className="green-bar"></i>
                            </div>

                            <b>90%</b>

                        </div>


                        <div className="health-bar-row">

                            <span>Connections</span>

                            <div>
                                <i className="blue-bar"></i>
                            </div>

                            <b>78%</b>

                        </div>


                        <div className="health-bar-row">

                            <span>Reviews</span>

                            <div>
                                <i className="purple-bar"></i>
                            </div>

                            <b>75%</b>

                        </div>


                        <div className="health-bar-row">

                            <span>Freshness</span>

                            <div>
                                <i className="orange-bar"></i>
                            </div>

                            <b>85%</b>

                        </div>

                    </div>

                </div>


                {/* ===== AI INSIGHTS ===== */}

                <div className="new-dashboard-panel ai-insights-panel">

                    <div className="new-panel-header">

                        <h2>
                            <span className="purple-symbol">✦</span>
                            AI Insights
                        </h2>

                        <button type="button">
                            View all
                        </button>

                    </div>


                    <div className="ai-insight-list">

                        <div className="ai-insight">

                            <div className="ai-insight-icon green-insight">
                                ↑
                            </div>

                            <div>
                                <strong>
                                    Strong learning pattern
                                </strong>

                                <p>
                                    Your system design notes are strongly connected
                                    to distributed systems.
                                </p>
                            </div>

                        </div>


                        <div className="ai-insight">

                            <div className="ai-insight-icon yellow-insight">
                                !
                            </div>

                            <div>
                                <strong>
                                    Review recommended
                                </strong>

                                <p>
                                    6 notes have not been reviewed recently.
                                </p>
                            </div>

                        </div>


                        <div className="ai-insight">

                            <div className="ai-insight-icon red-insight">
                                ⚠
                            </div>

                            <div>
                                <strong>
                                    Knowledge gap detected
                                </strong>

                                <p>
                                    Networking concepts could use more connections.
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================= BOTTOM ================= */}

            <div className="dashboard-bottom-grid">


                {/* ===== CONTINUE LEARNING ===== */}

                <div className="new-dashboard-panel learning-dashboard-panel">

                    <div className="new-panel-header">

                        <h2>
                            <span className="blue-symbol">▣</span>
                            Continue Learning
                        </h2>

                        <button
                            type="button"
                            onClick={() => navigate("/notes")}
                        >
                            View all
                        </button>

                    </div>


                    <div className="learning-items">

                        <div className="learning-item">

                            <div className="learning-icon purple-learning">
                                ◈
                            </div>

                            <div>

                                <h3>
                                    System Design - Load Balancing
                                </h3>

                                <p>
                                    Horizontal scaling, round robin,
                                    consistent hashing...
                                </p>

                            </div>

                            <button
                                className="link"
                                onClick={() => navigate("/notes")}
                            >
                                Open →
                            </button>

                        </div>


                        <div className="learning-item">

                            <div className="learning-icon red-learning">
                                ◈
                            </div>

                            <div>

                                <h3>
                                    CS50 Week 4 - Memory & Pointers
                                </h3>

                                <p>
                                    Stack vs heap, malloc, free,
                                    memory leaks...
                                </p>

                            </div>

                            <button
                                className="link"
                                onClick={() => navigate("/notes")}
                            >
                                Open →
                            </button>

                        </div>


                        <div className="learning-item">

                            <div className="learning-icon cyan-learning">
                                ▤
                            </div>

                            <div>

                                <h3>
                                    DBMS Complete Notes
                                </h3>

                                <p>
                                    Normalization, Indexing,
                                    Transactions...
                                </p>

                            </div>

                            <button
                                className="link"
                                onClick={() => navigate("/notes")}
                            >
                                Open →
                            </button>

                        </div>

                    </div>

                </div>


                {/* ===== REVIEW PATH ===== */}

                <div className="new-dashboard-panel review-dashboard-panel">

                    <div className="new-panel-header">

                        <h2>
                            <span className="purple-symbol">◎</span>
                            Today's Review Path
                        </h2>

                        <button type="button">
                            View full path
                        </button>

                    </div>


                    <div className="review-path">

                        <div className="review-card">

                            <div className="review-number purple-review">
                                1
                            </div>

                            <h3>
                                Normalization
                            </h3>

                            <span>
                                (DBMS)
                            </span>

                            <small>
                                15 min
                            </small>

                        </div>


                        <div className="review-arrow">
                            →
                        </div>


                        <div className="review-card">

                            <div className="review-number blue-review">
                                2
                            </div>

                            <h3>
                                Process Scheduling
                            </h3>

                            <span>
                                (OS)
                            </span>

                            <small>
                                20 min
                            </small>

                        </div>


                        <div className="review-arrow">
                            →
                        </div>


                        <div className="review-card">

                            <div className="review-number green-review">
                                3
                            </div>

                            <h3>
                                Memory Pointers
                            </h3>

                            <span>
                                (CS50)
                            </span>

                            <small>
                                25 min
                            </small>

                        </div>


                        <div className="review-arrow">
                            →
                        </div>


                        <div className="review-card">

                            <div className="review-number orange-review">
                                4
                            </div>

                            <h3>
                                Scaling
                            </h3>

                            <span>
                                (System Design)
                            </span>

                            <small>
                                15 min
                            </small>

                        </div>

                    </div>


                    <div className="review-progress">

                        <div>
                            <span></span>
                        </div>

                        <p>
                            <span>2 of 4 completed</span>
                            <span>Total: 75 min</span>
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;