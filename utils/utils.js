'use strict';

const trim = (str) => {
  return str.replace(/^\s+|\s+$/gm,'');
}

function standardizeColor(str) {
  let ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = str;
  let color = ctx.fillStyle.toUpperCase();
  return color;
}

const groupBy = (arrayOfStrings) => {
  let result = [];
  arrayOfStrings.forEach(element => {
    let array = element.split(':');
    let object = {
      type: array[0].trim(),
      colorCode: standardizeColor(array[1].trim()),
      count: 1
    }
    let isDuplicate = false;
    let resultIndex = null;
    result.forEach((colorObject, index) => {
      if (colorObject.type === object.type && colorObject.colorCode === object.colorCode) {
        isDuplicate = true;
        resultIndex = index;
      }
    });
    if (isDuplicate) {
      result[resultIndex].count++;
    } else {
      result.push(object);
    }
  });
  return result;
}


const findColors = (cssContent) => {
  let regex = /([^(\s|;)]*color[s?]*:)(\s?)((?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\))/ig;
  const matches = [...cssContent.match(regex)];
  let grouped = groupBy(matches);
  grouped.sort(compare);
  return grouped;
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
    colorsMerged.push( { colorCode: colorGrouped.colorCode, count: colorGrouped.count, type: "all" } )
   }
  });

  return colorsMerged;
}


const compare = (a, b) => {
  if (a.count > b.count) {
    return -1;
  }
  if (a.count < b.count) {
    return 1;
  }
  return 0;
}