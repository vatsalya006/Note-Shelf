const { index } = require("../config/pinecone");

async function storeEmbedding(id, vector, metadata = {}) {
  await index.upsert({
    records: [
      {
        id,
        values: vector,
        metadata,
      },
    ],
  });
}

async function searchSimilar(vector, userId, topK = 5) {
  const result = await index.query({
    vector,
    topK,
    filter: {
      userId: {
        $eq: userId.toString(),
      },
    },
    includeMetadata: true,
  });

  return result.matches;
}

async function storeChunkEmbedding(
    noteId,
    userId,
    chunkIndex,
    vector,
    chunk
) {
    const id = `note-${noteId}-chunk-${chunkIndex}`;

    const metadata = {
        noteId: noteId.toString(),
        userId: userId.toString(),
        chunkIndex,
        text: chunk.text,
    };

    if (chunk.startTime !== null && chunk.startTime !== undefined) {
        metadata.startTime = chunk.startTime;
    }

    if (chunk.endTime !== null && chunk.endTime !== undefined) {
        metadata.endTime = chunk.endTime;
    }

    await storeEmbedding(id, vector, metadata);
}

module.exports = {
  storeEmbedding,
  searchSimilar,
  storeChunkEmbedding,
};