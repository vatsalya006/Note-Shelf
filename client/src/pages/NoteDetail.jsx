import { useNavigate } from "react-router-dom";

function NoteDetail() {
    const navigate = useNavigate();

    return (
        <section className="detail-page">

            <div className="detail-layout">

                {/* ================= NOTE CONTENT ================= */}

                <article className="article">

                    <div className="crumbs">
                        Notes / System Design / Load Balancing
                    </div>


                    {/* Editor toolbar */}

                    <div className="editor-tools">

                        <button type="button">
                            <b>B</b>
                        </button>

                        <button type="button">
                            <i>I</i>
                        </button>

                        <button type="button">
                            <u>U</u>
                        </button>

                        <span>|</span>

                        <button type="button">
                            H1
                        </button>

                        <button type="button">
                            H2
                        </button>

                        <button type="button">
                            •
                        </button>

                        <button type="button">
                            Link
                        </button>

                        <button type="button">
                            AI
                        </button>

                    </div>


                    {/* Title */}

                    <h1>
                        System Design - Load Balancing
                    </h1>


                    {/* Tags */}

                    <div className="tags">

                        <span className="tag">
                            engineering
                        </span>

                        <span className="tag">
                            backend
                        </span>

                        <span className="tag">
                            system-design
                        </span>

                        <button
                            className="tag add-tag"
                            type="button"
                        >
                            + Add tag
                        </button>

                    </div>


                    {/* Content */}

                    <h2>
                        What is Load Balancing?
                    </h2>

                    <p>
                        Load balancing distributes network traffic across multiple
                        servers. This prevents a single server from becoming overloaded
                        and improves application responsiveness.
                    </p>


                    <h2>
                        Types of Load Balancing Algorithms
                    </h2>

                    <ul>

                        <li>
                            <strong>Round Robin</strong> distributes requests
                            sequentially across servers.
                        </li>

                        <li>
                            <strong>Least Connections</strong> routes traffic to the
                            least busy server.
                        </li>

                        <li>
                            <strong>IP Hash</strong> uses the client IP to choose the
                            destination server.
                        </li>

                        <li>
                            <strong>Weighted Round Robin</strong> assigns
                            capacity-based weights.
                        </li>

                    </ul>


                    <h2>
                        Horizontal vs Vertical Scaling
                    </h2>

                    <p>
                        Horizontal scaling adds more machines to your server pool.
                        Vertical scaling adds more power to existing machines.
                        Load balancers make horizontal scaling practical.
                    </p>


                    {/* Back to notes */}

                    <button
                        className="link back-to-notes"
                        type="button"
                        onClick={() => navigate("/notes")}
                    >
                        ← Back to Notes
                    </button>

                </article>


                {/* ================= AI CONTEXT ================= */}

                <aside className="panel pad">

                    {/* Summary */}

                    <div className="side-section">

                        <div className="section-title">
                            AI Context
                        </div>

                        <h3>
                            Auto Summary
                        </h3>

                        <p>
                            Load balancing improves reliability by distributing traffic
                            across multiple servers using routing algorithms.
                        </p>

                    </div>


                    {/* Related Concepts */}

                    <div className="side-section">

                        <h3>
                            Related Concepts
                        </h3>

                        <div className="chain">

                            <span>
                                │ DBMS Distributed Systems
                            </span>

                            <span>
                                ├ OS Process Scheduling
                            </span>

                            <span>
                                │ TCP/IP Stack
                            </span>

                        </div>

                    </div>


                    {/* Questions */}

                    <div className="side-section">

                        <h3>
                            Questions to Ask
                        </h3>

                        <p>
                            How does consistent hashing help distributed caches?
                        </p>

                    </div>


                    {/* Version History */}

                    <div className="side-section">

                        <h3>
                            Version History
                        </h3>

                        <p>
                            2h ago - Auto saved
                            <br />
                            Yesterday - Manual save
                            <br />
                            3 days ago - Created
                        </p>

                    </div>


                    {/* Future AI action */}

                    <button
                        className="primary"
                        type="button"
                        onClick={() => navigate("/ai-chat")}
                    >
                        Ask AI about this note
                    </button>

                </aside>

            </div>

        </section>
    );
}

export default NoteDetail;