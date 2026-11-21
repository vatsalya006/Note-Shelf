import { useEffect, useState } from "react";
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

function Dashboard() {
    const navigate = useNavigate();

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const totalNotes = notes.length;

    const totalPDFs = notes.filter(
        (note) => note.type === "pdf"
    ).length;

    const totalYouTube = notes.filter(
        (note) => note.type === "youtube"
    ).length;
    const totalPlain = totalNotes - totalPDFs - totalYouTube;
    const recentNotes = [...notes]
        .sort(
            (a, b) =>
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )
        .slice(0, 5);
    const latestNote = recentNotes[0];
    const latestSnippet = latestNote
        ? getPlainText(latestNote.content).slice(0, 110)
        : "";
    const typeLabel = (type) =>
        type === "pdf" ? "pdf" : type === "youtube" ? "video" : "note";
    const formatDate = (value) =>
        value
            ? new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
              })
            : "";
    const maxCount = Math.max(totalPlain, totalPDFs, totalYouTube, 1);
    const last7Days = Array.from({ length: 7 }, (_, index) => {
        const day = new Date();
        day.setHours(0, 0, 0, 0);
        day.setDate(day.getDate() - (6 - index));
        const next = new Date(day);
        next.setDate(day.getDate() + 1);
        return {
            label: day.toLocaleDateString("en-US", { weekday: "narrow" }),
            active: notes.some((note) => {
                const created = new Date(note.createdAt || 0);
                return created >= day && created < next;
            }),
        };
    });
    let storedUser = {};
    try {
        storedUser = JSON.parse(localStorage.getItem("user")) || {};
    } catch {
        storedUser = {};
    }
    const firstName = (storedUser.name || "Rahul").split(" ")[0];

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

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch notes"
                    );
                }

                setNotes(data.notes || []);

            } catch (error) {
                console.error("Dashboard API Error:", error);
                setError(error.message);

            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    return (
        <div className="dashboard-page">

            {/* ================= HEADER ================= */}
            <div className="new-dashboard-header">
                <div>
                    <div className="hello">good to see you, {firstName}</div>
                    <h1>What you’ve been reading</h1>
                </div>

                <div className="dashboard-search-box">
                    <input
                        type="text"
                        placeholder="Search your shelf..."
                    />
                </div>
            </div>

            {/* ================= SUMMARY ================= */}
            <p className="dashboard-lede">
                {loading ? (
                    "Counting what you’ve saved..."
                ) : (
                    <>
                        You’ve saved <mark>{totalNotes} items</mark>:{" "}
                        <mark>{totalPlain} notes</mark>,{" "}
                        <mark>{totalPDFs} PDFs</mark> and{" "}
                        <mark>{totalYouTube} videos</mark>.
                    </>
                )}
            </p>

            {error && <p className="form-error">{error}</p>}

            {/* ================= RECENT + SIDE ================= */}
            <div className="dashboard-columns">

                <div>
                    <div className="section-title">Picked up recently</div>

                    {!loading && recentNotes.length === 0 && (
                        <p className="sub">
                            Nothing here yet. Add your first note or PDF.
                        </p>
                    )}

                    {recentNotes.map((item) => (
                        <div
                            className="list-row"
                            key={item._id}
                            onClick={() => navigate(`/notes/${item._id}`)}
                        >
                            <span className="tag">{typeLabel(item.type)}</span>
                            <div className="list-row-text">
                                <b>{item.title}</b>
                            </div>
                            <i>{formatDate(item.createdAt)}</i>
                        </div>
                    ))}

                    <button
                        className="text-button view-all"
                        type="button"
                        onClick={() => navigate("/notes")}
                    >
                        View everything →
                    </button>
                </div>

                <div>
                    {latestNote && (
                        <>
                            <div className="section-title">
                                Your latest note
                            </div>
                            <div
                                className="sticky-note"
                                onClick={() =>
                                    navigate(`/notes/${latestNote._id}`)
                                }
                            >
                                <span className="sticky-source">
                                    from “{latestNote.title}”
                                </span>
                                <p>
                                    {latestSnippet
                                        ? `“${latestSnippet}${latestSnippet.length >= 110 ? "…" : ""}”`
                                        : "No text in this one yet."}
                                </p>
                            </div>
                        </>
                    )}

                    <div className="section-title side-gap">Try asking</div>
                    <div className="quick-links">
                        <button type="button" onClick={() => navigate("/ai-chat")}>
                            Explain this topic from my notes
                        </button>
                        <button type="button" onClick={() => navigate("/ai-search")}>
                            Find notes about…
                        </button>
                        <button type="button" onClick={() => navigate("/graph")}>
                            Show how my notes connect
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= STRIP ================= */}
            <div className="dashboard-strip">

                <div>
                    <div className="section-title">What’s on your shelf</div>
                    <div className="bar-row">
                        <span>Notes</span>
                        <div style={{ width: `${(totalPlain / maxCount) * 110}px` }}></div>
                        <i>{totalPlain}</i>
                    </div>
                    <div className="bar-row">
                        <span>PDFs</span>
                        <div style={{ width: `${(totalPDFs / maxCount) * 110}px` }}></div>
                        <i>{totalPDFs}</i>
                    </div>
                    <div className="bar-row">
                        <span>Videos</span>
                        <div style={{ width: `${(totalYouTube / maxCount) * 110}px` }}></div>
                        <i>{totalYouTube}</i>
                    </div>
                </div>

                <div>
                    <div className="section-title">Do next</div>
                    <button className="todo-link" type="button" onClick={() => navigate("/notes/new")}>
                        Write a new note
                    </button>
                    <button className="todo-link" type="button" onClick={() => navigate("/upload")}>
                        Upload a PDF or YouTube link
                    </button>
                    <button className="todo-link" type="button" onClick={() => navigate("/graph")}>
                        Open the knowledge map
                    </button>
                </div>

                <div>
                    <div className="section-title">This week</div>
                    <div className="week-days">
                        {last7Days.map((day, index) => (
                            <b
                                key={index}
                                className={day.active ? "done" : ""}
                            >
                                {day.label}
                            </b>
                        ))}
                    </div>
                    <p className="sub">
                        {last7Days.filter((day) => day.active).length} of the
                        last 7 days you added something.
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;
