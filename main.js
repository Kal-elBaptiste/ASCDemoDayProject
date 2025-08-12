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

// default brush settings
let p5Instance;
let canvas;
let loadedImg;
let brushColor = '#000000';
let brushSize = 4;

// Holds slider, color picker, etc.
const artToolsContainer = document.getElementById("art-tools-div");
artToolsContainer.style.display = "none";

// Brush color picker
const colorPicker = document.createElement('input');
colorPicker.type = 'color';
colorPicker.value = brushColor;
artToolsContainer.appendChild(colorPicker);

// Brush size slider
const sizeSlider = document.createElement('input');
sizeSlider.type = 'range';
sizeSlider.min = 1;
sizeSlider.max = 25;
sizeSlider.value = brushSize;
artToolsContainer.appendChild(sizeSlider);

// Brush Preview
const brushPreview = document.createElement('div');
brushPreview.style.borderRadius = '50%';
brushPreview.style.background = brushColor;
brushPreview.style.width = brushSize + 'px';
brushPreview.style.height = brushSize + 'px';
artToolsContainer.appendChild(brushPreview);

// Save button
const saveButton = document.createElement('button');
saveButton.textContent = 'Save Drawing';
artToolsContainer.appendChild(saveButton);

// Button Responsivness
colorPicker.addEventListener('input', () => {
    brushColor = colorPicker.value;
    brushPreview.style.background = brushColor;
});

sizeSlider.addEventListener('input', () => {
    brushSize = parseInt(sizeSlider.value);
    brushPreview.style.width = brushSize + 'px';
    brushPreview.style.height = brushSize + 'px';
});

saveButton.addEventListener('click', () => {
    if (p5Instance && p5Instance.saveDrawing) {
        p5Instance.saveDrawing();
    }
});

// After submit button is clicked (external image link)
submit.onclick = () => {
    // Reveals art tools 
    artToolsContainer.style.display = "flex";
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

    // Removes p5 instance if already exists
    if (p5Instance) {
        p5Instance.remove();
    }

    // Creates p5 instance, canvas, and functions
    p5Instance = new p5((sketch) => {
        // Prelloads user image 
        sketch.preload = () => {
            loadedImg = sketch.loadImage(imgUrl.value);
        };

        // Creates canvas with image and affirmation
        sketch.setup = () => {
            canvas = sketch.createCanvas(loadedImg.width, loadedImg.height + 100);
            sketch.background(255);
            sketch.textAlign(sketch.CENTER);
            sketch.textSize(24);
            sketch.textWrap(sketch.WORD);
            sketch.fill(0);
            sketch.text(randomAffirmation, 0, 10, sketch.width - 40);
            sketch.image(loadedImg, 0, 100);
        };

        // Draw when user clicks
        sketch.draw = () => {
            /* 
            I (Kal-El) think the if statement should be changed to thh
            condition below to avoid unintentional canvas coloring by
            the user.

            if (sketch.mouseIsPressed && mouseX > 0 && mouse X < sketch.width && mouseY > 0 && mouseY < sketch.height)

            "In 2D mode, mouseX keeps track of the mouse's position relative 
            to the top-left corner of the canvas. For example, if the mouse 
            is 50 pixels from the left edge of the canvas, then mouseX will 
            be 50." - https://p5js.org/reference/p5/mouseX/
            */
            if (sketch.mouseIsPressed) {
                /*
                The logic for having multiple brush shapes can be done 
                here if we're still doing that.  - Kal-EL
                */
                sketch.stroke(brushColor);
                sketch.strokeWeight(brushSize);
                sketch.line(sketch.pmouseX, sketch.pmouseY, sketch.mouseX, sketch.mouseY);
            }
        };

        // Saves canvas to image file
        sketch.saveDrawing = () => {
            sketch.saveCanvas(canvas, affirmations, 'png');
        }
    });
};