require("dotenv").config();

const mongoose = require("mongoose");

const {
    retrieveRelevantNotes
} = require("../services/retrievalService");

const testSet = require("./testSet.json");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function evaluateRetrieval() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("\n========== RETRIEVAL EVALUATION ==========\n");

        let passed = 0;
        let failed = 0;

        const results = [];

        for (let i = 0; i < testSet.length; i++) {
    const test = testSet[i];

    console.log(
        `Testing ${i + 1}/${testSet.length}: ${test.question}`
    );

    try {
        const retrievedNotes = await retrieveRelevantNotes(
            test.question,
            process.env.EVALUATION_USER_ID,
            5
        );

        const expectedNoteId = test.expectedNoteId.toString();

        const retrievedNoteIds = retrievedNotes.map(
            note => note.noteId.toString()
        );

        const isCorrect = retrievedNoteIds.includes(expectedNoteId);

        if (isCorrect) {
            passed++;
        } else {
            failed++;
        }

        results.push({
            question: test.question,
            expectedNoteId,
            retrievedNoteIds,
            passed: isCorrect,
            error: null
        });

        console.log(isCorrect ? "PASS\n" : "FAIL\n");

    } catch (error) {
        console.error(`Error on question ${i + 1}:`, error.message);

        results.push({
            question: test.question,
            expectedNoteId: test.expectedNoteId,
            retrievedNoteIds: [],
            passed: false,
            error: error.message
        });

        failed++;
    }

    // Wait before making the next retrieval request.
    if (i < testSet.length - 1) {
        await sleep(7000);
    }
}

        const accuracy = (passed / testSet.length) * 100;

        console.log("========== RESULTS ==========");
        console.log(`Total questions: ${testSet.length}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${failed}`);
        console.log(`Hit@5 accuracy: ${accuracy.toFixed(2)}%`);

        console.log("\n========== DETAILED RESULTS ==========");

        console.table(
            results.map(result => ({
                question: result.question,
                passed: result.passed,
                retrievedCount: result.retrievedNoteIds.length
            }))
        );

    } catch (error) {
        console.error("Evaluation failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

evaluateRetrieval();