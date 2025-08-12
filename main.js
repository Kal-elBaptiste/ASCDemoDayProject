// Miscellaneous non-P5 code

// Local storage
// User inserted image

/* 
// Displays user-typed adlib title to screen
title.addEventListener("input", (event) => {
    console.log(event);
    mainTitle.innerText = title.value;
})

*/
// Only runs when on index.html
if (window.location.pathname.endsWith("/" || "index.html")) {
    console.log("About page script running");
        // Sends url to local storage anytime it changes
    imgUrl.addEventListener("input", (event) => {
        localStorage.setItem("imgUrlValue", JSON.stringify(imgUrl.value));
        console.log("img url value: " + imgUrl.value);
    })

    // Loads saved url when the page is reloaded 
    window.onload = function() { // runs when window is loaded
        if (localStorage.getItem("imgUrlValue")) {
        imgUrl.value = JSON.parse(localStorage.getItem("imgUrlValue"));
        console.log("loaded url value: " + imgUrl.value);
        };
    }

}




//localStorage.setItem("imgUrlValue", imgUrl.value);