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


const findBothColors = (cssContent) => {
  console.log("CSS KONTENTTI: ", cssContent);
  let colorRegex = /color:([ ]?)(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/ig
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
    div.appendChild(createColor(element.color, element.count));
  });
}

const createTypeColors = (div, colors) => {
  let bgColorDiv = document.createElement("div");
  let bgColorTitle = document.createElement("h4");
  bgColorTitle.textContent = "Background colors";
  bgColorDiv.appendChild(bgColorTitle);
  let colorDiv = document.createElement("div");
  let colorTitle = document.createElement("h4");
  colorTitle.textContent = "Text colors";
  colorDiv.appendChild(colorTitle);

  colors.forEach(element => {
    console.log("ELEMENTTI ", element);
    if (element.type == "background-color") {
      console.log("Käy bg")
      bgColorDiv.append(createColor(element.color, element.count));
    }
    if (element.type == "color") {
      console.log("Käy color")
      colorDiv.append(createColor(element.color, element.count));
    }
  });
  div.appendChild(bgColorDiv);
  div.appendChild(colorDiv);
}


const start = async () => {
  const content1Div = document.getElementById("content1");
  const content2Div = document.getElementById("content2");
  removeChildren(content1Div);
  removeChildren(content2Div);
  let content = await startScrape();
  let colors = findColors(content.css);
  //let bothColors = findBothColors(content.css);
  createColors(content1Div, colors);
  createTypeColors(content2Div, colors);
}

start();