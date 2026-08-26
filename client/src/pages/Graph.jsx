import { useState } from "react";

function Graph() {
    const [search, setSearch] = useState("");
    const [selectedNode, setSelectedNode] = useState("System Design");

    const nodes = [
        {
            id: "system",
            label: "System Design",
            x: 390,
            y: 320,
            r: 48,
            color: "#7c3cff",
            textColor: "#ffffff",
            main: true,
        },
        {
            id: "dbms",
            label: "DBMS",
            x: 300,
            y: 175,
            r: 34,
            color: "#16c8e8",
            textColor: "#16c8e8",
        },
        {
            id: "networking",
            label: "Networking",
            x: 560,
            y: 215,
            r: 36,
            color: "#9b68ff",
            textColor: "#a875ff",
        },
        {
            id: "os",
            label: "OS",
            x: 260,
            y: 455,
            r: 34,
            color: "#287cff",
            textColor: "#5ca1ff",
        },
        {
            id: "algorithms",
            label: "Algorithms",
            x: 455,
            y: 520,
            r: 34,
            color: "#00d99a",
            textColor: "#00d99a",
        },
        {
            id: "scaling",
            label: "Scaling",
            x: 625,
            y: 420,
            r: 34,
            color: "#ffb020",
            textColor: "#ffb020",
        },
        {
            id: "memory",
            label: "Memory",
            x: 185,
            y: 300,
            r: 34,
            color: "#ff4d5e",
            textColor: "#ff6674",
        },
        {
            id: "tcp",
            label: "TCP/IP",
            x: 220,
            y: 460,
            r: 32,
            color: "#9b68ff",
            textColor: "#a875ff",
        },
    ];

    const selected =
        nodes.find((node) => node.label === selectedNode) ||
        nodes[0];

    const visibleNodes = nodes.filter((node) =>
        node.label
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const isVisible = (label) =>
        search.trim() === "" ||
        visibleNodes.some((node) => node.label === label);

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

                    <button className="ghost" type="button">
                        ⛶ Fullscreen
                    </button>

                    <button className="ghost" type="button">
                        ⇩ Export Graph
                    </button>

                </div>

            </div>


            {/* ================= GRAPH ================= */}

            <div className="graph-page">

                {/* ===== GRAPH WORKSPACE ===== */}

                <div className="graph-work">

                    <div className="graph-toolbar">

                        <input
                            className="search"
                            placeholder="Search nodes..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />


                        <div>

                            <button
                                className="ghost active"
                                type="button"
                            >
                                All
                            </button>

                            <button
                                className="ghost"
                                type="button"
                            >
                                Notes
                            </button>

                            <button
                                className="ghost"
                                type="button"
                            >
                                PDFs
                            </button>

                            <button
                                className="ghost"
                                type="button"
                            >
                                YouTube
                            </button>

                            <button
                                className="ghost"
                                type="button"
                            >
                                Find Path
                            </button>

                        </div>

                    </div>


                    {/* ===== SVG CANVAS ===== */}

                    <div className="graph-canvas">

                        <svg
                            viewBox="0 0 820 650"
                            aria-label="Knowledge graph"
                        >

                            {/* Connections */}

                            <g
                                stroke="#202033"
                                strokeWidth="1.4"
                                fill="none"
                            >

                                <line
                                    x1="390"
                                    y1="320"
                                    x2="300"
                                    y2="175"
                                />

                                <line
                                    x1="390"
                                    y1="320"
                                    x2="560"
                                    y2="215"
                                />

                                <line
                                    x1="390"
                                    y1="320"
                                    x2="260"
                                    y2="455"
                                />

                                <line
                                    x1="390"
                                    y1="320"
                                    x2="455"
                                    y2="520"
                                />

                                <line
                                    x1="560"
                                    y1="215"
                                    x2="625"
                                    y2="420"
                                />

                                <line
                                    x1="300"
                                    y1="175"
                                    x2="185"
                                    y2="300"
                                />

                                <line
                                    x1="185"
                                    y1="300"
                                    x2="220"
                                    y2="460"
                                />

                            </g>


                            {/* Strong connections */}

                            <g
                                stroke="#7c3cff"
                                strokeWidth="2.5"
                                fill="none"
                            >

                                <line
                                    x1="390"
                                    y1="320"
                                    x2="300"
                                    y2="175"
                                />

                                <line
                                    x1="390"
                                    y1="320"
                                    x2="260"
                                    y2="455"
                                />

                            </g>


                            {/* Nodes */}

                            {nodes.map((node) => {

                                const visible = isVisible(node.label);

                                const isSelected =
                                    selectedNode === node.label;

                                return (
                                    <g
                                        key={node.id}
                                        onClick={() =>
                                            setSelectedNode(node.label)
                                        }
                                        style={{
                                            cursor: "pointer",
                                            opacity: visible ? 1 : 0.18,
                                        }}
                                    >

                                        <circle
                                            cx={node.x}
                                            cy={node.y}
                                            r={node.r}
                                            fill={
                                                node.main
                                                    ? node.color
                                                    : "#11121c"
                                            }
                                            stroke={node.color}
                                            strokeWidth={
                                                isSelected ? 3 : 2
                                            }
                                        />


                                        <text
                                            x={node.x}
                                            y={
                                                node.main
                                                    ? node.y - 5
                                                    : node.y + 4
                                            }
                                            textAnchor="middle"
                                            fill={
                                                node.main
                                                    ? "#ffffff"
                                                    : node.textColor
                                            }
                                            fontSize={
                                                node.main ? 14 : 11
                                            }
                                            fontWeight="800"
                                        >
                                            {node.main ? (
                                                <>
                                                    <tspan
                                                        x={node.x}
                                                        dy="0"
                                                    >
                                                        System
                                                    </tspan>

                                                    <tspan
                                                        x={node.x}
                                                        dy="18"
                                                    >
                                                        Design
                                                    </tspan>
                                                </>
                                            ) : (
                                                node.label
                                            )}
                                        </text>

                                    </g>
                                );
                            })}

                        </svg>

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

                    <div className="node-icon">
                        ⌘
                    </div>


                    <h2>
                        {selected.label}
                    </h2>

                    <p className="sub">
                        Selected concept
                    </p>


                    <div className="side-section">

                        <div className="section-title">
                            Overview
                        </div>

                        <div className="metric-grid">

                            <div className="metric">

                                <b>12</b>

                                <span>
                                    Notes
                                </span>

                            </div>


                            <div className="metric">

                                <b>6</b>

                                <span>
                                    Connections
                                </span>

                            </div>


                            <div className="metric">

                                <b>92%</b>

                                <span>
                                    Health
                                </span>

                            </div>


                            <div className="metric">

                                <b>Today</b>

                                <span>
                                    Updated
                                </span>

                            </div>

                        </div>

                    </div>


                    <div className="side-section">

                        <h3>
                            Related Concepts
                        </h3>

                        <div className="chain">

                            {nodes
                                .filter(
                                    (node) =>
                                        node.label !== selected.label
                                )
                                .slice(0, 5)
                                .map((node) => (

                                    <span
                                        key={node.id}
                                        onClick={() =>
                                            setSelectedNode(node.label)
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        {node.label}
                                    </span>

                                ))}

                        </div>

                    </div>


                    <div className="side-section">

                        <h3>
                            About this concept
                        </h3>

                        <p>
                            This concept is connected to related
                            topics across your saved knowledge base.
                            Explore the graph to discover stronger
                            relationships.
                        </p>

                    </div>

                </aside>

            </div>

        </section>
    );
}

export default Graph;