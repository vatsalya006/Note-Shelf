function NoteCard({ title, content, category }) {
    return (
        <div className="note-card">

            <div className="note-card-top">
                <span className="tag">{category}</span>

                <span className="note-menu">⋮</span>
            </div>

            <h3>{title}</h3>

            <p className="note-description">
                {content}
            </p>

            <div className="tags">
                <span className="tag">{category}</span>
            </div>

            <div className="note-card-footer">
                <span>0 connections</span>

                <span className="link">Open →</span>
            </div>

        </div>
    );
}

export default NoteCard;