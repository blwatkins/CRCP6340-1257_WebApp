/*
 * Copyright (C) 2025 brittni watkins.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// The Coding Train: Coding Challenge #33 Poisson-disc Sampling
// https://youtu.be/flQgnCUxHlw?si=TXz26cnfWBCbReyu

const CANVAS_ID = 'splashCanvas';
const MAX_CIRCLES = 100;
const MIN_DURATION_MILLIS = 250;
const MAX_DURATION_MILLIS = 2000;

const MIN_CIRCLE_RADIUS = 25;
const MAX_CIRCLE_RADIUS = 100;

let circles = [];
let circleTimer;

function setup() {
    const canvas = document.getElementById(CANVAS_ID);
    createCanvas(canvas.offsetWidth, canvas.offsetHeight, canvas);
    updateCanvasSize();
    circleTimer = new Timer(MIN_DURATION_MILLIS);
    CirclePoissonDiscSampler.init(MIN_CIRCLE_RADIUS, MAX_CIRCLE_RADIUS * 2);
}

function draw() {
    background(255);

    circles.forEach((circle) => {
        circle.draw();
        circle.update();
    });

    addCircles();
    removeCircles();

    h1('brittni watkins', color(0), width / 2, (height / 2.0) - 100);
    h2('Fall 2025 NFTs', color(0), width / 2, (height / 2.0));
}

function addCircles() {
    if (circles.length < MAX_CIRCLES && circleTimer.isDone()) {
        const circle = buildPoissonCircle();

        if (circle) {
            circles.push(circle);
            circleTimer.reset();
            circleTimer.setDuration(Math.ceil(random(MIN_DURATION_MILLIS, MAX_DURATION_MILLIS)));
        }
    }
}

function removeCircles() {
    const fadedCircles = circles.filter(circle => circle.isDone());
    const activeCircles = circles.filter(circle => !circle.isDone());

    fadedCircles.forEach((circle) => {
        CirclePoissonDiscSampler.removeGridPosition(circle.poissionGridIndex);
    });

    circles = activeCircles;
}

function buildCircle() {
    const position = createVector(random(width), random(height));
    const diameter = random(MIN_CIRCLE_RADIUS * 2, MAX_CIRCLE_RADIUS * 2);
    const c = color(random(255), random(255), random(255));
    return (new Circle(position, diameter, c));
}

function buildPoissonCircle() {
    const index = CirclePoissonDiscSampler.buildNewRandomPoint();

    if (CirclePoissonDiscSampler.isValidGridIndex(index)) {
        const position = CirclePoissonDiscSampler.getGridPosition(index);

        if (position) {
            const diameter = random(MIN_CIRCLE_RADIUS * 2, MAX_CIRCLE_RADIUS * 2);
            const c = color(random(255), random(255), random(255));
            return (new Circle(position, diameter, c, index));
        } else {
            return null;
        }
    } else {
        return null;
    }
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

    #MIN_STROKE_WEIGHT = 2;
    #MAX_STROKE_WEIGHT = 10;

    constructor(position, diameter, c, gridIndex = -1) {
        this.position = position;
        this.diameter = diameter;
        this.color = c;
        this.alpha = 0;
        this.color.setAlpha(this.alpha);
        this.strokeWeight = random(this.#MIN_STROKE_WEIGHT, this.#MAX_STROKE_WEIGHT);
        this.state = this.#STATE_START;
        this.timer = new Timer(Math.ceil(random(1, 1000)));
        this.poissonGridIndex = gridIndex;
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

class CirclePoissonDiscSampler {
    static GRID = [];
    static N = 2;
    static GRID_DEFAULT = -1;

    static R;
    static W;
    static COLS;
    static ROWS;

    static initialized = false;

    static init(minR, maxR) {
        CirclePoissonDiscSampler.R = random(minR, maxR);
        CirclePoissonDiscSampler.W = CirclePoissonDiscSampler.R / Math.sqrt(CirclePoissonDiscSampler.N);
        CirclePoissonDiscSampler.COLS = Math.floor(width / CirclePoissonDiscSampler.W);
        CirclePoissonDiscSampler.ROWS = Math.floor(height / CirclePoissonDiscSampler.W);
        for (let i = 0; i < CirclePoissonDiscSampler.COLS * CirclePoissonDiscSampler.ROWS; i++) {
            CirclePoissonDiscSampler.GRID.push(CirclePoissonDiscSampler.GRID_DEFAULT);
        }

        CirclePoissonDiscSampler.initialized = true;
    }

    static buildNewRandomPoint() {
        if (CirclePoissonDiscSampler.initialized) {
            const x = random(width);
            const y = random(height);
            const position = createVector(x, y);

            const col = CirclePoissonDiscSampler.getGridColumn(x);
            const row = CirclePoissonDiscSampler.getGridRow(y);

            if (CirclePoissonDiscSampler.isValidSamplePosition(position)) {
                const index = CirclePoissonDiscSampler.getGridIndex(col, row);
                CirclePoissonDiscSampler.GRID[index] = position;
                return index;
            } else {
                return -1;
            }
        } else {
            return -1;
        }
    }

    /**
     * @param index
     * @returns {p5.Vector|null}
     */
    static getGridPosition(index) {
        if (CirclePoissonDiscSampler.isValidGridIndex(index) && CirclePoissonDiscSampler.isGridOccupied(index)) {
            return CirclePoissonDiscSampler.GRID[index];
        } else {
            return null;
        }
    }

    static removeGridPosition(index) {
        if (CirclePoissonDiscSampler.isValidGridIndex(index)) {
            CirclePoissonDiscSampler.GRID[index] = CirclePoissonDiscSampler.GRID_DEFAULT;
        }
    }

    static getGridColumn(x) {
        return Math.floor(x / CirclePoissonDiscSampler.W);
    }

    static getGridRow(y) {
        return Math.floor(y / CirclePoissonDiscSampler.W);
    }

    static getGridIndex(col, row) {
        return (col + (row * CirclePoissonDiscSampler.COLS));
    }

    static isValidGridIndex(index) {
        return (index >= 0 && index < CirclePoissonDiscSampler.GRID.length);
    }

    /**
     * @param index
     * @returns {boolean} - True if the grid index is occupied, false otherwise.
     * This method also returns false if the index is invalid.
     */
    static isGridOccupied(index) {
        if (CirclePoissonDiscSampler.isValidGridIndex(index)) {
            return (CirclePoissonDiscSampler.GRID[index] instanceof p5.Vector);
        } else {
            return false;
        }
    }

    static isValidSamplePosition(samplePosition) {
        if (!samplePosition) {
            return false;
        }

        const sampleCol = CirclePoissonDiscSampler.getGridColumn(samplePosition.x);
        const sampleRow = CirclePoissonDiscSampler.getGridRow(samplePosition.y);
        const gridIndex = CirclePoissonDiscSampler.getGridIndex(sampleCol, sampleRow);

        if (CirclePoissonDiscSampler.isValidGridIndex(gridIndex) && !CirclePoissonDiscSampler.isGridOccupied(gridIndex)) {
            let isValidPoint = true;

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const neighborIndex = CirclePoissonDiscSampler.getGridIndex(sampleCol + i, sampleRow + j);

                    if (CirclePoissonDiscSampler.isValidGridIndex(neighborIndex) && CirclePoissonDiscSampler.isGridOccupied(neighborIndex)) {
                        const neighborPosition = CirclePoissonDiscSampler.getGridPosition(neighborIndex);
                        const distance = p5.Vector.dist(samplePosition, neighborPosition);

                        if (distance < CirclePoissonDiscSampler.R) {
                            isValidPoint = false;
                        }
                    }
                }
            }

            return isValidPoint;
        } else {
            return false;
        }
    }
}
