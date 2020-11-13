'use strict';

const allContentDiv = document.getElementById("all-colors");
const bgContentDiv = document.getElementById("background-colors");
const textContentDiv = document.getElementById("text-colors");
const otherContentDiv = document.getElementById("other-colors");

// <-- Color element -->

const createColorCountElement = (colorCount) => {
  let countDiv = document.createElement("div") 
  countDiv.className = "pill";
  countDiv.title = "Count of elements the color is used";
  countDiv.textContent = colorCount;
  return countDiv;
}

const createColorCodeElement = (colorCode) => {
  let colorCodeDiv = document.createElement("div");
  colorCodeDiv.className = "pill";
  colorCodeDiv.title = "Color code";
  colorCodeDiv.textContent = colorCode;
  colorCodeDiv.addEventListener('click', (result) => {
    copyOnClickEvent(result);
  });
  return colorCodeDiv;
}

const createColorElement = (color) => {
  let colorDiv = document.createElement("div");
  colorDiv.className ="color-row";
  colorDiv.style.background = color.colorCode;
  
  let colorCountElement = createColorCountElement(color.count);
  let colorCodeElement = createColorCodeElement(color.colorCode);
  createTooltipElement(colorCodeElement);

  colorDiv.appendChild(colorCountElement);
  colorDiv.appendChild(colorCodeElement);

  return colorDiv;
}

// <-- Tooltips --> 

const createTooltipElement = (parentDiv) => {
  let tooltipSpan = document.createElement("span");
  tooltipSpan.className = "tooltip";
  tooltipSpan.classList.add("tooltip-left")
  tooltipSpan.textContent = "Copy";
  
  parentDiv.classList.add("tooltippable");
  parentDiv.appendChild(tooltipSpan);
  parentDiv.addEventListener('mouseout', () => {
    resetTooltipElements();
  });
}

const updateTooltipElements = () => {
  let toolTips = document.querySelectorAll(".tooltip");
  toolTips.forEach(tooltip => {
    tooltip.textContent = "Copied!";
  })
}

const resetTooltipElements = () => {
  let toolTips = document.querySelectorAll(".tooltip");
  toolTips.forEach(tooltip => {
    tooltip.textContent = "Copy";
  })
}

// <-- Tab contents -->

const createAllTabContent = (colorsByType) => { 
  let colorsByColorCode = joinByColorCode(colorsByType);
  colorsByColorCode.forEach(color => {
    allContentDiv.append(createColorElement(color));
  });
  createCopyAllListeners();
}

const createGroupedTabsContents = (colors) => {
  colors.forEach(color => {
    switch(color.type) {
      case "background-color":
        bgContentDiv.append(createColorElement(color));
        break;
      case "color": 
        textContentDiv.append(createColorElement(color));
        break;
      default:
        otherContentDiv.append(createColorElement(color));
    }
  });
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

// <-- Copy colors to clipboard -->

const createCopyAllListeners = () => {
  let copyAllButtons = document.querySelectorAll(".copy-all-button");
  copyAllButtons.forEach(button => {
    button.addEventListener('click', (result) => {
      copyAllOnClickEvent(result);
    });
    createTooltipElement(button);
  });
}

const copyAllOnClickEvent = () => {
  let colorPillDivs = document.querySelectorAll(".panel-active > .panel-content > .color-row > .tooltippable");
  let colorCodes = [];
  colorPillDivs.forEach(colorPill => {
    colorCodes.push(colorPill.firstChild.textContent);
  });
  copyToClipboard(colorCodes.toString());
  updateTooltipElements();
}

const copyOnClickEvent = (node) => {
  let colorCodeElement = node.target.firstChild;
  let text = colorCodeElement.textContent;
  copyToClipboard(text);
  updateTooltipElements();
}

// <-- Element clearing -->

const removeChildrenElements = (elements) => {
  elements.forEach(element => {
    while (element && element.firstChild) {
      element.firstChild.remove();
    }
  })
}

const clearPreviousContents = () => {
  removeChildrenElements([allContentDiv, bgContentDiv, textContentDiv, otherContentDiv]);
}

// <-- Creating tab contents -->

const createContents = (colors) => {
  if (colors) {
    createAllTabContent(colors);
    createGroupedTabsContents(colors);
  } else {
    createErrorContent();
  }  
}

// <-- Initialize -->

const initializePopup = async () => {
  clearPreviousContents();
  let colors = await getWebsiteColors();
  createContents(colors);
}

initializePopup();