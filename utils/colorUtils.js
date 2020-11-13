'use strict';

// <-- Color utilities --> 

const compareColorCounts = (colorA, colorB) => {
  if (colorA.count > colorB.count) { return -1; }
  if (colorA.count < colorB.count) { return 1; }
  return 0;
}

const standardizeColor = (str) => {
  let ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = str;
  let color = ctx.fillStyle.toUpperCase();
  return color;
}

// <-- Color grouping -->

const createColorObject = (colorType, colorCode, colorCount) => { 
  return {
    type: colorType,
    colorCode: colorCode,
    count: colorCount
  };
}

const parseNewColorObject = (colorAndType) => {
  let splitted = colorAndType.split(':');
  let colorType = splitted[0].trim();
  let colorCode = standardizeColor(splitted[1].trim());
  return createColorObject(colorType, colorCode, 1);
}

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

const groupByColorType = (colorAndTypeArray) => {
  let groupedByColorTypeArray = [];
  colorAndTypeArray.forEach(colorAndType => {
    let newColorObject = parseNewColorObject(colorAndType);
    addToGroupedByColorTypeArray(groupedByColorTypeArray, newColorObject);
  });
  return groupedByColorTypeArray;
}

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

// <-- Finding colors from website and parsing the colors from css -->

const findColorsWithRegex = (cssContent) => {
  // Finds all the colors and css attribute name for each color
  // For example: background-color: #FFFFFF and color: RGB(255,255,255)
  let regex = /([^(\s|;)]*color[s?]*:)(\s?)((?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\))/ig;
  const matches = [...cssContent.match(regex)];
  return matches;
}

const findColors = (cssContent) => {
  let foundColors = findColorsWithRegex(cssContent);
  let groupedColors = groupByColorType(foundColors);
  groupedColors.sort(compareColorCounts);
  return groupedColors;
}

const getWebsiteColors = async () => {
  let websiteContent = await getCurrentActiveTabContent();
  if (websiteContent && websiteContent.css) { 
    let colors = findColors(websiteContent.css);
    return colors; 
  }
}