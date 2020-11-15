'use strict';

/**
 * Popup window's tab functionality
 */

/**
 * Elements from popup HTML 
 */
const tabs = document.querySelectorAll(".tabs > .tab");
const panels = document.querySelectorAll(".panels > .panel");

/**
 * Tab and panel has active class, which is only on one tab and panel
 */
const deActivateElements = () => {
  tabs.forEach(navTab => {
    navTab.classList.remove("tab-active");
  });
  panels.forEach(panel => {
    panel.classList.remove("panel-active");
  })
}

/**
 * On tab click changes the active tab to the target tab
 */
const activateElements = (tabEvent) => {
  tabEvent.target.classList.add('tab-active');
  let panelId = tabEvent.target.getAttribute('data-target');
  document.getElementById(panelId).classList.add("panel-active");
}

/**
 * Event for first deactivating each tab and then activating the target tab
 */ 
const onTabClick = (tabEvent) => {
  deActivateElements();
  activateElements(tabEvent);
}

/**
 * Adds click functinality for each tab
 */
const initializeTabs = () => {
  tabs.forEach(navTab => {
    navTab.addEventListener('click', onTabClick, false);
  });
}

// Runs on load
initializeTabs();