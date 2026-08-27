import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function getPlainText(html) {
    if (!html) return "";

    const temp = document.createElement("div");
    temp.innerHTML = html;

    return temp.textContent
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function Notes() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [error, setError] = useState("");

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:3000/api/notes",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                console.log("Notes API response:", data);

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch notes"
                    );
                }

                setNotes(data.notes || []);
            } catch (error) {
                console.error("Failed to fetch notes:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    const filteredNotes = useMemo(() => {
        return notes.filter((note) => {
            const matchesFilter =
                filter === "all" || note.type === filter;

            const searchText = search.toLowerCase().trim();

            const plainContent = getPlainText(note.content);

            const matchesSearch =
                searchText === "" ||
                note.title?.toLowerCase().includes(searchText) ||
                plainContent.toLowerCase().includes(searchText);

            return matchesFilter && matchesSearch;
        });
    }, [notes, search, filter]);

    return (
        <section className="notes-page">

            {/* ================= HEADER ================= */}

            <div className="page-head notes-page-head">

                <div>
                    <h1>
                        All Notes

                        <span className="notes-count">
                            {notes.length} knowledge items
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
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
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
                        className={`ghost ${filter === "youtube" ? "active" : ""}`}
                        onClick={() => setFilter("youtube")}
                        type="button"
                    >
                        YouTube
                    </button>

                </div>

            </div>


            {/* ================= LOADING ================= */}

            {loading && (
                <p>Loading knowledge items...</p>
            )}


            {/* ================= ERROR ================= */}

            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}


            {/* ================= NOTES GRID ================= */}

            {!loading && !error && (
                <div className="notes-grid">

                    {filteredNotes.map((item) => {

                        const description =
                            getPlainText(item.content) ||
                            (
                                item.type === "pdf"
                                    ? "PDF document"
                                    : item.type === "youtube"
                                        ? "YouTube learning"
                                        : "No content"
                            );

                        const itemType =
                            item.type === "pdf"
                                ? "PDF"
                                : item.type === "youtube"
                                    ? "YouTube"
                                    : "Note";

                        return (
                            <article
                                className="note-card"
                                key={item._id}
                            >

                                <div className="note-card-top">

                                    <span className="badge">
                                        {itemType}
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
                                    {item.title}
                                </h3>


                                <p className="note-description">
                                    {description}
                                </p>


                                <div className="tags">

                                    <span className="tag">
                                        {item.type}
                                    </span>

                                </div>


                                <div className="note-card-footer">

                                    <span>
                                        0 connections
                                    </span>

                                    <button
                                        className="link"
                                        type="button"
                                        onClick={() =>
                                            navigate(`/notes/${item._id}`)
                                        }
                                    >
                                        Open →
                                    </button>

                                </div>

                            </article>
                        );
                    })}

                </div>
            )}


            {/* ================= EMPTY STATE ================= */}

            {!loading &&
                !error &&
                filteredNotes.length === 0 && (
                    <p>
                        No {filter === "all" ? "knowledge items" : filter} found.
                    </p>
                )}


            {/* ================= RESULT COUNT ================= */}

            {!loading && !error && (
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
                        of {notes.length} knowledge items
                    </p>

                </div>
            )}

        </section>
    );
}

export default Notes;