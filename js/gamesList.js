"use strict";

import data from './games.js';

function generateLightbox(index) {
    var screenshotsMarkup = "";
    const screenshots = data[index].screenshots.split(",");
    var first = true;
    for (var i = 0; i < screenshots.length; i++) {
        screenshotsMarkup += '<div class="carousel-item ' + (first ? ' active' : '') +'">' +
            '<img src="' + screenshots[i] + '" class="d-block w-100" alt="Screenshot' + (i + 1) + '"/></div>';
        first = false;
    }
    
    var carousel = document.getElementById("carousel-inner");
    carousel.innerHTML = screenshotsMarkup;
    
    var lightbox = document.getElementById("lightbox");
    var modal = bootstrap.Modal.getInstance(lightbox);
    modal.show();
}

function generateThumbnail(container, index) {
    const thumbnail = document.createElement("img");
    thumbnail.className += "thumbnail";
    thumbnail.setAttribute("src", data[index].thumbnail);

    thumbnail.setAttribute("data-bs-slide-to", "0");
    thumbnail.setAttribute("data-bs-toggle", "modal");
    thumbnail.setAttribute("data-bs-target", "#lightbox");
    thumbnail.addEventListener('click', function() {
        generateLightbox(index);
    });

    container.appendChild(thumbnail);
}

/*
function closeLightbox() {
    const lightbox = document.getElementById('gameLightbox');
    lightbox.style.display = 'none';

    //  remove class to enable scrolling
    document.body.classList.remove('lightbox-open');
}

//  close the lightbox when clicking outside the carousel
document.getElementById('gameLightbox').addEventListener('click', function (e) {
    if (e.target === this) {
        closeLightbox();
    }
});

//  close the lightbox when clicking the close button
document.querySelector('.lightbox-content').addEventListener('click', function (e) {
    if (e.target.classList.contains('carousel-control-prev-icon') || e.target.classList.contains('carousel-control-next-icon')) {
        return;
    }
    closeLightbox();
});
*/

function addGames() {
    var container= document.getElementById("games");

    var count = Object.keys(data).length;
    for (var i = 0; i < count; i++) {
        const element = document.createElement("div");
        element.id = "game-index-" + i
        element.className += "game-card row border mb-5 mx-1 p-3 pt-5 " + data[i].platformClasses;
        
        const thumbnail = document.createElement("div");
        thumbnail.id = "thumbnail" + i;
        thumbnail.className += "col-md-4 mb-4 text-center";
        generateThumbnail(thumbnail, i);

        const description = document.createElement("div");
        description.className += "col-md-8";
        description.innerHTML +=  `
            <h4 class="game-title border-bottom pb-2"><strong>${data[i].title}</strong></h4>
            <p><em>${data[i].platforms}</em></p>
            <p style="font-size: 0.8em;">${data[i].description}</p>
            <p class="game-links border-top pt-2">${data[i].links}</p>`;

        element.appendChild(thumbnail);
        element.appendChild(description);

        container.appendChild(element);
    }

    console.log(i + " games total");
}

function filterGames(platform) {
    var allGames = document.getElementsByClassName("game-card");
    
    if (platform == "all") {
        for(var i = 0; i < allGames.length; i++) {
            allGames[i].style.display = "flex";
        }
    } else {
        for(var i = 0; i < allGames.length; i++) {
            allGames[i].style.display = "none";
        }
        
        var selectedGames = document.getElementsByClassName("platform-" + platform);
        for(var i = 0; i < selectedGames.length; i++) {
            selectedGames[i].style.display = "flex";
        }
    }

    resetAlpha();
}

document.addEventListener("DOMContentLoaded", function() {
    addGames();
    window.filterGames = filterGames;
});

