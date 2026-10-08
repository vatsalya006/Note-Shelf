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

async function searchSimilar(vector, topK = 5) {
  const result = await index.query({
    vector,
    topK,
    includeMetadata: true,
  });

  return result.matches;
}

module.exports = {
  storeEmbedding,
  searchSimilar,
};