// Shared by index.html and answers.html.
// Answers are kept in this browser only, as a JSON array under one key.
const STORAGE_KEY = 'struggles';

function loadAnswers() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return []; // storage blocked, or the saved data is corrupted
  }
}

function saveAnswer(text) {
  const answers = loadAnswers();
  answers.push({ text, submittedAt: new Date().toISOString() });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    return true;
  } catch {
    return false; // private mode, storage full, or storage disabled
  }
}

function clearAnswers() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage blocked: nothing was saved, so there is nothing to clear
  }
}
