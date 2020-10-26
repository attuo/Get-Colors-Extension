'use strict';

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

const createTypeColors = (div, colors) => {
  let bgColorDiv = document.createElement("div");
  let bgColorTitle = document.createElement("h4");
  bgColorTitle.textContent = "Background colors";
  bgColorDiv.appendChild(bgColorTitle);
  let colorDiv = document.createElement("div");
  let colorTitle = document.createElement("h4");
  colorTitle.textContent = "Text colors";
  colorDiv.appendChild(colorTitle);
  let otherColorDiv = document.createElement("div");
  let otherColorTitle = document.createElement("h4");
  otherColorTitle.textContent = "Other colors";
  otherColorDiv.appendChild(otherColorTitle);

  colors.forEach(element => {
    switch(element.type) {
      case "background-color":
        bgColorDiv.append(createColor(element.color, element.count));
        break;
      case "color":
        colorDiv.append(createColor(element.color, element.count));
        break;
      default: 
      otherColorDiv.append(createColor(element.color, element.count));
    }
  });
  div.appendChild(bgColorDiv);
  div.appendChild(colorDiv);
  div.appendChild(otherColorDiv);
}


const start = async () => {
  const contentDiv = document.getElementById("content");
  removeChildren(contentDiv);
  let content = await startScrape();
  let colors = findColors(content.css);
  //let bothColors = findBothColors(content.css);
  createTypeColors(contentDiv, colors);
}

start();