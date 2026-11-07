const { generateAIResponse } = require("./geminiService");

async function classifyRelationship(noteA, noteB) {
    const prompt = `
You are an expert knowledge graph relationship classifier.

Analyze the relationship between these two notes.

NOTE A:
Title: ${noteA.title}
Content: ${(noteA.content || "").slice(0, 1500)}

NOTE B:
Title: ${noteB.title}
Content: ${(noteB.content || "").slice(0, 1500)}

Choose exactly one relationship:

- builds-on: Note B extends or develops an idea from Note A.
- contradicts: The notes express conflicting claims.
- same-topic: Both notes discuss the same subject.
- references: One note explicitly mentions or refers to the other.

Also explain WHY these notes are connected.

Return ONLY valid JSON in this exact format:

{
    "relationship": "builds-on",
    "reason": "Note B expands on the concept introduced in Note A."
}

Keep the reason concise, specific, and based only on the provided notes.
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

        if (
            allowed.includes(parsed.relationship) &&
            typeof parsed.reason === "string" &&
            parsed.reason.trim()
        ) {
            return {
                relationship: parsed.relationship,
                reason: parsed.reason.trim(),
            };
        }

        throw new Error("Invalid relationship response");
    } catch (error) {
        console.error("Relationship classification error:", error);

        return {
            relationship: "same-topic",
            reason: "These notes have similar content or topics.",
        };
    }
}

module.exports = { classifyRelationship };