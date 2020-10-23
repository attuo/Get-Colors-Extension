// 'use strict';

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
  let regex = /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/ig;
  const matches = [...cssContent.match(regex)];
  let grouped = groupBy(matches);
  grouped.sort(compare);
  return grouped;
}

const findBothColors = (cssContent) => {
  console.log("CSS KONTENTTI: ", cssContent);
  let colorRegex = /(?<!-)(color:)( ?)(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/ig
  const textColorMatches = [...cssContent.match(colorRegex)];
  let bgRegex = /background-color:([ ]?)(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/ig
  const bgColorMatches = [...cssContent.match(bgRegex)];

  console.log("Tekstit: ", textColorMatches);
  console.log("BG: ", bgColorMatches);
}


const removeChildren = (parent) => {
  while (parent && parent.firstChild) {
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

const createColors = (div, colors) => {
  colors.forEach(element => {
    div.appendChild(createColor(element.name, element.count));
  });
}


const start = async () => {
  const contentDiv = document.getElementById("content1");
  removeChildren(contentDiv);
  let content = await startScrape();
  let colors = findColors(content.css);
  let bothColors = findBothColors(content.css);
  createColors(contentDiv, colors);
}

start();