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

module.exports = {
    splitIntoSentences,
};