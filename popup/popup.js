// 'use strict';
const regex = /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/ig;

const startScrape = async () => {
  // Get the active tab
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  const tab = tabs[0];
  const scraped = await browser.tabs.executeScript(tab.id, {
    file: "/content_scripts/scrape.js"
  });
  return scraped[0];
}


const findColors = (cssContent) => {
  const matches = [...cssContent.match(regex)];
  let grouped = groupBy(matches);
  grouped.sort(compare);
  return grouped;
}



const removeChildren = (parent) => {
  while (parent.firstChild) {
    parent.firstChild.remove();
  }
}

const createColor = (colorCode, count) => {
  let mainDiv = document.createElement("div");
  mainDiv.className ="color-piece";
  mainDiv.style.background = colorCode;
  
  let countDiv = document.createElement("div");
  countDiv.className = "count-part";
  countDiv.textContent = count;

  let colorCodeDiv = document.createElement("div");
  colorCodeDiv.className = "code-part";
  colorCodeDiv.textContent = colorCode;

  mainDiv.appendChild(countDiv);
  mainDiv.appendChild(colorCodeDiv);

  return mainDiv;
}


const createColors = (colors) => {
  colors.forEach(element => {
    contentDiv.appendChild(createColor(element.name, element.count));
  });
}


const findButton = document.getElementById("find");
const contentDiv = document.getElementById("content");

findButton.addEventListener('click', async () => {
  removeChildren(contentDiv);
  let content = await startScrape();
  let colors = findColors(content.css);
  createColors(colors);
});
