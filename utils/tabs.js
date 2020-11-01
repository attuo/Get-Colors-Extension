const tabs = document.querySelectorAll(".tabs > .tab");
const panels = document.querySelectorAll(".panels > .panel");

const deActivateElements = () => {
  tabs.forEach(navTab => {
    navTab.classList.remove("active");
  });
  
  panels.forEach(panel => {
    panel.classList.remove("active");
  })
}

const activateElements = (tabEvent) => {
  tabEvent.target.classList.add('active');
  let panelId = tabEvent.target.getAttribute('data-target');
  document.getElementById(panelId).classList.add("active");
}

// 
const onTabClick = (tabEvent) => {
  deActivateElements();
  activateElements(tabEvent);
}

// Add click listeners
tabs.forEach(navTab => {
  navTab.addEventListener('click', onTabClick, false);
});

