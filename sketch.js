// P5 Code Here
const affirmations = [
  "You got this",
  "You'll figure it out",
  "You're a smart cookie",
  "I believe in you",
  "Sucking at something is the first step towards being good at something",
  "Struggling is part of learning",
  "Everything has cracks - that's how the light gets in",
  "Mistakes don't make you less capable",
  "We are all works in progress",
  "You are a capable human",
  "You know more than you think",
  "10x engineers are a myth",
  "If everything was easy you'd be bored",
  "I admire you for taking this on",
  "You're resourceful and clever",
  "You'll find a way",
  "I know you'll sort it out",
  "Struggling means you're learning",
  "You're doing a great job",
  "It'll feel magical when it's working",
  "I'm rooting for you",
  "Your mind is full of brilliant ideas",
  "You make a difference in the world by simply existing in it",
  "You are learning valuable lessons from yourself every day",
  "You are worthy and deserving of respect",
  "You know more than you knew yesterday",
  "You're an inspiration",
  "Your life is already a miracle of chance waiting for you to shape its destiny",
  "Your life is about to be incredible",
  "Nothing is impossible. The word itself says 'I’m possible!'",
  "Failure is just another way to learn how to do something right",
  "I give myself permission to do what is right for me",
  "You can do it",
  "It is not a sprint, it is a marathon. One step at a time",
  "Success is the progressive realization of a worthy goal",
  "People with goals succeed because they know where they’re going",
  "The opposite of courage in our society is not cowardice... it is conformity",
  "The past does not equal the future",
  "The path to success is to take massive, determined action",
  "It’s what you practice in private that you will be rewarded for in public",
  "Small progress is still progress",
  "Starting is the most difficult step - but you can do it",
  "Don't forget to enjoy the journey",
  "It's not a mistake, it's a learning opportunity",
];

// User inserted image
const imgUrl = document.getElementById("imgUrl");
const submit = document.getElementById("submit");

// Image OR solid color
let imageCanvas = false;

// Mouse in OR or out of canvas
let mouseInCanvas = false;

// Stores user's draw strokes
let strokes = [];
let discardedStrokes = [];
let shapes = [];

// Draw/Erase state
let erase = false;

// default brush settings
let p5Instance;
let canvas;
let loadedImg;
let brushColor = "#000000";
let brushSize = 4;

// Holds slider, brush color picker, etc.
const artToolsContainer1 = document.getElementById("art-tools-line-1");
// Holds eraser, undo, redo, and more
const artToolsContainer2 = document.getElementById("art-tools-line-2");
artToolsContainer1.style.display = "none";
artToolsContainer2.style.display = "none";

// Brush color picker
const colorPicker = document.createElement("input");
colorPicker.type = "color";
colorPicker.innerText = "Brush color";
colorPicker.value = brushColor;
artToolsContainer1.appendChild(colorPicker);

// Canvas color picker
const canvasColorPicker = document.getElementById("canvas-color-input");

// Brush size slider
const sizeSlider = document.createElement("input");
sizeSlider.type = "range";
sizeSlider.min = 1;
sizeSlider.max = 25;
sizeSlider.value = brushSize;
artToolsContainer1.appendChild(sizeSlider);

// Brush Preview
const brushPreview = document.createElement("div");
brushPreview.style.borderRadius = "50%";
brushPreview.style.background = brushColor;
brushPreview.style.width = brushSize + "px";
brushPreview.style.height = brushSize + "px";
artToolsContainer1.appendChild(brushPreview);

// Save button
const saveButton = document.createElement("button");
saveButton.textContent = "Download Drawing";
artToolsContainer1.appendChild(saveButton);

// Eraser button > Testing - Kal-el
const eraseButton = document.createElement("button");
eraseButton.textContent = "Eraser";
artToolsContainer2.appendChild(eraseButton);

// undo button > Testing - Kal-el
const undoButton = document.createElement("button");
undoButton.textContent = "Undo";
artToolsContainer2.appendChild(undoButton);

// redo button > Testing - Kal-el
const redoButton = document.createElement("button");
redoButton.textContent = "Redo";
artToolsContainer2.appendChild(redoButton);

// Button Responsivness
colorPicker.addEventListener("input", () => {
  brushColor = colorPicker.value;
  brushPreview.style.background = brushColor;
});

sizeSlider.addEventListener("input", () => {
  brushSize = parseInt(sizeSlider.value);
  brushPreview.style.width = brushSize + "px";
  brushPreview.style.height = brushSize + "px";
});

saveButton.addEventListener("click", () => {
  if (p5Instance && p5Instance.saveDrawing) {
    p5Instance.saveDrawing();
  }
});

undoButton.addEventListener("click", () => {
    // DEBUG
    console.log("UNDO BUTTON PRESSED");
    console.log("discardedStrokes BEFORE: " + JSON.stringify(discardedStrokes));
    console.log("strokes BEFORE: " + JSON.stringify(strokes));
    console.log("strokes length BEFORE: " + strokes.length);

    if (strokes.length > 0){ // prevents crash when undoing strokes that dont exist
        discardedStrokes.push(strokes[strokes.length - 1]);
        strokes.pop();
    }

    // DEBUG
    console.log("discardedStrokes AFTER: " + JSON.stringify(discardedStrokes));
    console.log("strokes AFTER: " + JSON.stringify(strokes));
    console.log("strokes length AFTER: " + strokes.length);

})

redoButton.addEventListener("click", () => {
    if (discardedStrokes.length > 0) { // prevents crash when redoing strokes that dont exist
        strokes.push(discardedStrokes[discardedStrokes.length - 1]);
        discardedStrokes.pop();
    }

})

canvasColorPicker.addEventListener("input", () => {});

/*
The Submit button AND canvas color button can
trigger a new canvas now (and other things) - Kal-el
*/
submit.onclick = canvasDraw;
canvasColorPicker.onchange = canvasDraw;

/* 
Canvas and art tools are now a reuseable function
Sorry for the bad function name - Kal-el
*/
function canvasDraw(event) {
  // After submit button is clicked (external image link)
  // Reveals art tools
  artToolsContainer1.style.display = "flex";
  artToolsContainer1.style.flexWrap = "wrap";
  artToolsContainer2.style.display = "flex";
  artToolsContainer2.style.flexWrap = "wrap";

  // Gets random affirmation
  const randomAffirmation =
    affirmations[Math.floor(Math.random() * affirmations.length)];

  // Removes p5 instance if already exists
  if (p5Instance) {
    p5Instance.remove();
  }

  // Creates p5 instance, canvas, and functions
  p5Instance = new p5((sketch) => {
    // Change logic based on what called the p5 canvas
    switch (event.target.id) {
      case "submit": // submit button
        imageCanvas = true;
        break;

      case "canvas-color-input": // canvas color button
        imageCanvas = false;
        break;
    }

    // draws affirmation inside white rectangle
    sketch.drawAffirmation = () => {
        sketch.noStroke();
        sketch.textAlign(sketch.CENTER);
        sketch.textSize(24);
        sketch.textWrap(sketch.WORD);
        sketch.fill(0);
        sketch.text(randomAffirmation, 0, 10, sketch.width - 40);
    };

    if (imageCanvas) {
      // Preloads user image
      sketch.preload = () => {
        loadedImg = sketch.loadImage(imgUrl.value, (img) => {
          /* 
                Shrinks image width for longer
                devices like phones. Image aspect 
                ratio is kept - Kal-el
                */
          loadedImg.resize(window.innerWidth, 0); // resize before drawing
          if (loadedImg.width > 474) {
            /*
                Passing 0 maintains aspect ratio. It
                does not shrink the image - Kal-el
                https://p5js.org/reference/p5.Image/resize/
                */
            loadedImg.resize(474, 0);
          }
        });
      };
    }

    // Creates canvas with image and affirmation
    sketch.setup = () => {
      if (imageCanvas) {
        // image canvas
        canvas = sketch.createCanvas(loadedImg.width, loadedImg.height + 100);
        sketch.background(255);
        sketch.image(loadedImg, 0, 100);
      } else {
        // plain color canvas
        if (window.innerWidth > 500) {
          canvas = sketch.createCanvas(500, 416);
          console.log("canvasColorPicker.value: " + canvasColorPicker.value);
          sketch.background(canvasColorPicker.value);
          sketch.fill(255, 255, 255);
          sketch.rect(0, 0, 500, 100);
        } else {
          // mobile canvas shrink
          canvas = sketch.createCanvas(window.innerWidth, 416);
          console.log("canvasColorPicker.value: " + canvasColorPicker.value);
          sketch.background(canvasColorPicker.value);
          sketch.fill(255, 255, 255);
          sketch.rect(0, 0, window.innerWidth, 100);
        }
        // White bar at top for affirmation
      }

      // When the mouse is OVER the canvas
      canvas.mouseOver(() => {
        mouseInCanvas = true;
      });
      // When the mouse moves OUT the canvas
      canvas.mouseOut(() => {
        mouseInCanvas = false;
      });

      // Prevents scrolling while drawing (mobile)
      canvas.elt.addEventListener("touchmove", function (event) {
        event.preventDefault();
      });
    };
    sketch.draw = () => {
        // 1️⃣ Clear/redraw background or image
        if (imageCanvas && loadedImg) {
          sketch.background(255);
          sketch.image(loadedImg, 0, 100);
        } else {
          sketch.noStroke(); 
          /* "noStroke" revents paint brush thickness from affecting 
          the rect and text elements.*/
          sketch.background(canvasColorPicker.value);
          sketch.fill(255);
          sketch.rect(0, 0, sketch.width, 100); // White bar for affirmation
          // 2️⃣ Draw affirmation text
          sketch.drawAffirmation();
        }
      

      
        // 3️⃣ Draw all previous strokes
        for (let i = 0; i < strokes.length; i++) {
          let strokeArr = strokes[i];
          for (let j = 0; j < strokeArr.length; j++) {
            let line = strokeArr[j];
            sketch.stroke(line.stroke);
            sketch.strokeWeight(line.strokeWeight);
            if (line.shape === "line") {
              sketch.line(line.px, line.py, line.x, line.y);
            }
          }
        }
      
        // 4️⃣ If mouse is pressed, draw new shapes
        if (
          sketch.mouseIsPressed &&
          sketch.mouseX > 0 &&
          sketch.mouseX < sketch.width &&
          sketch.mouseY > 100 &&
          sketch.mouseY < sketch.height
        ) {
          // Create a new line segment
          let newLine = {
            x: sketch.mouseX,
            y: sketch.mouseY,
            px: sketch.pmouseX,
            py: sketch.pmouseY,
            stroke: brushColor,
            strokeWeight: brushSize,
            shape: "line",
          };
          shapes.push(newLine);
      
          // Draw current shapes as you draw
          for (let i = 0; i < shapes.length; i++) {
            let shape = shapes[i];
            sketch.stroke(shape.stroke);
            sketch.strokeWeight(shape.strokeWeight);
            if (shape.shape === "line") {
              sketch.line(shape.px, shape.py, shape.x, shape.y);
            }
          }
        }
      };
      

    sketch.mousePressed = () => {
      console.log("MOUSE IS PRESSED");
      if (
        sketch.mouseIsPressed &&
        sketch.mouseX > 0 &&
        sketch.mouseX < sketch.width &&
        sketch.mouseY > 100 &&
        sketch.mouseY < sketch.height
      ) {
        mouseInCanvas = true;
      }

      // DEBUG
      console.log(mouseInCanvas);
      console.log("MouseY: " + sketch.mouseY);
      console.log("MouseY: " + sketch.mouseY);
    };

    sketch.mouseReleased = () => {
      console.log("MOUSE RELEASED");
      // Push a new array of copies of each line object
      /*
      To be 100000% honest, I have no idea how that .map
      line works. I've asked chatGPT to explain it to me like
      6 time and I'm.. I'm at the end of the line here. 
      */
      if (shapes.length > 0) {
        strokes.push(shapes.map(line => ({ ...line })));
        shapes = [];
      }

    };

    // Saves canvas to image file
    sketch.saveDrawing = () => {
      sketch.saveCanvas(canvas, randomAffirmation, "png");
    };
  });
}
