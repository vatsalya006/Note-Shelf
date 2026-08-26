import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function Notes() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const notes = [
        {
            id: 1,
            type: "note",
            badge: "Note",
            title: "System Design - Load Balancing",
            description:
                "Horizontal scaling, traffic distribution, server pools and load balancing algorithms.",
            tags: ["engineering", "backend", "system-design"],
            connections: 8,
        },
        {
            id: 2,
            type: "video",
            badge: "YouTube",
            title: "CS50 Week 4 - Pointers & Memory",
            description:
                "Memory management, pointers, stack, heap and dynamic allocation.",
            tags: ["cs", "c-lang", "memory"],
            connections: 5,
        },
        {
            id: 3,
            type: "pdf",
            badge: "PDF",
            title: "DBMS Complete Notes",
            description:
                "Normalization, indexing, transactions, SQL and database concepts.",
            tags: ["dbms", "sql", "database"],
            connections: 12,
        },
        {
            id: 4,
            type: "note",
            badge: "Note",
            title: "OS Process Scheduling Algorithms",
            description:
                "CPU scheduling, round robin, priority scheduling and process states.",
            tags: ["os", "algorithms", "scheduling"],
            connections: 6,
        },
        {
            id: 5,
            type: "pdf",
            badge: "PDF",
            title: "Computer Networks - TCP/IP Model",
            description:
                "TCP/IP layers, protocols, packet delivery and network communication.",
            tags: ["networking", "tcp", "protocols"],
            connections: 9,
        },
        {
            id: 6,
            type: "video",
            badge: "YouTube",
            title: "React Hooks Deep Dive - useCallback",
            description:
                "React hooks, rendering behaviour, memoization and useCallback.",
            tags: ["react", "frontend", "javascript"],
            connections: 4,
        },
    ];

    const filteredNotes = useMemo(() => {
        return notes.filter((note) => {
            const matchesFilter =
                filter === "all" || note.type === filter;

            const searchText = search.toLowerCase().trim();

            const matchesSearch =
                searchText === "" ||
                note.title.toLowerCase().includes(searchText) ||
                note.description.toLowerCase().includes(searchText) ||
                note.tags.some((tag) =>
                    tag.toLowerCase().includes(searchText)
                );

            return matchesFilter && matchesSearch;
        });
    }, [search, filter]);

    return (
        <section className="notes-page">

            {/* ================= HEADER ================= */}

            <div className="page-head notes-page-head">

                <div>
                    <h1>
                        All Notes
                        <span className="notes-count">
                            47 knowledge items
                        </span>
                    </h1>

                    <p className="sub">
                        Your personal knowledge shelf — notes, PDFs and YouTube learning.
                    </p>
                </div>

                <button
                    className="primary"
                    type="button"
                    onClick={() => navigate("/notes/new")}
                >
                    + New Note
                </button>

            </div>


            {/* ================= TOOLBAR ================= */}

            <div className="notes-toolbar">

                <div className="notes-search">

                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search notes, tags, or connected concepts..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                </div>


                <div className="notes-filters">

                    <button
                        className={`ghost ${filter === "all" ? "active" : ""}`}
                        onClick={() => setFilter("all")}
                        type="button"
                    >
                        All
                    </button>

                    <button
                        className={`ghost ${filter === "note" ? "active" : ""}`}
                        onClick={() => setFilter("note")}
                        type="button"
                    >
                        Notes
                    </button>

                    <button
                        className={`ghost ${filter === "pdf" ? "active" : ""}`}
                        onClick={() => setFilter("pdf")}
                        type="button"
                    >
                        PDFs
                    </button>

                    <button
                        className={`ghost ${filter === "video" ? "active" : ""}`}
                        onClick={() => setFilter("video")}
                        type="button"
                    >
                        YouTube
                    </button>

                    <button
                        className="ghost"
                        type="button"
                    >
                        Sort
                    </button>

                </div>

            </div>


            {/* ================= NOTES GRID ================= */}

            <div className="notes-grid">

                {filteredNotes.map((note) => (

                    <article
                        className={`note-card ${note.type === "pdf"
                            ? "pdf"
                            : note.type === "video"
                                ? "video"
                                : ""
                            }`}
                        key={note.id}
                    >

                        <div className="note-card-top">

                            <span
                                className={`badge ${note.type === "pdf"
                                    ? "cyan"
                                    : note.type === "video"
                                        ? "red"
                                        : ""
                                    }`}
                            >
                                {note.badge}
                            </span>

                            <button
                                className="note-menu"
                                type="button"
                                aria-label="Note options"
                            >
                                ⋮
                            </button>

                        </div>


                        <h3>
                            {note.title}
                        </h3>


                        <p className="note-description">
                            {note.description}
                        </p>


                        <div className="tags">

                            {note.tags.map((tag) => (
                                <span
                                    className="tag"
                                    key={tag}
                                >
                                    {tag}
                                </span>
                            ))}

                        </div>


                        <div className="note-card-footer">

                            <span>
                                {note.connections} connections
                            </span>

                            <button
                                className="link"
                                type="button"
                                onClick={() => navigate("/notes/1")}
                            >
                                Open →
                            </button>

                        </div>

                    </article>

                ))}

            </div>


            {/* ================= RESULT COUNT ================= */}

            <div className="show-more-container">

                <button
                    className="show-more-button"
                    type="button"
                >
                    <span>
                        Show More
                    </span>

                    <span className="show-more-arrow">
                        ↓
                    </span>
                </button>

                <p className="notes-result-count">
                    Showing{" "}
                    <strong>
                        {filteredNotes.length}
                    </strong>{" "}
                    of 47 knowledge items
                </p>

            </div>

        </section>
    );
}

export default Notes;