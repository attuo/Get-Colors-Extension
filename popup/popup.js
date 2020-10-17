// 'use strict';
const regex = /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/ig;

const compare = (a, b) => {
  if (a.count > b.count) {
    return -1;
  }
  if (a.count < b.count) {
    return 1;
  }
  return 0;
}


const scrapeThePage = () => {
  const allHTML = document.documentElement.innerHTML;
  const allCSS = [...document.styleSheets]
  .map(styleSheet => {
    try {
      return [...styleSheet.cssRules]
        .map(rule => rule.cssText)
        .join('');
    } catch (e) {
      console.log('Access to stylesheet %s is denied. Ignoring...', styleSheet.href);
    }
  })
  .filter(Boolean)
  .join('\n');

  let content = {
    html: allHTML,
    css: allCSS
  }

  return content;
}

const startScrape = async () => {
  // Get the active tab
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  const tab = tabs[0];

  // We have to convert the function to a string
  const scriptToExec = `(${scrapeThePage})()`;

  // Run the script in the context of the tab
  const scraped = await browser.tabs.executeScript(tab.id, {
    code: scriptToExec
  });

  // Result will be an array of values from the execution
  // For testing this will be the same as the console output if you ran scriptToExec in the console
  console.log(scraped[0]);
  return scraped[0];
}

const findButton = document.getElementById("find");
const contentDiv = document.getElementById("content");

findButton.addEventListener('click', async () => {
  let content = await startScrape();
  findColors(content.css);
});


const findColors = (cssContent) => {
  const matches = [...cssContent.match(regex)];
  let grouped = groupBy(matches);
  grouped.sort(compare);
  grouped.forEach(element => {
    let newColor = document.createElement("div")
    newColor.style.backgroundColor = element.name;
    newColor.textContent = element.count;
    contentDiv.appendChild(newColor);
  });

}

const groupBy = (arrayOfStrings) => {
  // Iterate the input list and construct a grouping via a "reducer"
  var output = arrayOfStrings.reduce(function (grouping, item) {

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
    return {name: k, count: output[k]}; 
  });
  return countsExtended;
}

