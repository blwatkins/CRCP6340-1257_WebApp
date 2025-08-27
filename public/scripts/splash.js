// TODO - fix const capitalization
const canvasId = 'splashCanvas';
const circles = [];
const maxCircles = 100;
let circleTimer;
const minDuration = 500;
const maxDuration = 5_000;

function setup() {
    const canvas = document.getElementById(canvasId);
    createCanvas(canvas.offsetWidth, canvas.offsetHeight, canvas);
    updateCanvasSize();
    circleTimer = new Timer(Math.ceil(random(minDuration, maxDuration)));
}

function draw() {
    background(255);
    h1("brittni watkins", width / 2, (height / 2.0) - 100);
    h2("Fall 2025 NFTs", width / 2, (height / 2.0));

    circles.forEach(circle => {
        circle.draw();
        circle.update();
    });

    addCircles();
    removeCircles();
}

function addCircles() {
    if (circles.length < maxCircles && circleTimer.isDone()) {
        circles.push(buildCircle());
        circleTimer.reset();
        circleTimer.setDuration(Math.ceil(random(minDuration, maxDuration)));
    }
}

function removeCircles() {
    for (let i = circles.length - 1; i >= 0; i--) {
        if (circles[i].isDone()) {
            circles.splice(i, 1);
        }
    }
}

function buildCircle() {
    const position = createVector(random(width), random(height));
    const diameter = random(50, 150);
    const c = color(random(255), random(255), random(255));
    return (new Circle(position, diameter, c));
}

function h1(textContent, x, y) {
    rectMode(CENTER);
    textSize(64);
    fill(255);
    textAlign(CENTER, CENTER);
    text(textContent, x, y, width);
}

function h2(textContent, x, y) {
    rectMode(CENTER);
    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);
    text(textContent, x, y, width);
}

function windowResized() {
    updateCanvasSize();
}

function updateCanvasSize() {
    const canvas = document.getElementById(canvasId);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    resizeCanvas(canvas.width, canvas.height);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
}

class Circle {
    constructor(position, diameter, c) {
        this.position = position;
        this.diameter = diameter;
        this.color = c;
        this.alpha = 0;
        this.color.setAlpha(this.alpha);
        this.state = 'start';
        this.timer = new Timer(Math.ceil(random(25, 1000)));
    }

    fadeIn() {
        if (this.alpha < 255) {
            if (this.timer.isDone()){
                this.alpha += 1;
                this.color.setAlpha(this.alpha);
                this.state = 'fadingIn';
                this.timer.reset();
            }
        } else {
            this.state = 'opaque';
        }
    }

    fadeOut() {
        if (this.alpha > 0) {
            if (this.timer.isDone()) {
                this.alpha -= 1;
                this.color.setAlpha(this.alpha);
                this.state = 'fadingOut';
                this.timer.reset();
            }
        } else {
            this.state = 'end';
        }
    }

    isDone() {
        return this.state === 'end';
    }

    draw() {
        fill(this.color);
        noStroke();
        ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
    }

    update() {
        if (this.state === 'start' || this.state === 'fadingIn') {
            this.fadeIn();
        } else if (this.state === 'opaque' || this.state === 'fadingOut') {
            this.fadeOut();
        }
    }
}

class Timer {
    constructor(durationMillis) {
        this.durationMillis = durationMillis;
        this.startTime = millis();
    }

    isDone() {
        return (millis() > (this.startTime + this.durationMillis));
    }

    reset() {
        this.startTime = millis();
    }

    setDuration(durationMillis) {
        this.durationMillis = durationMillis;
    }
}
