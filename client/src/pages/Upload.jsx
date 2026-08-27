import { useRef, useState } from "react";

function Upload() {
    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

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

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

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

            const data = await response.json();

            console.log("PDF upload response:", data);

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to upload PDF"
                );
            }

            setMessage("PDF uploaded successfully!");

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

    return (
        <section className="upload-page">

            {/* ================= HEADER ================= */}

            <div className="page-head upload-page-head">

                <div>
                    <h1>Upload Documents</h1>

                    <p className="sub">
                        Add documents to your knowledge base and build intelligent
                        connections.
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
                        Drop files here or{" "}
                        <span
                            onClick={openFilePicker}
                            style={{ cursor: "pointer" }}
                        >
                            click to browse
                        </span>
                    </h2>

                    <p>
                        Upload PDF files up to 10MB.
                    </p>


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
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </span>

                        </div>
                    )}


                    {/* ================= MESSAGES ================= */}

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


                    <div className="upload-divider">
                        <span>or</span>
                    </div>


                    {/* ================= SOURCE BUTTONS ================= */}

                    <div className="upload-sources">

                        <button
                            className="upload-source"
                            type="button"
                            onClick={openFilePicker}
                        >
                            <span className="source-icon pdf-icon">
                                PDF
                            </span>

                            PDF Files
                        </button>


                        <button
                            className="upload-source"
                            type="button"
                            disabled
                        >
                            <span className="source-icon doc-icon">
                                W
                            </span>

                            Word Documents
                        </button>


                        <button
                            className="upload-source"
                            type="button"
                            disabled
                        >
                            <span className="source-icon text-icon">
                                TXT
                            </span>

                            Text Files
                        </button>


                        <button
                            className="upload-source"
                            type="button"
                            disabled
                        >
                            <span className="source-icon csv-icon">
                                CSV
                            </span>

                            CSV Files
                        </button>

                    </div>

                </div>

            </div>


            {/* ================= SUPPORTED TYPES ================= */}

            <div className="upload-section-heading">

                <div>

                    <div className="section-title">
                        Supported File Types
                    </div>

                    <p className="sub">
                        Upload the formats you use for your personal knowledge base.
                    </p>

                </div>

            </div>


            <div className="file-type-grid">

                <div className="file-type-card">

                    <div className="file-type-icon pdf-icon">
                        PDF
                    </div>

                    <div>
                        <h3>PDF Files</h3>
                        <p>Available now</p>
                        <span>.pdf</span>
                    </div>

                </div>


                <div className="file-type-card">

                    <div className="file-type-icon doc-icon">
                        W
                    </div>

                    <div>
                        <h3>Word Documents</h3>
                        <p>Coming soon</p>
                        <span>.docx, .doc</span>
                    </div>

                </div>


                <div className="file-type-card">

                    <div className="file-type-icon text-icon">
                        TXT
                    </div>

                    <div>
                        <h3>Text Files</h3>
                        <p>Coming soon</p>
                        <span>.txt, .md</span>
                    </div>

                </div>


                <div className="file-type-card">

                    <div className="file-type-icon csv-icon">
                        CSV
                    </div>

                    <div>
                        <h3>CSV Files</h3>
                        <p>Coming soon</p>
                        <span>.csv</span>
                    </div>

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
                            Your recently added documents.
                        </p>

                    </div>

                    <button
                        className="ghost"
                        type="button"
                    >
                        View All
                    </button>

                </div>


                <div className="recent-upload-list">

                    <div className="recent-upload-item">

                        <div className="recent-file-icon pdf-icon">
                            PDF
                        </div>

                        <div className="recent-file-info">

                            <h3>
                                PDF uploads will appear here
                            </h3>

                            <p>
                                Upload a PDF to get started
                            </p>

                        </div>

                        <span className="upload-status">
                            Ready
                        </span>

                        <button
                            className="upload-more"
                            type="button"
                            aria-label="More options"
                        >
                            ⋮
                        </button>

                    </div>

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