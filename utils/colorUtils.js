'use strict';

// <-- Color utilities --> 

/**
 * Compares the color counts
 *  Used with .sort()
 */
const compareColorCounts = (colorA, colorB) => {
  if (colorA.count > colorB.count) { return -1; }
  if (colorA.count < colorB.count) { return 1; }
  return 0;
}

/**
 * Handy little "hack" for standardizing given color code to be primarily HEX or RGBA (if has opacity)
 *  For example "white" becomes "#FFFFFF" and RGB(255,255,255) also becomes #FFFFF. However, RGBA(255, 255, 255, 0)
 *  becomes RGBA(255, 255, 255, 0), so the possible opacity does not disappear.
 * 
 *  TODO: If the RGBA value is used, but the opacity is 0 then hex value should be used. Now it shows for example 
 *  RGBA(255, 255, 255, 0), instead it should transfer that to #FFFFFF
 */
const standardizeColor = (str) => {
  let ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = str;
  let color = ctx.fillStyle.toUpperCase();
  return color;
}

// <-- Color grouping -->

/**
 * For creating the color object that is used for presenting colors 
 * @param {string} colorType - For example "Background-color" (css attribute the color is used)
 * @param {string} colorCode - For example #FFFFFF
 * @param {int} colorCount   - For example 1 (how many times the color is used on website)
 */
const createColorObject = (colorType, colorCode, colorCount) => { 
  return {
    type: colorType,
    colorCode: colorCode,
    count: colorCount
  };
}

/**
 * Creates the color object from given color and type string
 * @param {string} colorAndType - For example "Background-color: #fffff"
 */
const parseNewColorObject = (colorAndType) => {
  let splitted = colorAndType.split(':');
  let colorType = splitted[0].trim(); // -> e.g. "Background-color"
  let colorCode = standardizeColor(splitted[1].trim()); // -> eg. "#fffff"
  return createColorObject(colorType, colorCode, 1);
}

/**
 * Adding the new color for given color 
 * @param {array} colorArray      - Array of color color object
 * @param {object} newColorObject - Color object
 */
const addToGroupedByColorTypeArray = (colorArray, newColorObject) => {
  let duplicateIndex = null;
  colorArray.forEach((colorObject, index) => {
    if (colorObject.type === newColorObject.type && colorObject.colorCode === newColorObject.colorCode) {
      duplicateIndex = index;
      return;
    }
  });
  (duplicateIndex) ? 
    colorArray[duplicateIndex].count++ : 
    colorArray.push(newColorObject);
}

/**
 * Groups the colors by their css attribute type, for example "background-color" and "color"
 * @param {array} colorAndTypeArray - Raw array of color attribute and color code - "Background-color: #fffff"
 */
const groupByColorType = (colorAndTypeArray) => {
  let groupedByColorTypeArray = [];
  colorAndTypeArray.forEach(colorAndType => {
    let newColorObject = parseNewColorObject(colorAndType);
    addToGroupedByColorTypeArray(groupedByColorTypeArray, newColorObject);
  });
  return groupedByColorTypeArray;
}

/**
 * Joins the grouped colors by their color code
 * @param {array} colorsByColorType - Grouped by color type
 */
const joinByColorCode = (colorsByColorType) => {
  let colorsByColorCode = [];
  colorsByColorType.forEach(colorByType => {
    let isNew = true;
    colorsByColorCode.forEach(colorByCode => {
      if (colorByCode.colorCode === colorByType.colorCode) {
        colorByCode.count += colorByType.count;
        isNew = false;
        return;
      }
    });
    if (isNew) {
      colorsByColorCode.push(createColorObject(colorByType.type, colorByType.colorCode, colorByType.count));
    }
  });
  colorsByColorCode.sort(compareColorCounts);
  return colorsByColorCode;
}

// <-- Finding colors -->

/**
 * Finds the wanted css attributes and those color codes from css string
 * @param {string} cssContent - whole CSS from website 
 */
const findColorsWithRegex = (cssContent) => {
  // Finds all the colors and css attribute name for each color
  // For example: background-color: #FFFFFF and color: RGB(255,255,255)
  // Kinda hack, but works. TODO: Might wanna find better solution for this someday
  let regex = /([^(\s|;)]*color[s?]*:)(\s?)((?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\))/ig;
  const matches = [...cssContent.match(regex)];
  return matches;
}

/**
 * Finds the color attributes and color codes from given css and groups them by their css attribute 
 * @param {string} cssContent - whole CSS from website 
 */
const findColors = (cssContent) => {
  let foundColors = findColorsWithRegex(cssContent);
  let groupedColors = groupByColorType(foundColors);
  groupedColors.sort(compareColorCounts);
  return groupedColors;
}

/**
 * Fetches the current tab's website content and then finds and processes used colors from its css
 */
const getWebsiteColors = async () => {
  let websiteContent = await getActiveTabContent();
  if (websiteContent && websiteContent.css) { 
    let colors = findColors(websiteContent.css);
    return colors; 
  }
}