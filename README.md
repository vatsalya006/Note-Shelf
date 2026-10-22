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

## Goal

The goal of Note Shelf is to build an intelligent personal knowledge workspace that goes beyond traditional note-taking. By combining knowledge storage, semantic retrieval, AI-powered interaction, and knowledge visualization, Note Shelf aims to help users connect with and make better use of the information they collect.

## Project Status

**Under active development.**

---

Made by **Vatsalya Singh**
