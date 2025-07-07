const predefinedTags = ["idea", "todo", "read later", "important", "work", "personal"];
const tagFilter = document.getElementById("filter-tag");
const searchInput = document.getElementById("search");
let allNotes = [];

const tagColors = {
  "idea": "#fff9c4",
  "todo": "#b3e5fc",
  "read later": "#dcedc8",
  "important": "#ffcdd2",
  "work": "#e1bee7",
  "personal": "#ffe0b2"
};

function populateFilterDropdown() {
  predefinedTags.forEach(tag => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    tagFilter.appendChild(option);
  });
}

function saveNotes(notes) {
  chrome.storage.local.set({ savedNotes: notes });
}

function renderNotes(notes) {
  const container = document.getElementById("notes");
  container.innerHTML = "";

  if (notes.length === 0) {
    container.innerHTML = "<p>No notes found.</p>";
    return;
  }

  notes.forEach((note, index) => {
    const card = document.createElement("div");
    card.className = "note-card";
    card.style.backgroundColor = tagColors[note.tags[0]] || "#f9f9f9";

    const shortenedUrl = note.url.length > 50 ? note.url.slice(0, 50) + "..." : note.url;
    const title = `<strong>${note.title}</strong> <br/> <a href="${note.url}" title="${note.url}" target="_blank">${shortenedUrl}</a>`;
    const content = `<p contenteditable="true" class="note-content">${note.text}</p>`;
    const tags = note.tags.length ? `<small>Tags: ${note.tags.join(", ")}</small>` : "";
    const date = `<small> ${new Date(note.created_at).toLocaleString()}</small>`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = " Delete";
    deleteBtn.onclick = () => {
      allNotes.splice(index, 1);
      saveNotes(allNotes);
      renderNotes(filterNotes());
    };

    const saveEditBtn = document.createElement("button");
    saveEditBtn.textContent = " Save Edit";
    saveEditBtn.onclick = () => {
      const newText = card.querySelector(".note-content").textContent;
      allNotes[index].text = newText;
      saveNotes(allNotes);
      renderNotes(filterNotes());
    };

    card.innerHTML = `${title}<hr>${content}${tags}<br>${date}<br/>`;
    card.appendChild(deleteBtn);
    card.appendChild(saveEditBtn);
    container.appendChild(card);
  });
}

function filterNotes() {
  const query = searchInput.value.toLowerCase();
  const selectedTag = tagFilter.value;

  return allNotes.filter(note => {
    const matchesText = note.text.toLowerCase().includes(query) ||
                        note.title.toLowerCase().includes(query);
    const matchesTag = selectedTag === "" || note.tags.includes(selectedTag);
    return matchesText && matchesTag;
  });
}

searchInput.addEventListener("input", () => renderNotes(filterNotes()));
tagFilter.addEventListener("change", () => renderNotes(filterNotes()));

chrome.storage.local.get("savedNotes", (result) => {
  allNotes = result.savedNotes || [];
  populateFilterDropdown();
  renderNotes(allNotes);
});