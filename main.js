//               [Miscellaneous non-P5 code]

const inHomePage = window.location.pathname.endsWith("/") || window.location.pathname.endsWith("/index.html");
let navigator = document.querySelector("nav");
let navDivInputs = document.getElementsByClassName("nav-button");

// Event listener function for window
function preventRefresh(event){
    event.preventDefault();  
    event.returnValue = ''; // This triggers the confirmation dialog
}

// Tries to block refreshes on home page
if (inHomePage){
    window.addEventListener('beforeunload', preventRefresh);
}
else {
    window.removeEventListener('beforeunload', preventRefresh);
}




//                     [Local Storage Code]
// Only runs when on index.html
if (inHomePage) {

     // Sends url to local storage anytime it changes
    imgUrl.addEventListener("input", (event) => {
        localStorage.setItem("imgUrlValue", JSON.stringify(imgUrl.value));
        console.log("img url value: " + imgUrl.value); // Debug
    })

    // Loads saved url when the page is reloaded 
    window.onload = function() { // runs when window is loaded
        if (localStorage.getItem("imgUrlValue")) {
        imgUrl.value = JSON.parse(localStorage.getItem("imgUrlValue"));
        };
    }
}

//                   [Automatic Button Resizing]
// Button size is %, gap is in px
function spaceBetween(elementList, container, gap){
    let containerWidth = container.offsetWidth;
    
    for (let i = 0; i < elementList.length; i++) {
        let width = (containerWidth - (gap * (elementList.length + 1))) / elementList.length;
        elementList[i].style.width = `${width}px`;
    }
}

/* 
Evenly spaces out the "Draw" 
and "View Drawings" buttons
*/
spaceBetween(navDivInputs, navigator, 10);

