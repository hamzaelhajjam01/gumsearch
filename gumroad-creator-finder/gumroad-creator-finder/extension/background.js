// Opens CreatorFinder as a full tab instead of a small popup.
// If a tab is already open, focuses it instead of opening a duplicate.

const APP_PAGE = chrome.runtime.getURL("index.html");

chrome.action.onClicked.addListener(async () => {
  const tabs = await chrome.tabs.query({});
  const existing = tabs.find((tab) => tab.url && tab.url.startsWith(APP_PAGE));

  if (existing) {
    await chrome.tabs.update(existing.id, { active: true });
    await chrome.windows.update(existing.windowId, { focused: true });
  } else {
    await chrome.tabs.create({ url: APP_PAGE });
  }
});
