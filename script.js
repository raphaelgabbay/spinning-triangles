let time = 0;
let trianglesArray = [];
let paused = false;
let nbTriangles = 20;
let prevMouseY = 0;
let spinCount = 0;
let constantSpeed = 0;
let halfTurn = false;
let arrowMode = true;
let followPoint = 0;

function setup() {
    //frameRate(10);
    //fullscreen();
    createCanvas(windowWidth, windowHeight);
    noFill();
    stroke(255);
    angleMode(DEGREES);

    //Initialize trianglesArray
    for(let i = 1; i < nbTriangles + 1; i++) {
        trianglesArray.push(new MyTriangle(i, 0));
    }    
}

function draw() {    
    translate(windowWidth/2, windowHeight/2);
    if(!paused) {
        background(0);

        trianglesArray.forEach(MyTriangle => {
            MyTriangle.display();
        });


        for(let i = 0; i < nbTriangles; i++) {
            
            // if(trianglesArray[i].angle > 360) {
            //     trianglesArray[i].angle %= 360;

            // }

            if(i != 0) {
                trianglesArray[i].angle = lerp(trianglesArray[i].angle, trianglesArray[i-1].angle, 0.25);
            }
        }

        if(mouseX < windowWidth/2) {
            if (prevMouseY < windowHeight/2 && mouseY > windowHeight/2) {
                spinCount--;
            } else if (prevMouseY > windowHeight/2 && mouseY < windowHeight/2) {
                spinCount++;
            }
        }

        prevMouseY = mouseY;
        
        if(!arrowMode) {
            followPoint = 360*spinCount + atan2(mouseY - height / 2, mouseX - width / 2)+90;
        } else {
            followPoint += constantSpeed;
        }
        
        if(halfTurn) {
            halfTurn = false;
            if(spinCount == 0) {
                spinCount = 1;
            } else {
                spinCount = 0;
            }
        }
        

        //2D Pad MODE
        //trianglesArray[0].angle += (mouseX-windowWidth/2)/(windowWidth/(20*mouseY/(windowHeight)));

        //Follow Mouse MODE
        trianglesArray[0].angle = followPoint;
    }
}

class MyTriangle {
    constructor(size, angle) {
        this.size = 25*size;
        this.angle = angle;
    }

    display() {
        push();
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
    } else if (keyCode === LEFT_ARROW) {
        constantSpeed -= 0.5;
        arrowMode = true;
    } else if (keyCode === RIGHT_ARROW) {
        constantSpeed += 0.5;
        arrowMode = true;
    }
}

function mouseMoved() {
    arrowMode = false;
    constantSpeed = 0;
}