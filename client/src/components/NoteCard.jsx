function NoteCard({ title, content, category }) {
    return (
        <div className="note-card">
            <span>{category}</span>

            <h3>{title}</h3>

            <p>{content}</p>
        </div>
    );
}

export default NoteCard;