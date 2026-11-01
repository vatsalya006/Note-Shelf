import { useEffect, useState } from "react";
import KnowledgeGraph from "../components/KnowledgeGraph";
import { apiRequest } from "../api";

function Graph() {
    const [search, setSearch] = useState("");
    const [selectedNode, setSelectedNode] = useState(null);
    const [graphData, setGraphData] = useState({
        nodes: [],
        edges: [],
    });

    // Listen for node clicks from KnowledgeGraph
    useEffect(() => {
        const handleNodeClick = (event) => {
            setSelectedNode(event.detail);
        };

        window.addEventListener(
            "knowledge-graph-node-click",
            handleNodeClick
        );

        return () => {
            window.removeEventListener(
                "knowledge-graph-node-click",
                handleNodeClick
            );
        };
    }, []);

    // Fetch actual graph data for the inspector
    useEffect(() => {
        async function loadGraphData() {
            try {
                const data = await apiRequest("/graph");

                setGraphData({
                    nodes: data.nodes || [],
                    edges: data.edges || [],
                });
            } catch (error) {
                console.error("Failed to load graph details:", error);
            }
        }

        loadGraphData();
    }, []);

    // Find nodes directly connected to the selected node
    const getConnectedNodes = () => {
        if (!selectedNode) return [];

        const connectedIds = graphData.edges
            .filter((edge) => {
                const sourceId =
                    typeof edge.source === "object"
                        ? edge.source.id
                        : edge.source;

                const targetId =
                    typeof edge.target === "object"
                        ? edge.target.id
                        : edge.target;

                return (
                    sourceId === selectedNode.id ||
                    targetId === selectedNode.id
                );
            })
            .map((edge) => {
                const sourceId =
                    typeof edge.source === "object"
                        ? edge.source.id
                        : edge.source;

                const targetId =
                    typeof edge.target === "object"
                        ? edge.target.id
                        : edge.target;

                return sourceId === selectedNode.id
                    ? targetId
                    : sourceId;
            });

        return graphData.nodes.filter((node) =>
            connectedIds.includes(node.id)
        );
    };

    const connectedNodes = getConnectedNodes();

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
                            const graphElement =
                                document.querySelector(".graph-work");

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
                {/* ===== GRAPH WORKSPACE ===== */}

                <div className="graph-work">
                    <div className="graph-controls">
                        <input
                            className="search"
                            type="search"
                            placeholder="Search nodes..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    {/* ===== REAL GRAPH CANVAS ===== */}

                    <div className="graph-canvas">
                        <KnowledgeGraph />
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
                    {!selectedNode ? (
                        <div className="inspector-empty">
                            <div className="node-icon">⌘</div>

                            <h2>Explore your knowledge</h2>

                            <p className="sub">
                                Select a node in the graph to view its
                                details and explore its connections.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="node-icon">⌘</div>

                            <h2>
                                {selectedNode.title ||
                                    selectedNode.label ||
                                    "Untitled node"}
                            </h2>

                            <p className="sub">
                                {selectedNode.type || "Knowledge node"}
                            </p>

                            {/* ===== NODE DETAILS ===== */}

                            <div className="side-section">
                                <div className="section-title">
                                    Node details
                                </div>

                                <p>
                                    {selectedNode.content ||
                                        selectedNode.description ||
                                        "No additional description is available for this node."}
                                </p>
                            </div>

                            {/* ===== CONNECTED NOTES ===== */}

                            <div className="side-section">
                                <h3>Connected Notes</h3>

                                {connectedNodes.length > 0 ? (
                                    <div className="chain">
                                        {connectedNodes.map((node) => (
                                            <button
                                                key={node.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedNode(node)
                                                }
                                            >
                                                {node.title ||
                                                    node.label ||
                                                    "Untitled node"}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p>
                                        No direct connections found for
                                        this node yet.
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </aside>
            </div>
        </section>
    );
}

export default Graph;