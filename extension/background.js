
chrome.webNavigation.onCompleted.addListener(async () => {
    try{
        const tab = await getCurrentTab();
        chrome.scripting.executeScript({
            target: {tabId: tab.id, allFrames: true},
            files: ['send_request.js'],
        });
    }catch(e){
        console.log(e);
    }
});

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}