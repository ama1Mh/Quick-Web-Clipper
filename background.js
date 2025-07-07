chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-selection",
    title: "Save Selected Text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-selection") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString()
    }, (injectionResults) => {
      const selectedText = injectionResults[0].result;
      chrome.storage.local.get({ savedNotes: [] }, (result) => {
        const savedNotes = result.savedNotes;
        savedNotes.push({
          url: tab.url,
          title: tab.title,
          text: selectedText,
          tags: [],
          created_at: new Date().toISOString()
        });
        chrome.storage.local.set({ savedNotes });
      });
    });
  }
});