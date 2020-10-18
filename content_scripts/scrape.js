(function() {
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
})();