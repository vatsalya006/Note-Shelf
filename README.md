# Note Shelf

**An AI-powered personal knowledge management system.**

Note Shelf helps users organize, search, and interact with their personal knowledge in one place. Save notes, upload PDFs, and collect YouTube learning materials in a centralized workspace powered by AI.

It uses semantic search, hybrid retrieval, reranking, and Retrieval-Augmented Generation (RAG) to help users find information and chat with their saved knowledge.

## About

Note Shelf is a full-stack web application designed to make personal knowledge easier to manage and retrieve. Unlike general-purpose AI assistants, it focuses on the user's own knowledge, providing context-aware answers grounded in their saved materials.

## Features

* **Notes Management** — Create and organize personal notes.
* **PDF Upload** — Upload documents and extract their text.
* **YouTube Integration** — Extract transcripts from YouTube videos.
* **AI-Powered Summaries** — Generate summaries of saved content.
* **Semantic Search** — Find information based on meaning, not just keywords.
* **Hybrid Retrieval** — Combine semantic and keyword search for relevant results.
* **AI Chat** — Ask questions and explore your personal knowledge.
* **Source-Grounded Responses** — Retrieve relevant notes to support AI-generated answers.
* **Knowledge Graph** — Visually explore relationships between pieces of knowledge.
* **User Authentication** — Secure access to personal content.
* **Responsive Interface** — Access your knowledge through a clean, user-friendly interface.

## System Architecture

```text
                 USER
                  |
                  v
          React Frontend
                  |
                  v
         Node.js + Express
                  |
          +-------+--------+
          |                |
          v                v
    MongoDB Database    Content Ingestion
          |             (PDF / YouTube)
          |                |
          +-------+--------+
                  |
                  v
           Text Chunking
                  |
                  v
          Gemini Embeddings
                  |
                  v
          Pinecone Vector DB
                  |
                  v
             User Query
                  |
          +-------+--------+
          |                |
          v                v
     Semantic Search   Keyword Search
          |                |
          +-------+--------+
                  |
                  v
       Reciprocal Rank Fusion
                 (RRF)
                  |
                  v
          Cohere Reranking
                  |
                  v
          Relevant Knowledge
                  |
                  v
          +-------+-------+
          |               |
          v               v
       AI Search       AI Chat
                          |
                          v
                    Gemini Response
                          |
                          v
                    Answer + Sources
```

## Tech Stack

| Category                | Technologies                               |
| ----------------------- | ------------------------------------------ |
| Frontend                | React, JavaScript, HTML, CSS, Tailwind CSS |
| Backend                 | Node.js, Express.js                        |
| Database                | MongoDB                                    |
| Authentication          | JSON Web Tokens (JWT)                      |
| AI & Embeddings         | Google Gemini API                          |
| Vector Search           | Pinecone                                   |
| Retrieval & Reranking   | Hybrid Search, RRF, Cohere Rerank          |
| Knowledge Visualization | D3.js                                      |
| File Processing         | PDF Parser, YouTube Transcript API         |

## Retrieval Evaluation

Note Shelf evaluates retrieval quality using a test set of 20 questions with expected note IDs. The evaluation measures Hit@1, Hit@3, and Hit@5 to determine whether the expected note appears among the top retrieved results.

### Results

| Metric | Semantic-Only Search | Hybrid Search |
| ------ | -------------------: | ------------: |
| Hit@1  |                  30% |          100% |
| Hit@3  |                  35% |          100% |
| Hit@5  |                  35% |          100% |

Hybrid retrieval combines semantic search, keyword search, Reciprocal Rank Fusion (RRF), and Cohere reranking.

On the current evaluation set, hybrid retrieval achieved 100% Hit@1, Hit@3, and Hit@5, outperforming semantic-only search across all three metrics.

These results represent performance on the current 20-question test set and may differ on unseen queries.

## Goal

The goal of Note Shelf is to build an intelligent personal knowledge workspace that goes beyond traditional note-taking. By combining knowledge storage, semantic retrieval, AI-powered interaction, and knowledge visualization, Note Shelf aims to help users connect with and make better use of the information they collect.

## Project Status

**Under active development.**

---

Made by **Vatsalya Singh**
