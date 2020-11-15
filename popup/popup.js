'use strict';

/**
 * Browser extension - Popup window main logic
 */

/**
 * Elements from popup HTML 
 */
const allContentDiv = document.getElementById("all-colors");
const bgContentDiv = document.getElementById("background-colors");
const textContentDiv = document.getElementById("text-colors");
const otherContentDiv = document.getElementById("other-colors");

// <-- Color element -->

/** 
 * HTML element for showing color count
 */
const createColorCountElement = (colorCount) => {
  let countDiv = document.createElement("div") 
  countDiv.className = "pill";
  countDiv.title = "Count of elements the color is used";
  countDiv.textContent = colorCount;
  return countDiv;
}

/** 
 * HTML element for showing color code
 */
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

/** 
 * HTML element for showing the each color and its info
 */
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

/** 
 * HTML element for showing tooltips
 */
const createTooltipElement = (parentDiv) => {
  let tooltipSpan = document.createElement("span");
  tooltipSpan.className = "tooltip";
  tooltipSpan.classList.add("tooltip-left")
  tooltipSpan.textContent = "Copy";
  
  parentDiv.classList.add("tooltippable");
  parentDiv.appendChild(tooltipSpan);
  parentDiv.addEventListener('mouseout', () => {
    updateTooltipTexts("Copy");
  });
}

/** 
 * Event to update tooltip text
 */
const updateTooltipTexts = (text) => {
  let toolTips = document.querySelectorAll(".tooltip");
  toolTips.forEach(tooltip => {
    tooltip.textContent = text;
  });
}

// <-- Tab contents -->

/** 
 * Creating "All" tab colors
 */
const createAllTabContent = (colorsByType) => { 
  let colorsByColorCode = joinByColorCode(colorsByType);
  colorsByColorCode.forEach(color => {
    allContentDiv.append(createColorElement(color));
  });
  createCopyAllListeners();
}

/** 
 * Creating grouped tab colors 
 */
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

/** 
 * Creating error content when colors can't be fetched
 */
const createErrorContent = () => {
  let tabContents = document.querySelectorAll(".panel-content");
  tabContents.forEach(tab => {
    let errorElement = document.createElement("span");
    errorElement.className = "error";
    errorElement.textContent = "Getting colors from this site is not supported.";
    tab.appendChild(errorElement);
  });
}

// <-- Copy to clipboard events -->

/** 
 * Adding event listeners for copy all buttons
 */
const createCopyAllListeners = () => {
  let copyAllButtons = document.querySelectorAll(".copy-all-button");
  copyAllButtons.forEach(button => {
    button.addEventListener('click', (result) => {
      copyAllOnClickEvent(result);
    });
    createTooltipElement(button);
  });
}

/** 
 * Reading color codes from current popup tab (for example "All") and copying those on user's clipboard 
 */
const copyAllOnClickEvent = () => {
  let colorPillDivs = document.querySelectorAll(".panel-active > .panel-content > .color-row > .tooltippable");
  let colorCodes = [];
  colorPillDivs.forEach(colorPill => {
    colorCodes.push(colorPill.firstChild.textContent);
  });
  copyToClipboard(colorCodes.toString());
  updateTooltipTexts("Copied!");
}

/** 
 * Reading color code of current color element and copying that on user's clipboard
 */
const copyOnClickEvent = (node) => {
  let colorCodeElement = node.target.firstChild;
  let text = colorCodeElement.textContent;
  copyToClipboard(text);
  updateTooltipTexts("Copied!");
}

// <-- Element clearing -->

/** 
 * Removes all the child element of the given array of elements
 */
const removeChildrenElements = (elements) => {
  elements.forEach(element => {
    while (element && element.firstChild) {
      element.firstChild.remove();
    }
  })
}

/** 
 * Resets the popup so the previous colors are removed
 */
const clearPreviousContents = () => {
  removeChildrenElements([allContentDiv, bgContentDiv, textContentDiv, otherContentDiv]);
}

// <-- Creating tab contents -->

/** 
 * Creating the color content for each popup's tab
 */
const createContents = (colors) => {
  if (colors) {
    createAllTabContent(colors);
    createGroupedTabsContents(colors);
  } else {
    createErrorContent();
  }  
}

// <-- Initialize -->

/** 
 * Initialization of the popup window
 */
const initializePopup = async () => {
  clearPreviousContents();
  let colors = await getWebsiteColors();
  createContents(colors);
}

// Runs on load
initializePopup();