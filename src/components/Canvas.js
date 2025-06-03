import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import p5 from 'p5';
import { evaluate } from 'mathjs';
import './Canvas.css';

const Canvas = forwardRef(({ mode, running, speed, colormode, colorChangeMode, distance, pivotDistance, customEquation, isRotating, rotationSpeed, isBlendModeActive, lineHue, animateHue, initialSeparation }, ref) => {
    const canvasRef = useRef();
    let p5Instance;
    let circles = [];
    let maxDistance = 0;
    const rotationSpeedRef = useRef(rotationSpeed);
    const runningRef = useRef(running);
    let rotationAngle = 0;
    const [startDelay, setStartDelay] = useState(999);
    const [customEquationParse, setCustomEquationParse] = useState('');

    const canvasStyle = {
        mixBlendMode: isBlendModeActive ? 'difference' : 'normal',
        zIndex: 1,
    };

    const modes = {
        "pi": 1 + Math.PI,
        "goldenRatio": (1 + Math.sqrt(5)) / 2,
        "3pi": Math.PI * Math.PI,
        "pigr": Math.PI * (1 + Math.sqrt(5)) / 2,
        "piE": Math.PI * Math.E,
        "EE": Math.E * Math.E,
        "mandelbrot": (x, y) => {
            // Simplified Mandelbrot-inspired ratio
            // Using a basic function of x and y to vary the ratio
            return 2 + (Math.sin(1) + Math.cos(1)) * 0.1;
        },
    };

    const parseCustomEquation = (equationString, x, y) => {
        try {
            const scope = { x, y, pi: Math.PI };
            return evaluate(equationString, scope);
        } catch (error) {
            console.error("Error in custom equation:", error);
            return 0;
        }
    };

    const calculateBounceAngle = (equationResult) => {
        // If equationResult is a valid angle in radians, you can directly return it
        // return equationResult;

        // If equationResult needs to be transformed into an angle
        // Here's a simple example: mapping the result to a range between 0 and 2*PI
        // This is a placeholder example, modify the logic as needed for the application

        const normalizedResult = (equationResult % (2 * Math.PI));
        console.log('normalllllllllllllllllllllllllllll: ', equationResult)
        return normalizedResult;
    };

    // Handle the custom equation
    const applyCustomEquation = (x, y) => {
        try {
            return calculateBounceAngle(parseCustomEquation(customEquation, x, y));
        } catch (error) {
            console.error("Error in custom equation:", error);
            return 0;
        }
    };

    let lastTouchDistance = null;
    const zoomRef = useRef(1);
    const offsetRef = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    // Expose resetOffset function via ref
    useImperativeHandle(ref, () => ({
        resetOffset: () => {
            offsetRef.current = { x: 0, y: 0 };
        },
    }));

    const handleMouseDown = (event) => {
        isDragging.current = true;
        lastMousePos.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event) => {
        if (isDragging.current) {
            const dx = event.clientX - lastMousePos.current.x;
            const dy = event.clientY - lastMousePos.current.y;
            offsetRef.current.x += dx / zoomRef.current;
            offsetRef.current.y += dy / zoomRef.current;
            lastMousePos.current = { x: event.clientX, y: event.clientY };
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const handleTouchMove = (event) => {
        if (event.touches.length === 2) {
            event.preventDefault();
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const distance = Math.sqrt(
                Math.pow(touch2.pageX - touch1.pageX, 2) +
                Math.pow(touch2.pageY - touch1.pageY, 2)
            );

            if (lastTouchDistance) {
                let zoomFactor = distance / lastTouchDistance;
                applyZoom(zoomFactor);
            }

            lastTouchDistance = distance;
        } else if (event.touches.length === 1 && isDragging.current) {
            event.preventDefault();
            const touch = event.touches[0];
            const dx = touch.pageX - lastMousePos.current.x;
            const dy = touch.pageY - lastMousePos.current.y;
            offsetRef.current.x += dx / zoomRef.current;
            offsetRef.current.y += dy / zoomRef.current;
            lastMousePos.current = { x: touch.pageX, y: touch.pageY };
        }
    };

    const handleTouchStart = (event) => {
        if (event.touches.length === 1) {
            isDragging.current = true;
            const touch = event.touches[0];
            lastMousePos.current = { x: touch.pageX, y: touch.pageY };
        }
    };

    const handleTouchEnd = () => {
        isDragging.current = false;
        lastTouchDistance = null;
    };

    const applyZoom = (zoomFactor) => {
        try {
            zoomRef.current *= zoomFactor;
            zoomRef.current = Math.max(0.1, Math.min(zoomRef.current, 10));
            console.log("Zoom Level:", zoomRef.current);
            // Redraw your canvas with the new zoom level
        } catch (error) {
            console.error("Error applying zoom:", error);
        }
    };

    useEffect(() => {
        const contentElement = document.getElementById('content');
        if (contentElement) {
            contentElement.addEventListener('touchmove', handleTouchMove, { passive: false });
            contentElement.addEventListener('touchstart', handleTouchStart);
            contentElement.addEventListener('touchend', handleTouchEnd);
            contentElement.addEventListener('mousedown', handleMouseDown);
            contentElement.addEventListener('mousemove', handleMouseMove);
            contentElement.addEventListener('mouseup', handleMouseUp);
            contentElement.addEventListener('mouseleave', handleMouseUp);

            // Cleanup function
            return () => {
                contentElement.removeEventListener('touchmove', handleTouchMove);
                contentElement.removeEventListener('touchstart', handleTouchStart);
                contentElement.removeEventListener('touchend', handleTouchEnd);
                contentElement.removeEventListener('mousedown', handleMouseDown);
                contentElement.removeEventListener('mousemove', handleMouseMove);
                contentElement.removeEventListener('mouseup', handleMouseUp);
                contentElement.removeEventListener('mouseleave', handleMouseUp);
            };
        }
    }, []);
    
    let currentHue = lineHue;

    const Sketch = (p) => {
        let bounceAngle = modes[mode] || Math.PI;
        let movementStarted = false;
        let startTime;

        p.setup = () => {
            p.createCanvas(p.windowWidth, p.windowHeight);
            p.angleMode(p.RADIANS);
            initializeCircles();
            startTime = p.millis();
        };

        function initializeCircles() {
            maxDistance = 0;
            circles = [];
            let separation = initialSeparation / 2; // Half separation for each circle
            let velocity = p.createVector(speed, 0);

            // Set initial positions based on separation
            circles.push(new Circle(p, p.createVector(-separation, 0), velocity, bounceAngle));
            velocity = p.createVector(-speed, 0);
            circles.push(new Circle(p, p.createVector(separation, 0), velocity, bounceAngle));
        }

        p.mouseWheel = (event) => {
            zoomRef.current += event.delta * 0.001;
            zoomRef.current = p.constrain(zoomRef.current, 0, 10); // Limit zoom level
        };

        p.draw = () => {
            if (runningRef.current && !movementStarted) {
                if (p.millis() - startTime > startDelay) {
                    movementStarted = true;
                }
            }
            if (runningRef.current && movementStarted) {
                p.clear();
                p.background(255, 0);

                if (isRotating) {
                    rotationAngle += rotationSpeedRef.current;
                }

                let scaleFactor = Math.min(p.width, p.height) / (2 * maxDistance + 100); // 100 is the margin
                p.translate(p.width / 2 + offsetRef.current.x, p.height / 2 + offsetRef.current.y);
                p.rotate(rotationAngle);
                p.scale(zoomRef.current);
                p.scale(scaleFactor);

                if (animateHue) {
                    currentHue = (currentHue + 1) % 360; // Increment hue for animation
                } else {
                    currentHue = lineHue; // Use static hue from props
                }

                circles.forEach(circle => {
                    circle.update();
                    circle.display(currentHue); // Pass the current hue to display method
                });
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
            initializeCircles();
        };
    };

    useEffect(() => {
        rotationSpeedRef.current = rotationSpeed; // Update ref when rotationSpeed prop changes
    }, [rotationSpeed]);

    useEffect(() => {
        runningRef.current = running; // Update ref when rotationSpeed prop changes
    }, [running]);

    useEffect(() => {
        if (p5Instance) {
            p5Instance.remove();
        }
        p5Instance = new p5(Sketch, canvasRef.current);

        return () => {
            if (p5Instance) {
                p5Instance.remove();
            }
        };
    }, [mode, speed, distance, pivotDistance, colorChangeMode, initialSeparation, customEquation]);

    class Circle {
        constructor(p, position, velocity, bounceAngle) {
            this.p = p;
            this.position = position;
            this.velocity = velocity;
            this.bounceAngle = bounceAngle;
            this.path = [];
            this.pathColors = []; // Store color for each path segment
            this.hue = 0; // Initialize the hue for the color spectrum
            this.p.colorMode(this.p.HSB, 360, 100, 100);
        }

        // update() {
        //     // Check if the circle has reached the dynamic distance from the center
        //     if (this.p.dist(0, 0, this.position.x, this.position.y) >= distance) {
        //         // Reflect the angle and rotate by an additional pi radians
        //         this.velocity.rotate(Math.PI + this.bounceAngle);
        //     }

        //     let currentDist = this.p.dist(0, 0, this.position.x, this.position.y);
        //     if (currentDist > maxDistance) {
        //         maxDistance = currentDist;
        //     }

        //     this.position.add(this.velocity);
        //     this.path.push(this.position.copy());
        // }

        update() {
            // Check if the circle has reached the dynamic distance from the center
            if (this.p.dist(0, 0, this.position.x, this.position.y) >= distance) {

                if (this.p.dist(0, 0, this.position.x, this.position.y) >= distance) {
                    if (mode === 'custom') {
                        this.bounceAngle = applyCustomEquation(this.position.x, this.position.y);
                        this.velocity.rotate(this.bounceAngle);
                    } else if (mode === "mandelbrot") {
                        // Calculate the bounce angle based on the mode
                        let angle = modes[mode](this.position.x, this.position.y);
                        this.velocity.rotate(angle);
                    } else {
                        this.velocity.rotate(this.bounceAngle);
                        this.velocity.x *= -1;
                        this.velocity.y *= -1;
                    }
                }

            }

            this.position.add(this.velocity);
            this.path.push(this.position.copy());

            if (colorChangeMode === 'fixed') {
                // Update hue for dynamic mode
                this.hue = (this.hue + colormode) % 360;
                this.pathColors.fill(this.hue); // Update all path colors
            } else {
                // In fixed mode, update the hue only for new segments
                this.hue = (this.hue + colormode) % 360;
                if (this.path.length === 0 || this.p.frameCount % Math.round(60 / speed) === 0) {
                    this.path.push(this.position.copy());
                    this.pathColors.push(this.hue); // Push current hue for new segment
                }
            }

            // Update maxDistance
            let currentDist = this.p.dist(0, 0, this.position.x, this.position.y);
            if (currentDist > maxDistance) {
                maxDistance = currentDist;
            }

            // Update the hue for the next segment based on colormode
            this.hue += colormode;
            if (this.hue >= 360) {
                this.hue -= 360; // Loop back to start of color spectrum
            }

            // Store the color for the new segment
            this.pathColors.push(this.hue);
        }

        display() {
            this.p.colorMode(this.p.HSB, 360, 100, 100);

            for (let i = 1; i < this.path.length; i++) {
                this.p.stroke(this.pathColors[i], 100, 100);
                this.p.strokeWeight(2);
                this.p.line(this.path[i - 1].x, this.path[i - 1].y, this.path[i].x, this.path[i].y);
            }
        }
    }

    return <div style={canvasStyle} id='content' className='content' ref={canvasRef}></div>;
});

export default Canvas;