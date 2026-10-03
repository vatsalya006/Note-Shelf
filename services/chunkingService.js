function splitIntoSentences(text) {
    if (!text || !text.trim()) {
        return [];
    }

    const sentences = text
        .replace(/\s+/g, " ")
        .match(/[^.!?]+[.!?]+|[^.!?]+$/g);

    return sentences
        ? sentences
            .map(sentence => sentence.trim())
            .filter(Boolean)
        : [];
}

function splitIntoParagraphs(text) {
    if (!text || !text.trim()) {
        return [];
    }

    return text
        .split(/\n(?=Product \d+:)/)
        .map(paragraph => paragraph.replace(/\s+/g, " ").trim())
        .filter(Boolean);
}


function cosineSimilarity(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) {
        throw new Error(
            "Vectors must have the same dimensions"
        );
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

    return (
        dotProduct /
        (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB))
    );
}

function createSemanticChunks(
    sentences,
    embeddings,
    threshold = 0.85,
    overlapPercentage = 0.15
) {
    if (sentences.length !== embeddings.length) {
        throw new Error(
            "Sentences and embeddings must have the same length"
        );
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

            chunks.push(
                currentChunk.join(" ")
            );

            const overlapCount = Math.max(
                1,
                Math.ceil(
                    currentChunk.length * overlapPercentage
                )
            );

            const overlapSentences =
                currentChunk.slice(-overlapCount);

            currentChunk = [
                ...overlapSentences,
                sentences[i]
            ];
        }
    }

    chunks.push(
        currentChunk.join(" ")
    );

    return chunks;
}

function createPdfAwareChunks(
    paragraphs,
    paragraphEmbeddings,
    threshold = 0.85,
    overlapPercentage = 0.15,
    maxParagraphs = 5
) {
    if (paragraphs.length !== paragraphEmbeddings.length) {
        throw new Error(
            "Paragraphs and paragraph embeddings must have the same length"
        );
    }

    if (paragraphs.length === 0) {
        return [];
    }

    const chunks = [];

    let currentChunk = [paragraphs[0]];

    for (let i = 1; i < paragraphs.length; i++) {

        const similarity = cosineSimilarity(
            paragraphEmbeddings[i - 1],
            paragraphEmbeddings[i]
        );

        const shouldStartNewChunk =
            similarity < threshold ||
            currentChunk.length >= maxParagraphs;

        if (!shouldStartNewChunk) {

            currentChunk.push(paragraphs[i]);

        } else {

            chunks.push(
                currentChunk.join("\n\n")
            );

            const overlapCount =
                currentChunk.length > 1
                    ? Math.max(
                        1,
                        Math.ceil(
                            currentChunk.length *
                            overlapPercentage
                        )
                    )
                    : 0;

            const overlapParagraphs =
                currentChunk.length > 1
                    ? currentChunk.slice(-overlapCount)
                    : [];

            currentChunk = [
                ...overlapParagraphs,
                paragraphs[i]
            ];
        }
    }

    chunks.push(
        currentChunk.join("\n\n")
    );

    return chunks;
}

function createYoutubeChunks(
    transcript,
    maxDuration = 60,
    overlapSegments = 1
) {
    if (!transcript || transcript.length === 0) {
        return [];
    }

    const chunks = [];

    let currentSegments = [];
    let currentDuration = 0;

    for (const segment of transcript) {

        if (!segment.text || !segment.text.trim()) {
            continue;
        }

        currentSegments.push(segment);

        currentDuration += segment.duration;

        const durationInSeconds =
            currentDuration / 1000;

        if (durationInSeconds >= maxDuration) {

            const firstSegment =
                currentSegments[0];

            const lastSegment =
                currentSegments[currentSegments.length - 1];

            const startTime =
                firstSegment.offset;

            const endTime =
                lastSegment.offset +
                lastSegment.duration;

            chunks.push({
                text: currentSegments
                    .map(segment => segment.text)
                    .join(" ")
                    .trim(),

                startTime,

                endTime
            });

            const overlap =
                currentSegments.slice(-overlapSegments);

            currentSegments = overlap;

            currentDuration =
                overlap.reduce(
                    (total, segment) =>
                        total + segment.duration,
                    0
                );
        }
    }

    if (currentSegments.length > 0) {

        const firstSegment =
            currentSegments[0];

        const lastSegment =
            currentSegments[currentSegments.length - 1];

        const startTime =
            firstSegment.offset;

        const endTime =
            lastSegment.offset +
            lastSegment.duration;

        chunks.push({
            text: currentSegments
                .map(segment => segment.text)
                .join(" ")
                .trim(),

            startTime,

            endTime
        });
    }

    return chunks;
}

module.exports = {
    splitIntoSentences,
    splitIntoParagraphs,
    cosineSimilarity,
    createSemanticChunks,
    createPdfAwareChunks,
    createYoutubeChunks
};