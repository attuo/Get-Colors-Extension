const getCurrentActiveTab = async () => (
  await browser.tabs.query({
    active: true,
    currentWindow: true
  })
)[0];

const getTabContent = async (tab) => (
  await browser.tabs.executeScript(tab.id, {
    file: "/content_scripts/scrape.js"
  })
)[0];

const getCurrentActiveTabContent = async () => {
  let currentActiveTab = await getCurrentActiveTab();
  let tabContent = await getTabContent(currentActiveTab);
  return tabContent;
}

// <-- Copy to clipboard -->

const copyToClipboard = (text) => {
  if (!navigator.clipboard) {
    console.error("Clipboard permission is not allowed");
    return;
  }
  navigator.clipboard.writeText(text).then(() => {},
    (err) => {
      console.error("Could not copy text: ", err);
    });
}