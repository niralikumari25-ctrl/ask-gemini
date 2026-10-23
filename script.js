const form = document.getElementById("question-form");
const questionInput = document.getElementById("question");
const submitBtn = document.getElementById("submit-btn");
const statusText = document.getElementById("status");
const answerBox = document.getElementById("answer-box");
const answerText = document.getElementById("answer");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  if (!question) {
    statusText.textContent = "Please enter a question.";
    return;
  }

  submitBtn.disabled = true;
  statusText.textContent = "Gemini is thinking...";
  answerBox.hidden = true;

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed.");
    }

    answerText.textContent = data.answer;
    answerBox.hidden = false;
    statusText.textContent = "Answer received!";
  } catch (error) {
    statusText.textContent =
      error.message || "Could not connect to the server.";
  } finally {
    submitBtn.disabled = false;
  }
});























































































































































