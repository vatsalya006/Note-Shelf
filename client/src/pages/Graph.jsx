import { useState } from "react";
import KnowledgeGraph from "../components/KnowledgeGraph";

function Graph() {
    const [search, setSearch] = useState("");
    const [selectedNode, setSelectedNode] = useState(null);

    return (
        <section className="graph-section">
            {/* ================= HEADER ================= */}

            <div className="graph-header">
                <div>
                    <h1>Knowledge Graph</h1>
                    <p>
                        Visualize connections between your notes,
                        concepts, and ideas.
                    </p>
                </div>
                <div className="graph-header-actions">
                    <button
                        className="ghost"
                        type="button"
                        onClick={() => {
                            const graphElement = document.querySelector(".graph-work");

                            if (graphElement?.requestFullscreen) {
                                graphElement.requestFullscreen();
                            }
                        }}
                    >
                        ⛶ Fullscreen
                    </button>
                </div>
            </div>

            {/* ================= GRAPH ================= */}

            <div className="graph-page">
                <div className="graph-work">
                    {/* ===== GRAPH CONTROLS ===== */}

                    <div className="graph-controls">
                        <input
                            className="search"
                            type="search"
                            placeholder="Search nodes..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>

                    {/* ===== REAL GRAPH CANVAS ===== */}

                    <div className="graph-canvas">
                        <KnowledgeGraph
                            search={search}
                            onSelectNode={setSelectedNode}
                        />
                    </div>

                    {/* ===== LEGEND ===== */}

                    <div className="graph-legend">
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

                {/* ================= INSPECTOR ================= */}

                <aside className="inspector">
                    {selectedNode ? (
                        <>
                            <div className="node-icon">⌘</div>

                            <h2>{selectedNode.title || selectedNode.label}</h2>

                            <p className="sub">
                                {selectedNode.type || "Graph node"}
                            </p>

                            <div className="side-section">
                                <div className="section-title">
                                    Node details
                                </div>

                                <p>
                                    {selectedNode.content ||
                                        selectedNode.description ||
                                        "Select a node to explore its details."}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="inspector-empty">
                            <div className="node-icon">⌘</div>

                            <h2>Explore your knowledge</h2>

                            <p className="sub">
                                Select a node in the graph to view its details
                                and explore its connections.
                            </p>
                        </div>
                    )}
                </aside>
            </div>
        </section>
    );
}

export default Graph;