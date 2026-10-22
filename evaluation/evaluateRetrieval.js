require("dotenv").config();

const mongoose = require("mongoose");

const {
retrieveRelevantNotes
} = require("../services/retrievalService");

const {
semanticSearch
} = require("../services/semanticSearchService");

const testSet = require("./testSet.json");

function sleep(ms) {
return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runExperiment(name, searchFunction, useCohere = false) {
console.log(`\n========== ${name} ==========\n`);

let hitAt1 = 0;
let hitAt3 = 0;
let hitAt5 = 0;
let errors = 0;

const results = [];

for (let i = 0; i < testSet.length; i++) {
    const test = testSet[i];

    console.log(
        `Testing ${i + 1}/${testSet.length}: ${test.question}`
    );

    try {
        const retrievedNotes = await searchFunction(
            test.question,
            process.env.EVALUATION_USER_ID,
            5
        );

        const expectedNoteId = String(test.expectedNoteId);

        const retrievedNoteIds = retrievedNotes.map(
            (note) => String(note.noteId)
        );

        const rank = retrievedNoteIds.indexOf(expectedNoteId);

        const isHitAt1 = rank >= 0 && rank < 1;
        const isHitAt3 = rank >= 0 && rank < 3;
        const isHitAt5 = rank >= 0 && rank < 5;

        if (isHitAt1) hitAt1++;
        if (isHitAt3) hitAt3++;
        if (isHitAt5) hitAt5++;

        results.push({
            question: test.question,
            rank: rank === -1 ? "Not found" : rank + 1,
            hitAt1: isHitAt1,
            hitAt3: isHitAt3,
            hitAt5: isHitAt5,
            error: ""
        });

        console.log(
            `Rank: ${rank === -1 ? "Not found" : rank + 1} | ` +
            `Hit@1: ${isHitAt1 ? "PASS" : "FAIL"} | ` +
            `Hit@3: ${isHitAt3 ? "PASS" : "FAIL"} | ` +
            `Hit@5: ${isHitAt5 ? "PASS" : "FAIL"}\n`
        );
    } catch (error) {
        errors++;

        console.error(
            `Error on question ${i + 1}: ${error.message}\n`
        );

        results.push({
            question: test.question,
            rank: "Error",
            hitAt1: false,
            hitAt3: false,
            hitAt5: false,
            error: error.message
        });
    }

    // Cohere has a limited trial API rate.
    if (useCohere && i < testSet.length - 1) {
        await sleep(7000);
    }
}

const total = testSet.length;

// Errors count as misses, so both experiments use the same denominator.
const metrics = {
    name,
    total,
    errors,
    hitAt1,
    hitAt3,
    hitAt5,
    hitAt1Accuracy: (hitAt1 / total) * 100,
    hitAt3Accuracy: (hitAt3 / total) * 100,
    hitAt5Accuracy: (hitAt5 / total) * 100
};

console.log(`\n========== ${name} RESULTS ==========`);

console.log(`Total questions: ${total}`);
console.log(`Evaluation errors: ${errors}`);
console.log(
    `Hit@1 accuracy: ${metrics.hitAt1Accuracy.toFixed(2)}%`
);
console.log(
    `Hit@3 accuracy: ${metrics.hitAt3Accuracy.toFixed(2)}%`
);
console.log(
    `Hit@5 accuracy: ${metrics.hitAt5Accuracy.toFixed(2)}%`
);

console.table(results);

return metrics;


}

async function evaluateRetrieval() {
try {
if (!process.env.MONGO_URI) {
throw new Error("MONGO_URI is missing from .env");
}

    if (!process.env.EVALUATION_USER_ID) {
        throw new Error("EVALUATION_USER_ID is missing from .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    // Experiment A: semantic retrieval without reranking.
    const semanticResults = await runExperiment(
        "SEMANTIC-ONLY SEARCH",
        semanticSearch
    );

    // Experiment B: existing hybrid retrieval with Cohere reranking.
    const hybridResults = await runExperiment(
        "HYBRID SEARCH",
        retrieveRelevantNotes,
        true
    );

    console.log("\n========== FINAL COMPARISON ==========\n");

    console.table([
        {
            configuration: semanticResults.name,
            HitAt1: `${semanticResults.hitAt1Accuracy.toFixed(2)}%`,
            HitAt3: `${semanticResults.hitAt3Accuracy.toFixed(2)}%`,
            HitAt5: `${semanticResults.hitAt5Accuracy.toFixed(2)}%`,
            errors: semanticResults.errors
        },
        {
            configuration: hybridResults.name,
            HitAt1: `${hybridResults.hitAt1Accuracy.toFixed(2)}%`,
            HitAt3: `${hybridResults.hitAt3Accuracy.toFixed(2)}%`,
            HitAt5: `${hybridResults.hitAt5Accuracy.toFixed(2)}%`,
            errors: hybridResults.errors
        }
    ]);

    console.log("\n========== HYBRID IMPROVEMENT ==========\n");

    console.log(
        `Hit@1: ${(hybridResults.hitAt1Accuracy - semanticResults.hitAt1Accuracy).toFixed(2)} percentage points`
    );

    console.log(
        `Hit@3: ${(hybridResults.hitAt3Accuracy - semanticResults.hitAt3Accuracy).toFixed(2)} percentage points`
    );

    console.log(
        `Hit@5: ${(hybridResults.hitAt5Accuracy - semanticResults.hitAt5Accuracy).toFixed(2)} percentage points`
    );
} catch (error) {
    console.error("Evaluation failed:", error.message);
} finally {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
}

}

evaluateRetrieval();