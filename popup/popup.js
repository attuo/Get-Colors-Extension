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

const createColorDiv = (title) => {
  let colorDiv = document.createElement("div");
  let colorTitle = document.createElement("h4");
  colorTitle.textContent = title;
  colorDiv.appendChild(colorTitle);
  return colorDiv;
}

const createAllTabContent = (div, colors) => {
  let bgColorDiv = createColorDiv("Background colors");
  let textColorDiv = createColorDiv("Text colors");
  let otherColorDiv = createColorDiv("Other colors");

  colors.forEach(element => {
    switch(element.type) {
      case "background-color":
        bgColorDiv.append(createColor(element.color, element.count));
        break;
      case "color":
        textColorDiv.append(createColor(element.color, element.count));
        break;
      default: 
        otherColorDiv.append(createColor(element.color, element.count));
        break;
    }
  });
  div.appendChild(bgColorDiv);
  div.appendChild(textColorDiv);
  div.appendChild(otherColorDiv);
}

const createBackgroundTabContent = (div, colors) => {
  let bgColorDiv = createColorDiv("Background colors");
  colors.forEach(element => {
    if(element.type == "background-color") {
      bgColorDiv.append(createColor(element.color, element.count));
    }
  })
  div.appendChild(bgColorDiv);
}

const createTextTabContent = (div, colors) => {
  let textColorDiv = createColorDiv("Text colors");
  colors.forEach(element => {
    if(element.type == "color") {
      textColorDiv.append(createColor(element.color, element.count));
    }
  })
  div.appendChild(textColorDiv);
}

const createOtherTabContent = (div, colors) => {
  let otherColorDiv = createColorDiv("Other colors");
  colors.forEach(element => {
    if(element.type !== "background-color" && element.type !== "color") {
      otherColorDiv.append(createColor(element.color, element.count));
    }
  })
  div.appendChild(otherColorDiv);
}


const start = async () => {
  const allContentDiv = document.getElementById("all");
  const bgContentDiv = document.getElementById("background");
  const textContentDiv = document.getElementById("text");
  const otherContentDiv = document.getElementById("other");
  
  removeChildren(allContentDiv);
  removeChildren(bgContentDiv);
  removeChildren(textContentDiv);
  removeChildren(otherContentDiv);

  let content = await startScrape();
  let colors = findColors(content.css);
  
  createAllTabContent(allContentDiv, colors);
  createBackgroundTabContent(bgContentDiv, colors);
  createTextTabContent(textContentDiv, colors);
  createOtherTabContent(otherContentDiv, colors);
}

start();