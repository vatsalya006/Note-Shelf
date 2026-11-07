import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { apiRequest } from "../api";

export default function KnowledgeGraph() {
    const svgRef = useRef(null);

    const [error, setError] = useState("");
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [loading, setLoading] = useState(true);

    // Relationship colors accessible throughout the component
    const relationshipColors = {
        "builds-on": "#3b82f6",
        contradicts: "#ef4444",
        "same-topic": "#22c55e",
        references: "#a855f7",
    };

    useEffect(() => {
        let cancelled = false;
        let simulation = null;

        async function loadGraph() {
            try {
                setLoading(true);
                setError("");

                const response = await apiRequest("/graph");

                if (cancelled) return;

                const { nodes = [], edges = [] } = response;

                const svg = d3.select(svgRef.current);
                svg.selectAll("*").remove();

                const width = 900;
                const height = 600;

                svg.attr("viewBox", `0 0 ${width} ${height}`);

                const container = svg
                    .append("g")
                    .attr("class", "graph-container");

                // Create force simulation
                simulation = d3
                    .forceSimulation(nodes)
                    .force(
                        "link",
                        d3.forceLink(edges)
                            .id((d) => d.id)
                            .distance(90)
                    )
                    .force("charge", d3.forceManyBody().strength(-120))
                    .force("center", d3.forceCenter(width / 2, height / 2));

                // Create graph edges
                const links = container
                    .append("g")
                    .selectAll("line")
                    .data(edges)
                    .join("line")
                    .attr(
                        "stroke",
                        (d) => relationshipColors[d.relationship] || "#94a3b8"
                    )
                    .attr("stroke-width", (d) => 1 + d.similarity * 2)
                    .attr("stroke-opacity", 0.8)
                    .style("cursor", "pointer")
                    .on("click", (event, d) => {
                        event.stopPropagation();

                        setSelectedEdge({
                            ...d,
                            sourceTitle: d.source.title,
                            targetTitle: d.target.title,
                        });
                    });

                // Create graph nodes
                const nodeGroups = container
                    .append("g")
                    .selectAll("g")
                    .data(nodes)
                    .join("g")
                    .style("cursor", "pointer")
                    .call(
                        d3.drag()
                            .on("start", (event, d) => {
                                if (!event.active) {
                                    simulation.alphaTarget(0.3).restart();
                                }

                                d.fx = d.x;
                                d.fy = d.y;
                            })
                            .on("drag", (event, d) => {
                                d.fx = event.x;
                                d.fy = event.y;
                            })
                            .on("end", (event, d) => {
                                if (!event.active) {
                                    simulation.alphaTarget(0);
                                }

                                d.fx = null;
                                d.fy = null;
                            })
                    );

                // Node circles
                nodeGroups
                    .append("circle")
                    .attr("r", 9)
                    .attr("fill", (d) =>
                        d.type === "pdf"
                            ? "#f59e0b"
                            : d.type === "youtube"
                                ? "#ef4444"
                                : "#3b82f6"
                    )
                    .attr("stroke", "#ffffff")
                    .attr("stroke-width", 1.5);

                // Node labels
                nodeGroups
                    .append("text")
                    .text((d) =>
                        d.title.length > 22
                            ? `${d.title.slice(0, 22)}…`
                            : d.title
                    )
                    .attr("x", 12)
                    .attr("y", 4)
                    .attr("fill", "currentColor")
                    .attr("font-size", 12);

                nodeGroups.append("title").text((d) => d.title);

                // Existing node click functionality
                nodeGroups.on("click", (_, d) => {
                    window.dispatchEvent(
                        new CustomEvent("knowledge-graph-node-click", {
                            detail: d,
                        })
                    );
                });

                // Update positions during simulation
                simulation.on("tick", () => {
                    links
                        .attr("x1", (d) => d.source.x)
                        .attr("y1", (d) => d.source.y)
                        .attr("x2", (d) => d.target.x)
                        .attr("y2", (d) => d.target.y);

                    nodeGroups.attr(
                        "transform",
                        (d) => `translate(${d.x},${d.y})`
                    );
                });

                // Zoom functionality
                svg.call(
                    d3.zoom()
                        .scaleExtent([0.3, 3])
                        .on("zoom", (event) => {
                            container.attr("transform", event.transform);
                        })
                );

            } catch (err) {
                if (!cancelled) {
                    console.error("Knowledge Graph Error:", err);
                    setError(
                        err.message || "Failed to load knowledge graph."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadGraph();

        return () => {
            cancelled = true;

            if (simulation) {
                simulation.stop();
            }

            d3.select(svgRef.current).selectAll("*").remove();
        };
    }, []);

    return (
        <div style={{ width: "100%", overflow: "hidden" }}>

            {/* Loading and error states */}
            {loading && <p>Loading Knowledge Graph...</p>}

            {error && (
                <p style={{ color: "#ef4444" }}>
                    {error}
                </p>
            )}

            {/* Graph legend */}
            <div
                style={{
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                    marginBottom: 12,
                }}
            >
                <span>🔵 Notes</span>
                <span>🟠 PDFs</span>
                <span>🔴 YouTube</span>

                <span style={{ color: "#22c55e" }}>
                    — Same topic
                </span>

                <span style={{ color: "#3b82f6" }}>
                    — Builds on
                </span>

                <span style={{ color: "#ef4444" }}>
                    — Contradicts
                </span>

                <span style={{ color: "#a855f7" }}>
                    — References
                </span>
            </div>

            {/* D3 Graph */}
            <svg
                ref={svgRef}
                style={{
                    width: "100%",
                    minHeight: 450,
                    border: "1px solid #334155",
                    borderRadius: 12,
                }}
            />

            {/* Relationship Details Panel */}
            {selectedEdge && (
                <div
                    style={{
                        marginTop: 16,
                        padding: 20,
                        border: "1px solid #334155",
                        borderRadius: 12,
                        background: "var(--card-bg, transparent)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <h3>Relationship Details</h3>

                        <button
                            onClick={() => setSelectedEdge(null)}
                            style={{
                                cursor: "pointer",
                                padding: "6px 12px",
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    <h4
                        style={{
                            color:
                                relationshipColors[selectedEdge.relationship] ||
                                "#94a3b8",
                            textTransform: "capitalize",
                        }}
                    >
                        {selectedEdge.relationship}
                    </h4>

                    <p>
                        <strong>Note A:</strong>{" "}
                        {selectedEdge.sourceTitle}
                    </p>

                    <p>
                        <strong>Note B:</strong>{" "}
                        {selectedEdge.targetTitle}
                    </p>

                    <p>
                        <strong>Similarity:</strong>{" "}
                        {(selectedEdge.similarity * 100).toFixed(1)}%
                    </p>

                    <hr />

                    <h4>Why are these notes connected?</h4>

                    <p style={{ lineHeight: 1.7 }}>
                        {selectedEdge.reason ||
                            "No explanation available for this connection."}
                    </p>
                </div>
            )}
        </div>
    );
}