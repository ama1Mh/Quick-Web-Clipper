const predefinedTags = ["idea", "todo", "read later", "important", "work", "personal"];
const tagDropdown = document.getElementById("tags");

predefinedTags.forEach(tag => {
  const option = document.createElement("option");
  option.value = tag;
  option.textContent = tag;
  tagDropdown.appendChild(option);
});

document.getElementById("save").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const note = document.getElementById("note").value;
  const selectedTag = tagDropdown.value;

  chrome.storage.local.get({ savedNotes: [] }, (result) => {
    const savedNotes = result.savedNotes;
    savedNotes.push({
      url: tab.url,
      title: tab.title,
      text: note,
      tags: selectedTag ? [selectedTag] : [],
      created_at: new Date().toISOString()
    });
    chrome.storage.local.set({ savedNotes }, () => {
      document.getElementById("status").textContent = " Saved!";
      setTimeout(() => document.getElementById("status").textContent = "", 2000);
      document.getElementById("note").value = "";
      tagDropdown.value = "";
    });
  });
});

document.getElementById("view-notes").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("view.html") });
});