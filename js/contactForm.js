"use strict";

export function sendMail() {
    var status =  document.getElementById("status");
    status.innerHTML = "Sending...";

    var form = document.getElementById("contactForm");
    const formData = new FormData(form);
    formData.set("recipient", "admin@alienbug.games");

    var object = {};
    formData.forEach((value, key) => {
        object[key] = value;
    });
    var json = JSON.stringify(object);

    fetch('https://alienbug.games/contactForm/contact.php', {
        method: "POST",
        // mode: 'no-cors'
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: json
    }).then(async (response) => {
        console.log(response);
        response.clone().json().then((data) => {
            console.log(data);

            status.innerHTML = data.message;
            if (data.code == 1) {
                form.reset();
            }
        }).catch((error) => {
            console.log(error);
            status.innerHTML = "Something went wrong!";
        }).then(function () {
            setTimeout(() => {
                status.innerHTML = "&nbsp;";
            }, 5000);
        });
    });
}

function start() {
    window.sendMail = sendMail;
}

document.addEventListener("DOMContentLoaded", start);
