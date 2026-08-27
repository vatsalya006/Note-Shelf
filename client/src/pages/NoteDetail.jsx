import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function NoteDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [note, setNote] = useState(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link"],
            ["clean"],
        ],
    };

    // =========================
    // FETCH NOTE
    // =========================

    useEffect(() => {
        const fetchNote = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://localhost:3000/api/notes/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch note"
                    );
                }

                setNote(data.note);

                setTitle(data.note.title || "");
                setContent(data.note.content || "");
            } catch (error) {
                console.error("Failed to fetch note:", error);

                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    // =========================
    // SAVE NOTE
    // =========================

    const handleSave = async () => {
        if (!title.trim()) {
            setError("Title is required.");
            return;
        }

        if (
            !content.trim() ||
            content === "<p><br></p>"
        ) {
            setError("Content is required.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/notes/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        title,
                        content,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update note"
                );
            }

            setNote(data.note);

            setTitle(data.note.title || "");
            setContent(data.note.content || "");

            setEditing(false);
        } catch (error) {
            console.error("Failed to update note:", error);

            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // DELETE NOTE
    // =========================

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this note? This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/notes/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete note"
                );
            }

            navigate("/notes");
        } catch (error) {
            console.error("Failed to delete note:", error);

            setError(error.message);
        } finally {
            setDeleting(false);
        }
    };

    // =========================
    // CANCEL EDITING
    // =========================

    const handleCancelEdit = () => {
        setTitle(note.title || "");
        setContent(note.content || "");

        setError("");
        setEditing(false);
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <section className="detail-page">
                <p>Loading note...</p>
            </section>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error && !note) {
        return (
            <section className="detail-page">

                <p className="form-error">
                    {error}
                </p>

                <button
                    className="link back-to-notes"
                    type="button"
                    onClick={() => navigate("/notes")}
                >
                    ← Back to Notes
                </button>

            </section>
        );
    }

    // =========================
    // NOTE DETAIL
    // =========================

    return (
        <section className="detail-page">

            <div className="detail-layout">

                <article className="article">

                    {/* =========================
                        BREADCRUMB
                    ========================= */}

                    <div className="crumbs">
                        Notes / {note?.title}
                    </div>


                    {/* =========================
                        TOP ACTIONS
                    ========================= */}

                    <div className="detail-actions">

                        {!editing ? (
                            <>
                                <button
                                    className="ghost"
                                    type="button"
                                    onClick={() => {
                                        setError("");
                                        setEditing(true);
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    className="danger"
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    {deleting
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="ghost"
                                    type="button"
                                    onClick={handleCancelEdit}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="primary"
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            </>
                        )}

                    </div>


                    {/* =========================
                        ERROR
                    ========================= */}

                    {error && (
                        <p className="form-error">
                            {error}
                        </p>
                    )}


                    {/* =========================
                        TITLE
                    ========================= */}

                    {editing ? (
                        <input
                            className="detail-title-input"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            placeholder="Note title..."
                        />
                    ) : (
                        <h1>
                            {note?.title}
                        </h1>
                    )}


                    {/* =========================
                        TYPE
                    ========================= */}

                    <div className="tags">

                        <span className="tag">
                            Note
                        </span>

                    </div>


                    {/* =========================
                        CONTENT
                    ========================= */}

                    {editing ? (

                        <div className="detail-editor">

                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={modules}
                                placeholder="Write your note here..."
                            />

                        </div>

                    ) : (

                        <div
                            className="note-content"
                            dangerouslySetInnerHTML={{
                                __html:
                                    note?.content ||
                                    "<p>No content</p>",
                            }}
                        />

                    )}


                    {/* =========================
                        BACK TO NOTES
                    ========================= */}

                    <button
                        className="link back-to-notes"
                        type="button"
                        onClick={() => navigate("/notes")}
                    >
                        ← Back to Notes
                    </button>

                </article>

            </div>

        </section>
    );
}

export default NoteDetail;