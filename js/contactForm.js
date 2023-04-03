"use strict";

var recaptchaToken = 0;

export function recaptchaCallback(token) {
    recaptchaToken = token;
}

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
    object["recaptchaToken"] = recaptchaToken;
    
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
        response.clone().json().then((data) => {
            grecaptcha.reset();

            status.innerHTML = data.message;
            if (data.code == 1) {
                status.classList.remove("error");
                form.reset();
            } else {
                status.classList.add("error");
            }        }).catch((error) => {
            grecaptcha.reset();
            console.log(error);
            status.classList.add("error");
            status.innerHTML = "Something went wrong!";
        }).then(function () {
            setTimeout(() => {
                status.classList.remove("error");
                status.innerHTML = "&nbsp;";
            }, 5000);
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    window.sendMail = sendMail
    window.recaptchaCallback = recaptchaCallback;
});
