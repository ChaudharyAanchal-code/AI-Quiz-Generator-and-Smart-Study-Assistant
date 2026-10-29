// Get the page elements that the program needs.
const topicInput = document.getElementById("topicInput");
const explainButton = document.getElementById("explainButton");
const summaryButton = document.getElementById("summaryButton");
const clearButton = document.getElementById("clearButton");
const copyButton = document.getElementById("copyButton");
const modelStatus = document.getElementById("modelStatus");
const loadingMessage = document.getElementById("loadingMessage");
const resultBox = document.getElementById("resultBox");

// One session is created and reused for each request.
let aiSession = null;

// Show a status message. The state ("loading", "ready" or "error") controls the colour of the status pill.
function setStatus(message, state) {
    modelStatus.textContent = message;
    modelStatus.dataset.state = state;
}

// Check whether the browser supports the native Prompt API.
async function setupAI() {
    if (!("LanguageModel" in window)) {
        setStatus(
            "AI model unavailable: this browser does not support the Prompt API.",
            "error"
        );
        return;
    }

    try {
        setStatus("Checking AI model...", "loading");
        const availability = await LanguageModel.availability();

        if (availability === "unavailable") {
            setStatus("AI model unavailable on this device or browser.", "error");
            return;
        }

        setStatus(
            "Preparing the on-device AI model. This may take a little time...",
            "loading"
        );
        aiSession = await LanguageModel.create();

        setStatus("AI model is ready.", "ready");
        explainButton.disabled = false;
        summaryButton.disabled = false;
    } catch (error) {
        setStatus(
            "Could not start the AI model. Check browser support and try again.",
            "error"
        );
        console.error("AI setup error:", error);
    }
}

// Ask the model for an explanation or a short summary.
async function generateAnswer(task) {
    const topic = topicInput.value.trim();

    if (topic === "") {
        resultBox.textContent = "Please enter a topic first.";
        copyButton.disabled = true;
        return;
    }

    if (!aiSession) {
        resultBox.textContent =
            "The AI model is not ready. Please check the model status above.";
        copyButton.disabled = true;
        return;
    }

    explainButton.disabled = true;
    summaryButton.disabled = true;
    clearButton.disabled = true;
    copyButton.disabled = true;
    loadingMessage.hidden = false;
    resultBox.textContent = "";

    let prompt = "";

    if (task === "explain") {
        prompt = `Explain the topic "${topic}" in easy language for a college student. Use a short explanation and a simple example. Keep the original topic name unchanged.`;
    } else {
        prompt = `Write a short, clear summary of the topic "${topic}" for a student. Use simple language and 3 to 5 bullet points. Keep the original topic name unchanged.`;
    }

    try {
        const answer = await aiSession.prompt(prompt);
        resultBox.textContent = answer.trim() || "The AI did not return an answer.";
        copyButton.disabled = resultBox.textContent.length === 0;
    } catch (error) {
        resultBox.textContent =
            "Sorry, the answer could not be generated. Please try again.";
        console.error("Prompt error:", error);
    } finally {
        loadingMessage.hidden = true;
        explainButton.disabled = false;
        summaryButton.disabled = false;
        clearButton.disabled = false;
    }
}

// Clear the topic and result without changing the entered topic during generation.
function clearPage() {
    topicInput.value = "";
    resultBox.textContent = "Your answer will appear here.";
    copyButton.disabled = true;
}

// Copy the displayed result to the clipboard.
async function copyResult() {
    const result = resultBox.textContent;

    if (!result || result === "Your answer will appear here.") {
        return;
    }

    try {
        await navigator.clipboard.writeText(result);
        copyButton.textContent = "Copied!";
        setTimeout(() => {
            copyButton.textContent = "Copy Result";
        }, 1500);
    } catch (error) {
        resultBox.textContent = result + "\n\n(Copy failed. Please select and copy the text manually.)";
        console.error("Copy error:", error);
    }
}

// Connect the buttons to their functions.
explainButton.addEventListener("click", () => generateAnswer("explain"));
summaryButton.addEventListener("click", () => generateAnswer("summary"));
clearButton.addEventListener("click", clearPage);
copyButton.addEventListener("click", copyResult);

// Start checking for AI support when the page loads.
setupAI();
