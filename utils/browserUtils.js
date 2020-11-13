const getActiveTabContent = async () => (
  await browser.tabs.executeScript({
    file: "/content_scripts/scrape.js"
  })
)[0];

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