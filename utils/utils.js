'use strict';

// <-- Copy to clipboard -->

const copyToClipboard = (text) => {
  if (!navigator.clipboard) {
    console.error("Clipboard permission is not allowed");
    return;
  }
  navigator.clipboard.writeText(text).then(() => {},
    (err) => {
      console.error("Could not copy text: ", err);
    });
}

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

const groupBy = (arrayOfStrings) => {
  let result = [];
  arrayOfStrings.forEach(element => {
    let array = element.split(':');
    let newColorObject = createColorObject(array[0].trim(), standardizeColor(array[1].trim()), 1);
    let isDuplicate = false;
    let resultIndex = null;
    result.forEach((colorObject, index) => {
      if (colorObject.type === newColorObject.type && colorObject.colorCode === newColorObject.colorCode) {
        isDuplicate = true;
        resultIndex = index;
      }
    });
    if (isDuplicate) {
      result[resultIndex].count++;
    } else {
      result.push(newColorObject);
    }
  });
  return result;
}

const mergeColors = (colorsGrouped) => {
  let colorsMerged = [];
  colorsGrouped.forEach(colorGrouped => {
    let isNew = true;
    colorsMerged.forEach(colorMerged => {
      if (colorMerged.colorCode === colorGrouped.colorCode) {
        colorMerged.count += colorGrouped.count;
        isNew = false;
      }
    });
    if (isNew) {
      colorsMerged.push(createColorObject(colorGrouped.type, colorGrouped.colorCode, colorGrouped.count));
    }
  });
  colorsMerged.sort(compareColorCounts);
  return colorsMerged;
}

// <-- Parsing the colors from css -->

const findColors = (cssContent) => {
  let regex = /([^(\s|;)]*color[s?]*:)(\s?)((?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\))/ig;
  const matches = [...cssContent.match(regex)];
  let grouped = groupBy(matches);
  grouped.sort(compareColorCounts);
  return grouped;
}