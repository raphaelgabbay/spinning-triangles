let time = 0;
let trianglesArray = [];
let paused = false;
let nbTriangles = 20;
let prevMouseY = 0;
let spinCount = 0;
let constantSpeed = 0;
let moreRotation = 0;
let halfTurn = false;
let lockedMovement = false;
let anglePoint = 0;

//TODO Add dat.gui interface

function setup() {
    //frameRate(10);
    //fullscreen();
    createCanvas(windowWidth, windowHeight);
    noFill();
    stroke(255);
    fill(0,100);
    angleMode(DEGREES);

    //Initialize trianglesArray
    for(let i = 1; i < nbTriangles + 1; i++) {
        trianglesArray.push(new MyTriangle(i, 0));
    }    
}

function draw() {    
    if(!paused) {
        background(0);

        // trianglesArray.forEach(MyTriangle => {
        //     MyTriangle.display();
        // });
        
        for (let i = trianglesArray.length-1; i >= 0; i--) {
            trianglesArray[i].display();
            
        }
        
  
        if(lockedMovement) {

            //Update first triangle angle
            trianglesArray[0].angle = lerp(trianglesArray[0].angle, anglePoint, 0.25);
            //Update other triangles angle  
            for(let i = 1; i < nbTriangles; i++) {            
                trianglesArray[i].angle = lerp(trianglesArray[i].angle, trianglesArray[i-1].angle, 0.25);        
            }
            
            
            // Check if mouse makes more than a full turn around center of 1st triangle
            if(mouseX < trianglesArray[0].x) {
                if (prevMouseY < trianglesArray[0].y && mouseY > trianglesArray[0].y) {
                    spinCount--;
                } else if (prevMouseY > trianglesArray[0].y && mouseY < trianglesArray[0].y) {
                    spinCount++;
                }
            }
            anglePoint = 360*spinCount + atan2(mouseY - trianglesArray[0].y, mouseX - trianglesArray[0].x)+90;

        } else { //If !lockedMovement

            //Update first triangle angle && position
            trianglesArray[0].angle = lerp(trianglesArray[0].angle, anglePoint, 0.25);
            trianglesArray[0].x = lerp(trianglesArray[0].x, mouseX, 0.25);
            trianglesArray[0].y = lerp(trianglesArray[0].y, mouseY, 0.25);

            //Update other triangles angle && position
            for(let i = 1; i < nbTriangles; i++) {            
                trianglesArray[i].angle = lerp(trianglesArray[i].angle, trianglesArray[i-1].angle, 0.25);
                trianglesArray[i].x = lerp(trianglesArray[i].x, trianglesArray[i-1].x, 0.15);
                trianglesArray[i].y = lerp(trianglesArray[i].y, trianglesArray[i-1].y, 0.15);            
            }

            // Check if mouse makes more than a full turn around center of window
            if(mouseX < windowWidth/2) {
                if (prevMouseY < windowHeight/2 && mouseY > windowHeight/2) {
                    spinCount--;
                } else if (prevMouseY > windowHeight/2 && mouseY < windowHeight/2) {
                    spinCount++;
                }
            }
            anglePoint = 360*spinCount + atan2(mouseY - height / 2, mouseX - width / 2)+90;
            
        }
        

        prevMouseY = mouseY;
        moreRotation += constantSpeed;
        anglePoint += moreRotation;
        
        if(halfTurn) {
            halfTurn = false;
            spinCount = random(-10, 10);
        }
    }
}

class MyTriangle {
    constructor(size, angle) {
        this.size = 25*size;
        this.angle = angle;
        this.x = windowWidth/2;
        this.y = windowHeight/2;
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.angle);
        triangle(0, -this.size, -(sqrt(3)*this.size)/2, this.size/2, (sqrt(3)*this.size)/2, this.size/2);
        pop();
    }
}

function keyPressed() {
    if (key === 'r') {
        setup();
    } else if (key === 'p') {
        paused = !paused;
    } else if (keyCode === UP_ARROW) {
        halfTurn = true;        
        arrowMode = false;
        //constantSpeed = 0;
    } else if (keyCode === LEFT_ARROW) {
        constantSpeed -= 0.5;
        // arrowMode = true;
    } else if (keyCode === RIGHT_ARROW) {
        constantSpeed += 0.5;
        // arrowMode = true;
    } else if (key === '0') {
        constantSpeed = 0;
        moreRotation = 0;
    }
}

// function mouseMoved() {
//     arrowMode = false;
//     constantSpeed = 0;
// }
function mouseClicked() {
    lockedMovement = !lockedMovement;
}
