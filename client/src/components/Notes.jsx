import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";

function Notes() {
    const [search, setSearch] = useState("");

    const notes = [
        {
            id: 1,
            title: "Learn React",
            content: "Understand components, props and state."
        },
        {
            id: 2,
            title: "Learn Node.js",
            content: "Build APIs with Express."
        },
        {
            id: 3,
            title: "Build Note Shelf",
            content: "Create an AI-powered second brain."
        }
    ];

    useEffect(() => {
        console.log("Search changed:", search);
    }, [search]);

    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h1>My Notes</h1>

            <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />

            {filteredNotes.map((note) => (
                <div key={note.id}>
                    <h2>{note.title}</h2>
                    <p>{note.content}</p>
                </div>
            ))}
        </div>
    );
}

export default Notes;