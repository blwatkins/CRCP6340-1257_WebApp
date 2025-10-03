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

// Note: This module requires p5.js to be loaded globally
export class SplashScreen {
    constructor() {
        this.CANVAS_ID = 'splashCanvas';
        this.MAX_CIRCLES = 100;
        this.MIN_DURATION_MILLIS = 250;
        this.MAX_DURATION_MILLIS = 2000;
        this.circles = [];
        this.p5Instance = null;

        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupCanvas());
        } else {
            this.setupCanvas();
        }
    }

    setupCanvas() {
        const canvas = document.getElementById(this.CANVAS_ID);
        if (canvas && typeof p5 !== 'undefined') {
            // Initialize p5.js sketch
            this.p5Instance = new p5(p => this.sketch(p), this.CANVAS_ID);
        }
    }

    sketch(p) {
        const self = this;

        p.setup = function () {
            p.createCanvas(p.windowWidth, p.windowHeight);
            p.textFont('JetBrains Mono');
            p.background(139, 69, 19);

            CirclePoissonDiscSampler.init(90, 150, p);
        };

        p.draw = function () {
            p.background(139, 69, 19);

            // Draw text
            p.textAlign(p.CENTER, p.CENTER);
            p.fill(255);
            p.textSize(64);
            p.text('brittni watkins', p.width / 2, p.height / 2 - 50);
            p.textSize(32);
            p.text('Fall 2025 NFTs', p.width / 2, p.height / 2 + 50);

            // Handle circles
            if (self.circles.length < self.MAX_CIRCLES) {
                const newCircleIndex = CirclePoissonDiscSampler.buildNewRandomPoint(p);
                if (newCircleIndex >= 0) {
                    const position = CirclePoissonDiscSampler.getGridPosition(newCircleIndex);
                    if (position) {
                        const circle = new Circle(position, self.MIN_DURATION_MILLIS, self.MAX_DURATION_MILLIS, p);
                        self.circles.push({ circle: circle, gridIndex: newCircleIndex });
                    }
                }
            }

            for (let i = self.circles.length - 1; i >= 0; i--) {
                const circleData = self.circles[i];
                circleData.circle.update(p);
                circleData.circle.draw(p);

                if (circleData.circle.isDone()) {
                    CirclePoissonDiscSampler.removeGridPosition(circleData.gridIndex);
                    self.circles.splice(i, 1);
                }
            }
        };

        p.windowResized = function () {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    }
}

class Circle {
    constructor(position, minDurationMillis, maxDurationMillis, p) {
        this.STATE_START = 0;
        this.STATE_FADING_IN = 1;
        this.STATE_OPAQUE = 2;
        this.STATE_FADING_OUT = 3;
        this.STATE_END = 4;

        this.TYPE_FILL = 0;
        this.TYPE_OUTLINE = 1;

        this.position = position;
        this.diameter = p.random(25, 90);
        this.strokeWeight = p.random(1, 5);
        this.type = p.random() < 0.5 ? this.TYPE_FILL : this.TYPE_OUTLINE;
        this.state = this.STATE_START;
        this.alpha = 0;
        this.timer = new Timer(p.random(minDurationMillis, maxDurationMillis), p);

        const hue = p.random(340, 360);
        const saturation = p.random(80, 100);
        const brightness = p.random(60, 100);

        p.colorMode(p.HSB, 360, 100, 100, 255);
        this.color = p.color(hue, saturation, brightness, this.alpha);
        p.colorMode(p.RGB, 255, 255, 255, 255);
    }

    fadeIn() {
        if (this.alpha < 255) {
            if (this.timer.isDone()) {
                this.alpha += 1;
                this.color.setAlpha(this.alpha);
                this.state = this.STATE_FADING_IN;
                this.timer.reset();
            }
        } else {
            this.state = this.STATE_OPAQUE;
        }
    }

    fadeOut() {
        if (this.alpha > 0) {
            if (this.timer.isDone()) {
                this.alpha -= 1;
                this.color.setAlpha(this.alpha);
                this.state = this.STATE_FADING_OUT;
                this.timer.reset();
            }
        } else {
            this.state = this.STATE_END;
        }
    }

    isDone() {
        return this.state === this.STATE_END;
    }

    draw(p) {
        if (this.type === this.TYPE_OUTLINE) {
            p.noFill();
            p.stroke(this.color);
            p.strokeWeight(this.strokeWeight);
        } else {
            p.fill(this.color);
            p.noStroke();
        }

        p.ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
    }

    update(p) {
        if (this.state === this.STATE_START || this.state === this.STATE_FADING_IN) {
            this.fadeIn();
        } else if (this.state === this.STATE_OPAQUE || this.state === this.STATE_FADING_OUT) {
            this.fadeOut();
        }
    }
}

class Timer {
    constructor(durationMillis, p) {
        this.durationMillis = durationMillis;
        this.startTime = p.millis();
        this.p = p;
    }

    isDone() {
        return (this.p.millis() > (this.startTime + this.durationMillis));
    }

    reset() {
        this.startTime = this.p.millis();
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
    static p5Ref = null;

    static init(minR, maxR, p) {
        CirclePoissonDiscSampler.p5Ref = p;
        CirclePoissonDiscSampler.R = p.random(minR, maxR);
        CirclePoissonDiscSampler.W = CirclePoissonDiscSampler.R / Math.sqrt(CirclePoissonDiscSampler.N);
        CirclePoissonDiscSampler.COLS = Math.floor(p.width / CirclePoissonDiscSampler.W);
        CirclePoissonDiscSampler.ROWS = Math.floor(p.height / CirclePoissonDiscSampler.W);

        CirclePoissonDiscSampler.GRID = [];
        for (let i = 0; i < CirclePoissonDiscSampler.COLS * CirclePoissonDiscSampler.ROWS; i++) {
            CirclePoissonDiscSampler.GRID.push(CirclePoissonDiscSampler.GRID_DEFAULT);
        }

        CirclePoissonDiscSampler.initialized = true;
    }

    static buildNewRandomPoint(p) {
        if (CirclePoissonDiscSampler.initialized) {
            const x = p.random(p.width);
            const y = p.random(p.height);
            const position = p.createVector(x, y);

            const col = CirclePoissonDiscSampler.getGridColumn(x);
            const row = CirclePoissonDiscSampler.getGridRow(y);

            if (CirclePoissonDiscSampler.isValidSamplePosition(position, p)) {
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

    static isGridOccupied(index) {
        if (CirclePoissonDiscSampler.isValidGridIndex(index)) {
            return (CirclePoissonDiscSampler.GRID[index] && typeof CirclePoissonDiscSampler.GRID[index] === 'object');
        } else {
            return false;
        }
    }

    static isValidSamplePosition(samplePosition, p) {
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
                        const distance = p.dist(samplePosition.x, samplePosition.y, neighborPosition.x, neighborPosition.y);

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
