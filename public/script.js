const scroller = scrollama();
let intervals = []; // keeps track of all active intervals


scroller
    .setup({
        step: ".scene",
        offset: 0.75, // trigger when the scene is 3/4 in view
        debug: false // debug lines on / off
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit);

function handleStepEnter(response) {
    const element = response.element;
    const lines = element.querySelectorAll(".line");
    const images = element.querySelectorAll(".images img");

    // add animation class to lines
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add("animate");
        }, index * 500); // stagger the line animations
    });

    // image transitions
    if (images.length > 1) {
        let currentImageIndex = 0;

        // clear existing intervals for the current scene
        clearExistingIntervals(element);

        // make new interval for image transitions
        const interval = setInterval(() => {
            images[currentImageIndex].style.opacity = 0;
            currentImageIndex = (currentImageIndex + 1) % images.length;
            images[currentImageIndex].style.opacity = 1;
        }, 1500); // change image every 1.5 seconds

        // store the interval with a reference to the scene
        intervals.push({ element, interval });
    } else {
        // if there's only 1 image make sure it's visible
        images[0].style.opacity = 1;
    }
}

function handleStepExit(response) {
    const element = response.element;

    // remove animation classes and reset lines
    const lines = element.querySelectorAll(".line");
    lines.forEach(line => {
        line.classList.remove("animate");
    });

    // reset images opacity
    const images = element.querySelectorAll(".images img");
    images.forEach(img => {
        img.style.opacity = 0;
    });

    // clear the scenes intervals 
    clearExistingIntervals(element);
}

function clearExistingIntervals(element) {
    // find and clear intervals associated with the element
    intervals = intervals.filter(item => {
        if (item.element === element) {
            clearInterval(item.interval);
            return false;
        }
        return true;
    });
}

// initial setup to make sure only the first images are visible at the start
document.querySelectorAll(".scene").forEach(scene => {
    const images = scene.querySelectorAll(".images img");
    if (images.length > 0) {
        images[0].style.opacity = 1; // show the first image by default
    }
});


// mute button functionality
const muteButton = document.getElementById('mute-button');
const backgroundMusic = document.getElementById('background-music');

// change button icon / audio level when clicked
muteButton.addEventListener('click', () => {
    if (backgroundMusic.muted) {
        backgroundMusic.muted = false;
        muteButton.innerHTML = '<i class="fas fa-volume-high"></i>';
    } else {
        backgroundMusic.muted = true;
        muteButton.innerHTML = '<i class="fas fa-volume-xmark"></i>';
    }
    // audio starts playing after user interaction
    backgroundMusic.play();
});