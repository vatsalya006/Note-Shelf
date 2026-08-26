import { useRef, useState } from "react";

function Upload() {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedFile(file);
        }
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
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
                        <span onClick={openFilePicker}>
                            click to browse
                        </span>
                    </h2>

                    <p>
                        Upload PDFs, documents, and text files up to 50MB.
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
                            accept=".pdf,.doc,.docx,.txt,.md,.csv"
                            onChange={handleFileChange}
                        />

                    </label>


                    {selectedFile && (
                        <div className="selected-file">
                            Selected: <strong>{selectedFile.name}</strong>
                        </div>
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
                            onClick={openFilePicker}
                        >
                            <span className="source-icon doc-icon">
                                W
                            </span>

                            Word Documents
                        </button>


                        <button
                            className="upload-source"
                            type="button"
                            onClick={openFilePicker}
                        >
                            <span className="source-icon text-icon">
                                TXT
                            </span>

                            Text Files
                        </button>


                        <button
                            className="upload-source"
                            type="button"
                            onClick={openFilePicker}
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
                        <p>Best for documents</p>
                        <span>.pdf</span>
                    </div>

                </div>


                <div className="file-type-card">

                    <div className="file-type-icon doc-icon">
                        W
                    </div>

                    <div>
                        <h3>Word Documents</h3>
                        <p>Editable documents</p>
                        <span>.docx, .doc</span>
                    </div>

                </div>


                <div className="file-type-card">

                    <div className="file-type-icon text-icon">
                        TXT
                    </div>

                    <div>
                        <h3>Text Files</h3>
                        <p>Plain text notes</p>
                        <span>.txt, .md</span>
                    </div>

                </div>


                <div className="file-type-card">

                    <div className="file-type-icon csv-icon">
                        CSV
                    </div>

                    <div>
                        <h3>CSV Files</h3>
                        <p>Structured data</p>
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
                                DBMS Complete Notes.pdf
                            </h3>

                            <p>
                                2.1 MB · Uploaded today
                            </p>

                        </div>

                        <span className="upload-status">
                            Processed
                        </span>

                        <button
                            className="upload-more"
                            type="button"
                            aria-label="More options"
                        >
                            ⋮
                        </button>

                    </div>


                    <div className="recent-upload-item">

                        <div className="recent-file-icon doc-icon">
                            W
                        </div>

                        <div className="recent-file-info">

                            <h3>
                                System Design Notes.docx
                            </h3>

                            <p>
                                1.6 MB · Uploaded yesterday
                            </p>

                        </div>

                        <span className="upload-status">
                            Processed
                        </span>

                        <button
                            className="upload-more"
                            type="button"
                            aria-label="More options"
                        >
                            ⋮
                        </button>

                    </div>


                    <div className="recent-upload-item">

                        <div className="recent-file-icon text-icon">
                            TXT
                        </div>

                        <div className="recent-file-info">

                            <h3>
                                JavaScript Reference.md
                            </h3>

                            <p>
                                890 KB · Uploaded 2 days ago
                            </p>

                        </div>

                        <span className="upload-status">
                            Processed
                        </span>

                        <button
                            className="upload-more"
                            type="button"
                            aria-label="More options"
                        >
                            ⋮
                        </button>

                    </div>


                    <div className="recent-upload-item">

                        <div className="recent-file-icon pdf-icon">
                            PDF
                        </div>

                        <div className="recent-file-info">

                            <h3>
                                Computer Networks.pdf
                            </h3>

                            <p>
                                3.2 MB · Uploaded 3 days ago
                            </p>

                        </div>

                        <span className="upload-status">
                            Processed
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