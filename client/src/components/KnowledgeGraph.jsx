import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { apiRequest } from "../api";

export default function KnowledgeGraph() {
    const svgRef = useRef(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadGraph() {
            try {
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

                const colors = {
                    "builds-on": "#3b82f6",
                    contradicts: "#ef4444",
                    "same-topic": "#22c55e",
                    references: "#a855f7",
                };

                const simulation = d3
                    .forceSimulation(nodes)
                    .force(
                        "link",
                        d3.forceLink(edges)
                            .id((d) => d.id)
                            .distance(90)
                    )
                    .force("charge", d3.forceManyBody().strength(-120))
                    .force("center", d3.forceCenter(width / 2, height / 2));

                const links = container
                    .append("g")
                    .selectAll("line")
                    .data(edges)
                    .join("line")
                    .attr("stroke", (d) => colors[d.relationship] || "#94a3b8")
                    .attr("stroke-width", (d) => 1 + d.similarity * 2);

                const nodeGroups = container
                    .append("g")
                    .selectAll("g")
                    .data(nodes)
                    .join("g")
                    .style("cursor", "pointer")
                    .call(
                        d3.drag()
                            .on("start", (event, d) => {
                                if (!event.active) simulation.alphaTarget(0.3).restart();
                                d.fx = d.x;
                                d.fy = d.y;
                            })
                            .on("drag", (event, d) => {
                                d.fx = event.x;
                                d.fy = event.y;
                            })
                            .on("end", (event, d) => {
                                if (!event.active) simulation.alphaTarget(0);
                                d.fx = null;
                                d.fy = null;
                            })
                    );

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

                nodeGroups.on("click", (_, d) => {
                    window.dispatchEvent(
                        new CustomEvent("knowledge-graph-node-click", {
                            detail: d,
                        })
                    );
                });

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

                svg.call(
                    d3.zoom().scaleExtent([0.3, 3]).on("zoom", (event) => {
                        container.attr("transform", event.transform);
                    })
                );

                return () => simulation.stop();
            } catch (err) {
                if (!cancelled) {
                    console.error("Knowledge Graph Error:", err);
                    setError(err.message || "Failed to load knowledge graph.");
                }
            }
        }

        loadGraph();

        return () => {
            cancelled = true;
            d3.select(svgRef.current).selectAll("*").remove();
        };
    }, []);

    return (
        <div style={{ width: "100%", overflow: "hidden" }}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                <span>🔵 Notes</span>
                <span>🟠 PDFs</span>
                <span>🔴 YouTube</span>
                <span style={{ color: "#22c55e" }}>— Same topic</span>
                <span style={{ color: "#3b82f6" }}>— Builds on</span>
                <span style={{ color: "#ef4444" }}>— Contradicts</span>
                <span style={{ color: "#a855f7" }}>— References</span>
            </div>

            <svg
                ref={svgRef}
                style={{
                    width: "100%",
                    minHeight: 450,
                    border: "1px solid #334155",
                    borderRadius: 12,
                }}
            />
        </div>
    );
}