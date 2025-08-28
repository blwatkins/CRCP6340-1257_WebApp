const CANVAS_ID = 'splashCanvas';
const MAX_CIRCLES = 100;
const MIN_DURATION_MILLIS = 500;
const MAX_DURATION_MILLIS = 5000;

let circles = [];
let circleTimer;

function setup() {
    const canvas = document.getElementById(CANVAS_ID);
    createCanvas(canvas.offsetWidth, canvas.offsetHeight, canvas);
    updateCanvasSize();
    circleTimer = new Timer(MIN_DURATION_MILLIS);
}

function draw() {
    background(255);
    
    circles.forEach(circle => {
        circle.draw();
        circle.update();
    });

    addCircles();
    removeCircles();

    h1("brittni watkins", color(0), width / 2, (height / 2.0) - 100);
    h2("Fall 2025 NFTs", color(0), width / 2, (height / 2.0));
}

function addCircles() {
    if (circles.length < MAX_CIRCLES && circleTimer.isDone()) {
        circles.push(buildCircle());
        circleTimer.reset();
        circleTimer.setDuration(Math.ceil(random(MIN_DURATION_MILLIS, MAX_DURATION_MILLIS)));
    }
}

function removeCircles() {
    let activeCircles = circles.filter(circle => !circle.isDone());
    circles = activeCircles;
}

function buildCircle() {
    const position = createVector(random(width), random(height));
    const diameter = random(50, 150);
    const c = color(random(255), random(255), random(255));
    return (new Circle(position, diameter, c));
}

function h1(textContent, textColor, x, y) {
    rectMode(CENTER);
    textSize(64);
    textFont('JetBrains Mono');
    fill(textColor);
    noStroke();
    textAlign(CENTER, CENTER);
    text(textContent, x, y, width);
}

function h2(textContent, textColor, x, y) {
    rectMode(CENTER);
    textSize(32);
    textFont('JetBrains Mono');
    fill(textColor);
    noStroke();
    textAlign(CENTER, CENTER);
    text(textContent, x, y, width);
}

function windowResized() {
    updateCanvasSize();
}

function updateCanvasSize() {
    const canvas = document.getElementById(CANVAS_ID);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    resizeCanvas(canvas.width, canvas.height);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
}

class Circle {
    #TYPE_FILL = 'fill';
    #TYPE_OUTLINE = 'outline';

    #STATE_START = 'start';
    #STATE_FADING_IN = 'fadingIn';
    #STATE_OPAQUE = 'opaque';
    #STATE_FADING_OUT = 'fadingOut';
    #STATE_END = 'end';

    constructor(position, diameter, c) {
        this.position = position;
        this.diameter = diameter;
        this.color = c;
        this.alpha = 0;
        this.color.setAlpha(this.alpha);
        this.strokeWeight = random(2, 10);
        this.state = this.#STATE_START;
        this.timer = new Timer(Math.ceil(random(25, 1000)));
        this.setRandomType();
    }

    setRandomType() {
        const r = Math.floor(random(2));
        if (r === 0) {
            this.type = this.#TYPE_FILL;
        } else {
            this.type = this.#TYPE_OUTLINE;
        }
    }

    fadeIn() {
        if (this.alpha < 255) {
            if (this.timer.isDone()) {
                this.alpha += 1;
                this.color.setAlpha(this.alpha);
                this.state = this.#STATE_FADING_IN;
                this.timer.reset();
            }
        } else {
            this.state = this.#STATE_OPAQUE;
        }
    }

    fadeOut() {
        if (this.alpha > 0) {
            if (this.timer.isDone()) {
                this.alpha -= 1;
                this.color.setAlpha(this.alpha);
                this.state = this.#STATE_FADING_OUT;
                this.timer.reset();
            }
        } else {
            this.state = this.#STATE_END;
        }
    }

    isDone() {
        return this.state === this.#STATE_END;
    }

    draw() {
        if (this.type === this.#TYPE_OUTLINE) {
            noFill();
            stroke(this.color);
            strokeWeight(this.strokeWeight);
        } else {
            fill(this.color);
            noStroke();
        }
        
        ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
    }

    update() {
        if (this.state === this.#STATE_START || this.state === this.#STATE_FADING_IN) {
            this.fadeIn();
        } else if (this.state === this.#STATE_OPAQUE || this.state === this.#STATE_FADING_OUT) {
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
