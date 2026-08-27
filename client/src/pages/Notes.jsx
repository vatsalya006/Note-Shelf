import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function getPlainText(html) {
    if (!html) return "";

    const temp = document.createElement("div");
    temp.innerHTML = html;

    return (temp.textContent || temp.innerText || "")
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function Notes() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:3000/api/notes",
                    {
                        method: "GET",
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
                setError(error.message || "Failed to fetch notes");
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    const filteredNotes = useMemo(() => {
        const searchText = search.toLowerCase().trim();

        return notes.filter((note) => {
            // Filter by type
            const matchesFilter =
                filter === "all" ||
                note.type === filter ||
                (filter === "note" && !note.type);

            // Convert HTML content to normal text
            const plainContent = getPlainText(note.content);

            // Search title + content
            const matchesSearch =
                searchText === "" ||
                (note.title || "")
                    .toLowerCase()
                    .includes(searchText) ||
                plainContent
                    .toLowerCase()
                    .includes(searchText);

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
                        Your personal knowledge shelf — notes, PDFs and
                        YouTube learning.
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
                        className={`ghost ${filter === "all" ? "active" : ""
                            }`}
                        onClick={() => setFilter("all")}
                        type="button"
                    >
                        All
                    </button>


                    <button
                        className={`ghost ${filter === "note" ? "active" : ""
                            }`}
                        onClick={() => setFilter("note")}
                        type="button"
                    >
                        Notes
                    </button>


                    <button
                        className="ghost"
                        type="button"
                        disabled
                    >
                        PDFs
                    </button>


                    <button
                        className="ghost"
                        type="button"
                        disabled
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


            {/* ================= LOADING ================= */}

            {loading && (
                <p>Loading notes...</p>
            )}


            {/* ================= ERROR ================= */}

            {!loading && error && (
                <p className="form-error">
                    {error}
                </p>
            )}


            {/* ================= NOTES GRID ================= */}

            {!loading && !error && filteredNotes.length > 0 && (

                <div className="notes-grid">

                    {filteredNotes.map((note) => {

                        const description =
                            getPlainText(note.content) ||
                            "No content";

                        return (

                            <article
                                className="note-card"
                                key={note._id}
                            >

                                {/* CARD TOP */}

                                <div className="note-card-top">

                                    <span className="badge">
                                        Note
                                    </span>

                                    <button
                                        className="note-menu"
                                        type="button"
                                        aria-label="Note options"
                                    >
                                        ⋮
                                    </button>

                                </div>


                                {/* TITLE */}

                                <h3>
                                    {note.title || "Untitled Note"}
                                </h3>


                                {/* DESCRIPTION */}

                                <p className="note-description">
                                    {description}
                                </p>


                                {/* TAG */}

                                <div className="tags">

                                    <span className="tag">
                                        note
                                    </span>

                                </div>


                                {/* FOOTER */}

                                <div className="note-card-footer">

                                    <span>
                                        0 connections
                                    </span>

                                    <button
                                        className="link"
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/notes/${note._id}`
                                            )
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
                        {search
                            ? "No notes match your search."
                            : "No notes found."}
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
                        </strong>

                        {" "}of{" "}

                        {notes.length}

                        {" "}knowledge items

                    </p>

                </div>

            )}

        </section>
    );
}

export default Notes;