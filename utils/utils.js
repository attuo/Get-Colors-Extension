const trim = (str) => {
  return str.replace(/^\s+|\s+$/gm,'');
}

function colorToRGBA(color) {
  // Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
  // color must be a valid canvas fillStyle. This will cover most anything
  // you'd want to use.
  // Examples:
  // colorToRGBA('red')  # [255, 0, 0, 255]
  // colorToRGBA('#f00') # [255, 0, 0, 255]
  var cvs, ctx;
  cvs = document.createElement('canvas');
  cvs.height = 1;
  cvs.width = 1;
  ctx = cvs.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  return ctx.getImageData(0, 0, 1, 1).data;
}

function byteToHex(num) {
  // Turns a number (0-255) into a 2-character hex number (00-ff)
  return ('0'+num.toString(16)).slice(-2);
}

function colorToHex(color) {
  // Convert any CSS color to a hex representation
  // Examples:
  // colorToHex('red')            # '#ff0000'
  // colorToHex('rgb(255, 0, 0)') # '#ff0000'
  var rgba, hex;
  rgba = colorToRGBA(color);
  hex = [0,1,2].map(
      function(idx) { return byteToHex(rgba[idx]); }
      ).join('');
  return "#" + hex.toUpperCase();;
}

const groupBy = (arrayOfStrings) => {
  // Iterate the input list and construct a grouping via a "reducer"
  let output = arrayOfStrings.reduce(function (grouping, item) {
    // If the current list item does not yet exist in grouping, set 
    // it's initial count to 1
    if (grouping[item] === undefined) {
      grouping[item] = 1;
    }
    // If current list item does exist in grouping, increment the 
    // count
    else {
      grouping[item]++;
    }
    return grouping;
  }, {})

  let countsExtended = Object.keys(output).map(k => {
    let hexValue = colorToHex(k);
    return {name: hexValue, count: output[k]}; 
  });
  return countsExtended;
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