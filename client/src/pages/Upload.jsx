import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Upload() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [youtubeTitle, setYoutubeTitle] = useState("");
    const [savingYoutube, setSavingYoutube] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [recentUploads, setRecentUploads] = useState([]);
    const [loadingUploads, setLoadingUploads] = useState(true);

    // =========================
    // FETCH RECENT UPLOADS
    // =========================

    useEffect(() => {
        const fetchRecentUploads = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setLoadingUploads(false);
                    return;
                }

                const response = await fetch(
                    "http://localhost:3000/api/notes",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch uploads"
                    );
                }

                const uploads = (data.notes || [])
                    .filter(
                        (item) =>
                            item.type === "pdf" ||
                            item.type === "youtube"
                    )
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt || 0) -
                            new Date(a.createdAt || 0)
                    );

                setRecentUploads(uploads);
            } catch (error) {
                console.error(
                    "Failed to fetch recent uploads:",
                    error
                );
            } finally {
                setLoadingUploads(false);
            }
        };

        fetchRecentUploads();
    }, []);

    // =========================
    // FILE CHANGE
    // =========================

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        setMessage("");
        setError("");

        if (!file) {
            setSelectedFile(null);
            return;
        }

        if (file.type !== "application/pdf") {
            setSelectedFile(null);
            setError("Please select a PDF file.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setSelectedFile(null);
            setError("PDF must be smaller than 10MB.");
            return;
        }

        setSelectedFile(file);
    };

    // =========================
    // OPEN FILE PICKER
    // =========================

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    // =========================
    // UPLOAD PDF
    // =========================

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Please select a PDF file first.");
            return;
        }

        try {
            setUploading(true);
            setMessage("");
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("You are not logged in.");
            }

            const formData = new FormData();

            formData.append("pdf", selectedFile);

            const response = await fetch(
                "http://localhost:3000/api/upload/pdf",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const contentType =
                response.headers.get("content-type") || "";

            let data;

            if (contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();

                throw new Error(
                    `Server returned an invalid response: ${text.slice(
                        0,
                        100
                    )}`
                );
            }

            console.log("PDF upload response:", data);

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to upload PDF"
                );
            }

            setMessage("PDF uploaded successfully!");

            if (data.note) {
                setRecentUploads((previous) => [
                    data.note,
                    ...previous,
                ]);
            }

            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("PDF upload error:", error);
            setError(error.message);
        } finally {
            setUploading(false);
        }
    };

    // =========================
    // SAVE YOUTUBE URL
    // =========================

    const handleYoutubeSave = async () => {
        setMessage("");
        setError("");

        if (!youtubeTitle.trim()) {
            setError("Please enter a title for the YouTube video.");
            return;
        }

        if (!youtubeUrl.trim()) {
            setError("Please enter a YouTube URL.");
            return;
        }

        if (
            !youtubeUrl.includes("youtube.com") &&
            !youtubeUrl.includes("youtu.be")
        ) {
            setError("Please enter a valid YouTube URL.");
            return;
        }

        try {
            setSavingYoutube(true);

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("You are not logged in.");
            }

            const response = await fetch(
                "http://localhost:3000/api/youtube",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: youtubeTitle.trim(),
                        youtubeUrl: youtubeUrl.trim(),
                    }),
                }
            );

            const data = await response.json();

            console.log("YouTube save response:", data);

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save YouTube video"
                );
            }

            setMessage("YouTube video saved successfully!");

            if (data.note) {
                setRecentUploads((previous) => [
                    data.note,
                    ...previous,
                ]);
            }

            setYoutubeTitle("");
            setYoutubeUrl("");
        } catch (error) {
            console.error(
                "YouTube save error:",
                error
            );

            setError(error.message);
        } finally {
            setSavingYoutube(false);
        }
    };

    // =========================
    // FORMAT FILE SIZE
    // =========================

    const formatFileSize = (bytes) => {
        if (!bytes) return "Unknown size";

        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    // =========================
    // RETURN
    // =========================

    return (
        <section className="upload-page">

            {/* ================= HEADER ================= */}

            <div className="page-head upload-page-head">
                <div>
                    <h1>Add to Knowledge Base</h1>

                    <p className="sub">
                        Add PDFs or YouTube videos to your knowledge shelf.
                    </p>
                </div>
            </div>


            {/* ================= PDF UPLOAD ================= */}

            <div className="upload-main-card">

                <div className="upload-drop-zone">

                    <div className="upload-cloud-icon">
                        ☁
                    </div>

                    <h2>
                        Add a PDF document
                    </h2>

                    <p>
                        PDF files only • Maximum file size: 10MB
                    </p>

                    <label className="upload-browse-button">

                        <span>
                            ↥
                        </span>

                        Browse PDF

                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                        />

                    </label>


                    {/* SELECTED PDF */}

                    {selectedFile && (
                        <div className="selected-file">

                            Selected:{" "}

                            <strong>
                                {selectedFile.name}
                            </strong>

                            <br />

                            <span>
                                {formatFileSize(selectedFile.size)}
                            </span>

                        </div>
                    )}


                    {/* PDF UPLOAD BUTTON */}

                    {selectedFile && (
                        <button
                            className="primary"
                            type="button"
                            onClick={handleUpload}
                            disabled={uploading}
                            style={{
                                marginTop: "20px",
                            }}
                        >
                            {uploading
                                ? "Uploading..."
                                : "Upload PDF"}
                        </button>
                    )}

                </div>

            </div>


            {/* ================= YOUTUBE ================= */}

            <div
                className="upload-main-card"
                style={{
                    marginTop: "24px",
                }}
            >

                <div
                    className="upload-drop-zone"
                    style={{
                        padding: "36px",
                    }}
                >

                    <div className="upload-cloud-icon">
                        ▶
                    </div>

                    <h2>
                        Save a YouTube video
                    </h2>

                    <p>
                        Save the video URL now. AI summary will be added later.
                    </p>


                    {/* TITLE */}

                    <input
                        className="youtube-input"
                        type="text"
                        placeholder="Video title"
                        value={youtubeTitle}
                        onChange={(event) =>
                            setYoutubeTitle(event.target.value)
                        }
                    />


                    {/* YOUTUBE URL */}

                    <input
                        className="youtube-input"
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={youtubeUrl}
                        onChange={(event) =>
                            setYoutubeUrl(event.target.value)
                        }
                    />


                    {/* SAVE BUTTON */}

                    <button
                        className="primary"
                        type="button"
                        onClick={handleYoutubeSave}
                        disabled={savingYoutube}
                        style={{
                            marginTop: "20px",
                        }}
                    >
                        {savingYoutube
                            ? "Saving..."
                            : "Save YouTube Video"}
                    </button>

                </div>

            </div>


            {/* ================= MESSAGE ================= */}

            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}

            {message && (
                <p
                    style={{
                        marginTop: "16px",
                        color: "#8b5cf6",
                        fontWeight: "600",
                    }}
                >
                    {message}
                </p>
            )}


            {/* ================= RECENT UPLOADS ================= */}

            <div className="recent-upload-panel">

                <div className="recent-upload-header">

                    <div>

                        <div className="section-title">
                            Recent Additions
                        </div>

                        <p className="sub">
                            Your recently added PDFs and YouTube videos.
                        </p>

                    </div>

                    <button
                        className="ghost"
                        type="button"
                        onClick={() => navigate("/notes")}
                    >
                        View All
                    </button>

                </div>


                <div className="recent-upload-list">

                    {loadingUploads && (
                        <div className="recent-upload-item">

                            <div className="recent-file-info">
                                <p>Loading...</p>
                            </div>

                        </div>
                    )}


                    {!loadingUploads &&
                        recentUploads.length === 0 && (
                            <div className="recent-upload-item">

                                <div className="recent-file-info">

                                    <h3>
                                        Nothing added yet
                                    </h3>

                                    <p>
                                        Add a PDF or YouTube video to get started.
                                    </p>

                                </div>

                            </div>
                        )}


                    {!loadingUploads &&
                        recentUploads.map((item) => (
                            <div
                                className="recent-upload-item"
                                key={item._id}
                            >

                                <div
                                    className={`recent-file-icon ${item.type === "pdf"
                                        ? "pdf-icon"
                                        : "youtube-icon"
                                        }`}
                                >
                                    {item.type === "pdf"
                                        ? "PDF"
                                        : "YT"}
                                </div>


                                <div className="recent-file-info">

                                    <h3>
                                        {item.type === "pdf"
                                            ? item.originalName ||
                                            item.title
                                            : item.title}
                                    </h3>

                                    <p>
                                        {item.type === "pdf"
                                            ? formatFileSize(
                                                item.fileSize
                                            )
                                            : "YouTube video"}
                                    </p>

                                </div>


                                <span className="upload-status">
                                    {item.type === "pdf"
                                        ? "PDF"
                                        : "YouTube"}
                                </span>


                                <button
                                    className="upload-more"
                                    type="button"
                                    aria-label="Open item"
                                    onClick={() =>
                                        navigate(
                                            `/notes/${item._id}`
                                        )
                                    }
                                >
                                    →
                                </button>

                            </div>
                        ))}

                </div>

            </div>


            {/* ================= SIMPLE INFO ================= */}

            <div className="upload-info-bar">

                <div className="upload-info-item">

                    <div className="upload-info-icon">
                        ✓
                    </div>

                    <div>
                        <strong>
                            PDF
                        </strong>

                        <span>
                            Upload PDF documents up to 10MB.
                        </span>
                    </div>

                </div>


                <div className="upload-info-item">

                    <div className="upload-info-icon">
                        ▶
                    </div>

                    <div>
                        <strong>
                            YouTube
                        </strong>

                        <span>
                            Save YouTube links for your knowledge base.
                        </span>
                    </div>

                </div>

            </div>

        </section>
    );
}

export default Upload;