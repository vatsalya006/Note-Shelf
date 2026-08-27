import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Upload() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

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

                const pdfs = (data.notes || [])
                    .filter((item) => item.type === "pdf")
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt || 0) -
                            new Date(a.createdAt || 0)
                    );

                setRecentUploads(pdfs);
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

            // =========================
            // SUCCESS
            // =========================

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
                    <h1>Upload Documents</h1>

                    <p className="sub">
                        Add PDF documents to your knowledge base.
                    </p>
                </div>
            </div>


            {/* ================= UPLOAD CARD ================= */}

            <div className="upload-main-card">

                <div className="upload-drop-zone">

                    <div className="upload-cloud-icon">
                        ☁
                    </div>

                    <h2>
                        Drop your PDF here or{" "}
                        <span
                            onClick={openFilePicker}
                            style={{ cursor: "pointer" }}
                        >
                            click to browse
                        </span>
                    </h2>

                    <p>
                        PDF files only • Maximum file size: 10MB
                    </p>


                    {/* ================= FILE INPUT ================= */}

                    <label className="upload-browse-button">

                        <span>
                            ↥
                        </span>

                        Browse Files

                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                        />

                    </label>


                    {/* ================= SELECTED FILE ================= */}

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


                    {/* ================= ERROR ================= */}

                    {error && (
                        <p className="form-error">
                            {error}
                        </p>
                    )}


                    {/* ================= SUCCESS ================= */}

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


                    {/* ================= UPLOAD BUTTON ================= */}

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


            {/* ================= RECENT UPLOADS ================= */}

            <div className="recent-upload-panel">

                <div className="recent-upload-header">

                    <div>

                        <div className="section-title">
                            Recent Uploads
                        </div>

                        <p className="sub">
                            Your recently added PDF documents.
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
                                <p>Loading uploads...</p>
                            </div>

                        </div>
                    )}


                    {!loadingUploads &&
                        recentUploads.length === 0 && (
                            <div className="recent-upload-item">

                                <div className="recent-file-icon pdf-icon">
                                    PDF
                                </div>

                                <div className="recent-file-info">

                                    <h3>
                                        No PDF uploads yet
                                    </h3>

                                    <p>
                                        Upload a PDF to get started
                                    </p>

                                </div>

                                <span className="upload-status">
                                    Ready
                                </span>

                            </div>
                        )}


                    {!loadingUploads &&
                        recentUploads.map((file) => (
                            <div
                                className="recent-upload-item"
                                key={file._id}
                            >

                                <div className="recent-file-icon pdf-icon">
                                    PDF
                                </div>


                                <div className="recent-file-info">

                                    <h3>
                                        {file.originalName ||
                                            file.title}
                                    </h3>

                                    <p>
                                        {formatFileSize(
                                            file.fileSize
                                        )}
                                    </p>

                                </div>


                                <span className="upload-status">
                                    Uploaded
                                </span>


                                <button
                                    className="upload-more"
                                    type="button"
                                    aria-label="Open PDF"
                                    onClick={() =>
                                        navigate(
                                            `/notes/${file._id}`
                                        )
                                    }
                                >
                                    →
                                </button>

                            </div>
                        ))}

                </div>

            </div>


            {/* ================= INFO BAR ================= */}

            <div className="upload-info-bar">

                <div className="upload-info-item">

                    <div className="upload-info-icon">
                        ✓
                    </div>

                    <div>
                        <strong>
                            Secure & Private
                        </strong>

                        <span>
                            Your files stay protected.
                        </span>
                    </div>

                </div>


                <div className="upload-info-item">

                    <div className="upload-info-icon">
                        ✦
                    </div>

                    <div>
                        <strong>
                            Smart Processing
                        </strong>

                        <span>
                            AI will analyze your content.
                        </span>
                    </div>

                </div>


                <div className="upload-info-item">

                    <div className="upload-info-icon">
                        ⌘
                    </div>

                    <div>
                        <strong>
                            Build Connections
                        </strong>

                        <span>
                            Link ideas across your knowledge.
                        </span>
                    </div>

                </div>

            </div>

        </section>
    );
}

export default Upload;