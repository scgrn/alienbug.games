"use strict";

import data from './games.js';

function generateLightbox(container, index) {
    const screenshots = data[index].screenshots.split(",");

    //  clear previous screenshots in the lightbox
    const screenshotContainer = document.getElementById('screenshotContainer');
    screenshotContainer.innerHTML = '';

    //  populate the lightbox with screenshots
    screenshots.forEach((url, i) => {
        const itemClass = i === 0 ? 'carousel-item active' : 'carousel-item';
        const imgElement = document.createElement('img');
        imgElement.src = url;
        imgElement.className = 'd-block w-100';

        const carouselItem = document.createElement('div');
        carouselItem.className = itemClass;
        carouselItem.appendChild(imgElement);

        screenshotContainer.appendChild(carouselItem);
    });

    // show lightbox
    const lightbox = document.getElementById('gameLightbox');
    lightbox.style.display = 'block';

    //  add class to disable scrolling
    document.body.classList.add('lightbox-open');
}

function generateThumbnail(container, index) {
    const thumbnail = document.createElement("img");
    thumbnail.className += "thumbnail";
    thumbnail.setAttribute("src", data[index].thumbnail);
    container.appendChild(thumbnail);

    thumbnail.addEventListener('click', function() {
        generateLightbox(container, index);
    });

    container.appendChild(thumbnail);
}

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
    
