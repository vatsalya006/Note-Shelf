require("dotenv").config();

const mongoose = require("mongoose");

const {
    retrieveRelevantNotes
} = require("../services/retrievalService");

const testSet = require("./testSet.json");

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function evaluateRetrieval() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("\n========== RETRIEVAL EVALUATION ==========\n");

        let passed = 0;
        let failed = 0;
        let errors = 0;

        let hitAt1 = 0;
        let hitAt3 = 0;
        let hitAt5 = 0;

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

                const expectedNoteId = String(test.expectedNoteId);

                const retrievedNoteIds = retrievedNotes.map(
                    (note) => String(note.noteId)
                );

                const rank = retrievedNoteIds.indexOf(expectedNoteId);

                const isHitAt1 = rank >= 0 && rank < 1;
                const isHitAt3 = rank >= 0 && rank < 3;
                const isHitAt5 = rank >= 0 && rank < 5;

                if (isHitAt5) {
                    passed++;
                } else {
                    failed++;
                }

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
                    `Hit@1: ${isHitAt1 ? "PASS" : "FAIL"} | ` +
                    `Hit@3: ${isHitAt3 ? "PASS" : "FAIL"} | ` +
                    `Hit@5: ${isHitAt5 ? "PASS" : "FAIL"}\n`
                );
            } catch (error) {
                errors++;

                console.error(
                    `Error on question ${i + 1}: ${error.message}`
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

            if (i < testSet.length - 1) {
                await sleep(7000);
            }
        }

        const total = testSet.length;

        const hitAt1Accuracy = (hitAt1 / total) * 100;
        const hitAt3Accuracy = (hitAt3 / total) * 100;
        const hitAt5Accuracy = (hitAt5 / total) * 100;

        console.log("\n========== RESULTS ==========");
        console.log(`Total questions: ${total}`);
        console.log(`Passed at Hit@5: ${passed}`);
        console.log(`Failed at Hit@5: ${failed}`);
        console.log(`Evaluation errors: ${errors}`);

        console.log("\n========== ACCURACY ==========");
        console.log(`Hit@1 accuracy: ${hitAt1Accuracy.toFixed(2)}%`);
        console.log(`Hit@3 accuracy: ${hitAt3Accuracy.toFixed(2)}%`);
        console.log(`Hit@5 accuracy: ${hitAt5Accuracy.toFixed(2)}%`);

        console.log("\n========== DETAILED RESULTS ==========");

        console.table(
            results.map((result) => ({
                question: result.question,
                rank: result.rank,
                hitAt1: result.hitAt1,
                hitAt3: result.hitAt3,
                hitAt5: result.hitAt5,
                error: result.error ? result.error : "None"
            }))
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
