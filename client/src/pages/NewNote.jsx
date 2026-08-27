import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function NewNote() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title.trim() || !content.trim() || content === "<p><br></p>") {
            setError("Title and content are required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:3000/api/notes",
                {
                    method: "POST",
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
                    data.message || "Failed to create note"
                );
            }

            navigate("/notes");

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="new-note-page">

            <div className="page-head notes-page-head">

                <div>
                    <h1>Create New Note</h1>

                    <p className="sub">
                        Add something new to your personal knowledge shelf.
                    </p>
                </div>

                <div className="new-note-actions">

                    <button
                        type="button"
                        className="ghost"
                        onClick={() => navigate("/notes")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        form="new-note-form"
                        className="primary"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Note"}
                    </button>

                </div>

            </div>

            <form
                id="new-note-form"
                className="new-note-form"
                onSubmit={handleSubmit}
            >

                {error && (
                    <p className="form-error">
                        {error}
                    </p>
                )}

                {/* TITLE */}

                <label className="field">
                    Title

                    <input
                        type="text"
                        placeholder="Enter note title..."
                        value={title}
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                    />
                </label>

                {/* EDITOR */}

                <div className="field">

                    <label>
                        Content
                    </label>

                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        placeholder="Write your note here..."
                    />

                </div>

            </form>

        </section>
    );
}

export default NewNote;