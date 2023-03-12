"use strict";

import data from './games.js';

function generateLightbox(container, index) {
    const modalName = "modal" + index;
    const carouselName = "carousel" + index;

    container.setAttribute("data-bs-toggle", "modal");
    container.setAttribute("data-bs-target", "#" + modalName);

    const thumbnail = document.createElement("img");
    thumbnail.className += "thumbnail";
    thumbnail.setAttribute("src", data[index].thumbnail);
    thumbnail.setAttribute("data-bs-target", "#" + carouselName);
    thumbnail.setAttribute("data-bs-slide-to", "0");
    container.appendChild(thumbnail);

    const lightbox = document.createElement("div");
    lightbox.id = modalName;
    lightbox.className += "modal fade";
    lightbox.setAttribute("tabindex", "-1");
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-hidden", "true");
        
    var screenshotsMarkup = "";
    const screenshots = data[index].screenshots.split(",");
    var first = true;
    for (var i = 0; i < screenshots.length; i++) {
        screenshotsMarkup += '<div class="carousel-item ' + (first ? ' active' : '') +'">' +
            '<img class="d-block" src="' + screenshots[i] + '" alt="Screenshot' + (i + 1) + '"/></div>';
        first = false;
    }
    /*
    lightbox.innerHTML = `
        <div class="lightbox modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <div id="${carouselName}" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            ${screenshotsMarkup}
                        </div>

                        <a class="carousel-control-prev lightbox" href="#${carouselName}" role="button" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </a>
                        <a class="carousel-control-next lightbox" href="#${carouselName}" role="button" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </a>
                    
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>

            </div>
        </div>
    `;
    */
    
    lightbox.innerHTML = `
        <div class="lightbox modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <div id="${carouselName}" class="carousel slide" data-bs-ride="carousel">
                        <div class="container-flex">
                            <div class="carousel-inner">
                                ${screenshotsMarkup}
                            </div>
                        </div>

                        <a class="carousel-control-prev lightbox" href="#${carouselName}" role="button" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </a>
                        <a class="carousel-control-next lightbox" href="#${carouselName}" role="button" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </a>
                    
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>

            </div>
        </div>
    `;

    document.body.appendChild(lightbox);
}

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
        generateLightbox(thumbnail, i);
        
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
}

document.addEventListener("DOMContentLoaded", function() {
    addGames();
    window.filterGames = filterGames;
});
    