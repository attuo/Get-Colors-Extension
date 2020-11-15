/**
 * Inserts JavaScript to the browser's current tab page
 *  This loads the scrape.js to the page, that fetches the page's html and css
 */
const getActiveTabContent = async () => (
  await browser.tabs.executeScript({
    file: "/content_scripts/scrape.js"
  })
)[0];

// <-- Copy to clipboard -->

/**
 * Using browser's clipboard functionality the text can be copied to user's clipboard
 */
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