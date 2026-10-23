const { generateAIResponse } = require("./geminiService");

async function classifyRelationship(noteA, noteB) {
    const prompt = `
You are classifying relationships between two notes.

NOTE A:
Title: ${noteA.title}
Content: ${(noteA.content || "").slice(0, 1500)}

NOTE B:
Title: ${noteB.title}
Content: ${(noteB.content || "").slice(0, 1500)}

Choose exactly one relationship:
- builds-on: Note B extends or develops an idea from Note A.
- contradicts: The notes express conflicting claims.
- same-topic: The notes discuss the same subject.
- references: One note mentions or refers to the other.

Return only valid JSON in this format:
{"relationship":"same-topic"}
`;

    const response = await generateAIResponse(prompt);

    try {
        const cleaned = response
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned);

        const allowed = [
            "builds-on",
            "contradicts",
            "same-topic",
            "references",
        ];

        if (allowed.includes(parsed.relationship)) {
            return parsed.relationship;
        }

        return "same-topic";
    } catch (error) {
        console.error("Relationship classification error:", error);
        return "same-topic";
    }
}

module.exports = { classifyRelationship };