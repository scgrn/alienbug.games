"use strict";

import { initGL, resetAlpha } from './static.js';

var button;

// Sets localStorage state
function setDarkModeLocalStorage(state) {
    localStorage.setItem("dark-mode", state);
}

function setButtonText() {
    if (darkModeState) {
        button.innerHTML = '[<a href="javascript:toggle()">Lights up</a>]';
    } else {
        button.innerHTML = '[<a href="javascript:toggle()">Lights out</a>]';
    }
}

function toggle() {
    darkModeState = !darkModeState;

    toggleDarkMode(darkModeState);
    setDarkModeLocalStorage(darkModeState);

    setButtonText();
}

function initToggle() {
    // https://www.ditdot.hr/en/dark-mode-website-tutorial
    
    button = document.getElementById("toggle-button");

    // MediaQueryList object
    const useDark = window.matchMedia("(prefers-color-scheme: dark)");

    // Listen for changes in the OS settings
    useDark.addListener((evt) => toggleDarkMode(evt.matches));

    toggleDarkMode(darkModeState);
    setButtonText();
}

function colorSVG(state, id) {
    let svg = document.getElementById(id);
    if (svg != null) {
        if (state == true) {
            svg.fill = "var(--color-fg) !important;";
            svg.stroke = "var(--color-fg) !important;";
        } else {
            svg.fill = "var(--color-bg) !important;";
            svg.stroke = "var(--color-bg) !important;";
        }
    } else {
        console.log("Couldn't find " + id);
    }
}

//  this needs to be called before the DOM is loaded to avoid a flash
//  (doesn't work)
function toggleDarkMode(state) {
    document.documentElement.classList.toggle("dark-mode", state);
    colorSVG(state, "logo");
    colorSVG(state, "hamburgerSVG");
    /*
    colorSVG(state, "shape-left-arrow");
    colorSVG(state, "shape-right-arrow");
    colorSVG(state, "arrow-right");
    */
    darkModeState = state;
    
    resetAlpha();
}

function initDropdown() {
    const menuItems = document.querySelectorAll('.dropdown-menu .dropdown-item');

    menuItems.forEach(item => {
        item.addEventListener("click", (event) => {
            let platformLabel = document.getElementById("selected-platform");
            platformLabel.innerHTML = event.target.innerText;
        });
    });
}

let darkModeState = localStorage.getItem("dark-mode") == "true";
toggleDarkMode(darkModeState);

document.addEventListener("DOMContentLoaded", function() {
    initToggle();
    initDropdown();
    initGL(document);
    
    window.toggle = toggle;
    window.resetAlpha = resetAlpha;
});
