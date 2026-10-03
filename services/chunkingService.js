function splitIntoSentences(text) {
    if (!text || !text.trim()) {
        return [];
    }

    const sentences = text
        .replace(/\s+/g, " ")
        .match(/[^.!?]+[.!?]+|[^.!?]+$/g);

    return sentences
        ? sentences.map(sentence => sentence.trim()).filter(Boolean)
        : [];
}
function cosineSimilarity(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) {
        throw new Error("Vectors must have the same dimensions");
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vectorA.length; i++) {
        dotProduct += vectorA[i] * vectorB[i];
        magnitudeA += vectorA[i] * vectorA[i];
        magnitudeB += vectorB[i] * vectorB[i];
    }

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}
function createSemanticChunks(
    sentences,
    embeddings,
    threshold = 0.85,
    overlapPercentage = 0.15
) {
    if (sentences.length !== embeddings.length) {
        throw new Error("Sentences and embeddings must have the same length");
    }

    if (sentences.length === 0) {
        return [];
    }

    const chunks = [];
    let currentChunk = [sentences[0]];

    for (let i = 1; i < sentences.length; i++) {
        const similarity = cosineSimilarity(
            embeddings[i - 1],
            embeddings[i]
        );

        if (similarity >= threshold) {
            currentChunk.push(sentences[i]);
        } else {
            chunks.push(currentChunk.join(" "));

            const overlapCount = Math.max(
                1,
                Math.ceil(currentChunk.length * overlapPercentage)
            );

            const overlapSentences = currentChunk.slice(-overlapCount);

            currentChunk = [
                ...overlapSentences,
                sentences[i]
            ];
        }
    }

    chunks.push(currentChunk.join(" "));

    return chunks;
}
module.exports = {
    splitIntoSentences,
    cosineSimilarity,
    createSemanticChunks,
};