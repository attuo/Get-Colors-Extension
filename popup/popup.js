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


const createColor = (color) => {
  let mainDiv = document.createElement("div");
  mainDiv.className ="color-piece";
  mainDiv.style.background = color.colorCode;
  mainDiv.title = "Click to copy to clipboard";
  
  let countDiv = document.createElement("div");
  countDiv.className = "pill";
  countDiv.title = "Count of elements the color is used";
  countDiv.textContent = color.count;

  let colorCodeDiv = document.createElement("div");
  colorCodeDiv.className = "pill";
  colorCodeDiv.title = "Color code";
  colorCodeDiv.textContent = color.colorCode;

  mainDiv.appendChild(countDiv);
  mainDiv.appendChild(colorCodeDiv);

  return mainDiv;
}


const createPanelContent = (colors, typeName) => {
  let panelContentDiv = document.createElement("div");
  colors.forEach(color => {
    if(color.type == typeName) {
      panelContentDiv.append(createColor(color));
    }
  })
  return panelContentDiv;
}

const createAllContent = (colorsGrouped, allDiv) => {
  let colorsMerged = mergeColors(colorsGrouped);
  colorsMerged.forEach(color => {
    allDiv.append(createColor(color));
  });
}

const createGroupedContents = (colors, bgDiv, textDiv, otherDiv) => {
  colors.forEach(color => {
    switch(color.type) {
      case "background-color":
        bgDiv.append(createColor(color));
        break;
      case "color": 
        textDiv.append(createColor(color));
        break;
      default:
        otherDiv.append(createColor(color));
    }
  });
}

const handlePossibleError = (content) => {
  const containerDiv = document.getElementById("normal-content");
  const errorDiv = document.getElementById("error-content");

  if (!content) {
    containerDiv.classList.add("hidden");
    errorDiv.classList.remove("hidden");
    return true;
  } else {
    containerDiv.classList.remove("hidden");
    errorDiv.classList.add("hidden");
    return false;
  }
}

const start = async () => {
  const allContentDiv = document.getElementById("all-colors");
  const bgContentDiv = document.getElementById("background-colors");
  const textContentDiv = document.getElementById("text-colors");
  const otherContentDiv = document.getElementById("other-colors");
  
  removeChildren(allContentDiv);
  removeChildren(bgContentDiv);
  removeChildren(textContentDiv);
  removeChildren(otherContentDiv);

  let content = await startScrape();
  if (handlePossibleError(content)) {
    return;
  };

  let colors = findColors(content.css);
  createAllContent(colors, allContentDiv);
  createGroupedContents(colors, bgContentDiv, textContentDiv, otherContentDiv);

}

start();