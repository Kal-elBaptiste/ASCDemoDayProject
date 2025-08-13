// Miscellaneous non-P5 code

// [Local Storage Code]
// Only runs when on index.html
if (window.location.pathname.endsWith("/") || window.location.pathname.endsWith("/index.html")) {
    console.log("About page script running"); // Debug

     // Sends url to local storage anytime it changes
    imgUrl.addEventListener("input", (event) => {
        localStorage.setItem("imgUrlValue", JSON.stringify(imgUrl.value));
        console.log("img url value: " + imgUrl.value); // Debug
    })

    // Loads saved url when the page is reloaded 
    window.onload = function() { // runs when window is loaded
        if (localStorage.getItem("imgUrlValue")) {
        imgUrl.value = JSON.parse(localStorage.getItem("imgUrlValue"));
        console.log("loaded url value: " + imgUrl.value); // Debug
        };
    }

}

// [Automatic Button Resizing]
let navigator = document.querySelector("nav");
let navDivInputs = document.getElementsByClassName("nav-button");

// Button size is %, gap is in px
function spaceBetween(elementList, container, gap){
    let containerWidth = container.offsetWidth;
    for (let i = 0; i < elementList.length; i++) {
        console.log(`Element List Width BEFORE: ${elementList[i].style.width}`);
        let width = (containerWidth - (gap * (elementList.length + 1))) / elementList.length;
        elementList[i].style.width = `${width}px`;
        console.log(`Element List Width AFTER: ${elementList[i].style.width}`);        
    }
}

/* 
Evenly spaces out the "Draw" 
and "View Drawings" buttons
*/
spaceBetween(navDivInputs, navigator, 10);