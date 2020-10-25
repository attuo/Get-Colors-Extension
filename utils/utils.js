const trim = (str) => {
  return str.replace(/^\s+|\s+$/gm,'');
}

function standardizeColor(str) {
  var ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = str;
  return ctx.fillStyle.toUpperCase();
}

const groupBy = (arrayOfStrings) => {
  let result = [];
  arrayOfStrings.forEach(element => {
    let array = element.split(':');
    let object = {
      type: array[0].trim(),
      color: standardizeColor(array[1].trim()),
      count: 1
    }
    let isDuplicate = false;
    let resultIndex = null;
    result.forEach((colorObject, index) => {
      if (colorObject.type === object.type && colorObject.color === object.color) {
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

const groupByType = (arrayOfColors) => {
	let dict = {};
  arrayOfColors.forEach(color => {
  	let found = dict[color.type];
    if (!found) dict[color.type] = [{ color: color.color, count: color.count }];
    else dict[color.type].push ({ color: color.color, count: color.count });
  });
  return dict;
}


const findColors = (cssContent) => {
  let regex = /(background-color|color):(\s?)((?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\))/ig;
  const matches = [...cssContent.match(regex)];
  let grouped = groupBy(matches);
  grouped.sort(compare);
  return grouped;
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