const { rerankResults } = require("./rerankingService");
const {
    cohereRerankResults,
} = require("./cohereRerankingService");

const benchmarkCases = [
    {
        query: "How does CRC-32 detect file corruption?",
        expectedTitle: "CRC-32 Based File Integrity Verification",
        results: [
            {
                title: "Database Management Systems",
                content:
                    "Databases store, organize, and retrieve structured information.",
            },
            {
                title: "CRC-32 Based File Integrity Verification",
                content:
                    "CRC-32 uses a generator polynomial and modulo-2 division to calculate a remainder and detect file corruption.",
            },
            {
                title: "Computer Networks",
                content:
                    "Computer networks enable communication between connected devices.",
            },
            {
                title: "File Handling in Python",
                content:
                    "Python supports opening, reading, writing, and modifying files.",
            },
        ],
    },
    {
        query: "How do relational databases organize data?",
        expectedTitle: "Relational Database Fundamentals",
        results: [
            {
                title: "Computer Networks",
                content:
                    "Networks allow connected computers to communicate and share resources.",
            },
            {
                title: "Relational Database Fundamentals",
                content:
                    "Relational databases organize information into tables containing rows and columns, with relationships defined using keys.",
            },
            {
                title: "CRC-32 Based File Integrity Verification",
                content:
                    "CRC-32 calculates a checksum used to detect accidental data corruption.",
            },
            {
                title: "Python File Handling",
                content:
                    "Python provides functions for reading and writing files.",
            },
        ],
    },
    {
        query: "How can Python read and write files?",
        expectedTitle: "Python File Handling",
        results: [
            {
                title: "Relational Database Fundamentals",
                content:
                    "Relational databases organize information into tables and relationships.",
            },
            {
                title: "Computer Networks",
                content:
                    "Computer networks support communication between connected devices.",
            },
            {
                title: "Python File Handling",
                content:
                    "Python uses open(), read(), write(), and close() to work with files.",
            },
            {
                title: "CRC-32 Based File Integrity Verification",
                content:
                    "CRC-32 detects corruption by calculating a checksum.",
            },
        ],
    },
];

async function measureReranker(name, reranker, testCase) {
    const start = performance.now();

    try {
        const results = await reranker(
            testCase.query,
            testCase.results,
            testCase.results.length
        );

        const latencyMs = Number(
            (performance.now() - start).toFixed(2)
        );

        const topResult = results[0];

        return {
            reranker: name,
            query: testCase.query,
            expectedTitle: testCase.expectedTitle,
            topResult: topResult?.title || null,
            topResultCorrect:
                topResult?.title === testCase.expectedTitle,
            latencyMs,
            ranking: results.map((result, index) => ({
                rank: index + 1,
                title: result.title,
                score:
                    name === "Gemini"
                        ? result.rerankScore
                        : result.cohereRerankScore,
            })),
            error: null,
        };
    } catch (error) {
        return {
            reranker: name,
            query: testCase.query,
            expectedTitle: testCase.expectedTitle,
            topResult: null,
            topResultCorrect: false,
            latencyMs: null,
            ranking: [],
            error: error.message,
        };
    }
}

async function runRerankingBenchmark() {
    const results = [];

    for (const testCase of benchmarkCases) {
        const [geminiResult, cohereResult] = await Promise.all([
            measureReranker("Gemini", rerankResults, testCase),
            measureReranker(
                "Cohere",
                cohereRerankResults,
                testCase
            ),
        ]);

        results.push(geminiResult, cohereResult);
    }

    const summary = ["Gemini", "Cohere"].map((name) => {
        const runs = results.filter(
            (result) => result.reranker === name
        );

        const successfulRuns = runs.filter(
            (result) => result.error === null
        );

        const correctTopResults = successfulRuns.filter(
            (result) => result.topResultCorrect
        ).length;

        const measuredLatencies = successfulRuns
            .map((result) => result.latencyMs)
            .filter((latency) => latency !== null);

        return {
            reranker: name,
            totalTests: runs.length,
            successfulTests: successfulRuns.length,
            correctTopResults,
            topResultAccuracy:
                successfulRuns.length > 0
                    ? Number(
                          (
                              (correctTopResults /
                                  successfulRuns.length) *
                              100
                          ).toFixed(2)
                      )
                    : null,
            averageLatencyMs:
                measuredLatencies.length > 0
                    ? Number(
                          (
                              measuredLatencies.reduce(
                                  (sum, latency) => sum + latency,
                                  0
                              ) / measuredLatencies.length
                          ).toFixed(2)
                      )
                    : null,
            errors: runs
                .filter((result) => result.error)
                .map((result) => result.error),
        };
    });

    return { summary, results };
}

module.exports = { runRerankingBenchmark };