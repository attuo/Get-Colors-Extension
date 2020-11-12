'use strict';

const allContentDiv = document.getElementById("all-colors");
const bgContentDiv = document.getElementById("background-colors");
const textContentDiv = document.getElementById("text-colors");
const otherContentDiv = document.getElementById("other-colors");

const getWebsiteColors = async () => {
  let content = await startScrape();
  if (!content) { return null; }
  else {
    let colors = findColors(content.css);
    return colors;
  }
}

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

const createTooltip = (parentDiv) => {
  let toolTipSpan = document.createElement("span");
  toolTipSpan.className = "tooltiptext";
  toolTipSpan.classList.add("tooltip-left")
  toolTipSpan.textContent = "Copy to clipboard";
  
  parentDiv.classList.add("tooltip");
  parentDiv.appendChild(toolTipSpan);

  parentDiv.addEventListener('mouseout', () => {
    resetTooltips();
  });
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
  colorCodeDiv.addEventListener('click', (result) => {
    copyOnClick(result);
  });

  createTooltip(colorCodeDiv);

  mainDiv.appendChild(countDiv);
  mainDiv.appendChild(colorCodeDiv);

  return mainDiv;
}

const resetTooltips = () => {
  let toolTips = document.querySelectorAll(".tooltiptext");
  toolTips.forEach(tooltip => {
    tooltip.textContent = "Click to copy";
  })
}

const updateTooltips = () => {
  let toolTips = document.querySelectorAll(".tooltiptext");
  toolTips.forEach(tooltip => {
    tooltip.textContent = "Copied!";
  })
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

const createErrorContent = () => {
  let tabContents = document.querySelectorAll(".panel-content");
  tabContents.forEach(tab => {
    let errorElement = document.createElement("span");
    errorElement.className = "error";
    errorElement.textContent = "Getting colors from this site is not supported.";
    tab.appendChild(errorElement);
  });
  
}

const createAllContent = (colorsGrouped) => { 
  let colorsMerged = mergeColors(colorsGrouped);
  colorsMerged.forEach(color => {
    allContentDiv.append(createColor(color));
  });

  createCopyAllListeners();
}

const createGroupedContents = (colors) => {
  colors.forEach(color => {
    switch(color.type) {
      case "background-color":
        bgContentDiv.append(createColor(color));
        break;
      case "color": 
        textContentDiv.append(createColor(color));
        break;
      default:
        otherContentDiv.append(createColor(color));
    }
  });
}

const copyToClipboard = (text) => {
  if (!navigator.clipboard) {
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    console.log('Async: Copying to clipboard was successful!');
  }, (err) => {
    console.error('Async: Could not copy text: ', err);
  });
}

const createCopyAllListeners = () => {
  let copyAllButtons = document.querySelectorAll(".copy-all-button");
  copyAllButtons.forEach(button => {
    button.addEventListener('click', (result) => {
      copyAllOnClick(result);
    });
    createTooltip(button);
  })
}

const copyOnClick = (node) => {
  let colorCodeElement = node.target.firstChild;
  let text = colorCodeElement.textContent;
  copyToClipboard(text);
  updateTooltips();
}

const copyAllOnClick = () => {
  let activeDiv = document.getElementsByClassName("panel-active")[0];
  let contentDiv = activeDiv.children[1];

  let colorCodes = [];
  contentDiv.childNodes.forEach(colorDiv => {
    colorCodes.push(colorDiv.lastChild.firstChild.textContent);
  });

  copyToClipboard(colorCodes.toString());
  updateTooltips();
}

const clearPreviousContents = () => {
  removeChildren(allContentDiv);
  removeChildren(bgContentDiv);
  removeChildren(textContentDiv);
  removeChildren(otherContentDiv);
}

const createContents = (colors) => {
  if (colors) {
    createAllContent(colors);
    createGroupedContents(colors);
  } else {
    createErrorContent();
  }  
}

const start = async () => {
  clearPreviousContents();
  let colors = await getWebsiteColors();
  createContents(colors);
}

start();