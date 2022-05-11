let cube;

function setup(){
    
    createCanvas(windowWidth,windowHeight/2,WEBGL);
    
    cube = new Rubiks_Cube();
    cube.setup()
}

function draw(){
    
    cube.run();
}
// Cubie is a 3d square. It has a x,y, and z axis/coordinate, We put these together to construct a Rubik's Cube
class Cubie{
    constructor(i,j,k){
        //This is the cubie's index in array
        this.index = createVector(i,j,k);
        // This is the rendered position of the cubie
        this.pos = createVector();
        //This handles all rotations for the panels
        this.rotationHandler = new RotationHandler(this);
        
        this.panels = [];
    }
    run(){
        push();
        //Set the position of the cubie to where it is to be rendered
        translate(this.pos.x,this.pos.y,this.pos.z);
        //Apply all panel rotations
        this.rotationHandler.applyRotations();
        //Render all of the panels
        this.renderPanels();
        pop();
    }
    renderPanels(){
        //Render the panels
        for (var i = 0; i < this.panels.length; i++){
            this.panels[i].run();
        }
    }
    getPositionAxis(index){
        // Calculates the proper position for the cubie from the index
        return (index-(cube.cubeSize-1)/2)*cube.panelSize;
    }
    initPosition(){
        //This sets the position from the getPositionAxis function 
        this.pos = createVector(
            this.getPositionAxis(this.index.x),
            this.getPositionAxis(this.index.y),
            this.getPositionAxis(this.index.z)
        );
    }
    setup(){
        //This resets the position
        this.initPosition();
        // Create a panel for every side
        let sides = ['top','bottom','left','right','front','back'];
        for (var i = 0; i < sides.length; i++){
         this.panels.push(new Panel(sides[i]));
        }
  
    }
}

// Panel's or Faces of the cube are what give each side of a Cubie its color
class Panel{
    constructor(side){
        //Get the side argument
        this.side = side;
        // Gets the position of the panel on a cubie
        this.pos = cube.calculatePositionFromSide(this.side).mult(cube.panelSize/2+0.5);
        // Gets the color of the panel
        this.color = cube.getColorFromSide(this.side);

        
    }
    run (){
        push();
        //Set the panel's location to its position
        translate(this.pos.x,this.pos.y,this.pos.z);
        //This rotates the panel to its proper orientation on a cubie
        if (this.pos.y != 0)
        {
            rotateX(PI/2);
        }
        else if (this.pos.x != 0)
        {
            rotateY(PI/2);
        }
        //Set the panel's coloring
        fill(this.color);
        noStroke();
        // Puts a gap in each box so that they are not right next to each other making Rubik's cube more realistic
        box(cube.panelSize*0.95,cube.panelSize*0.95,1);
        pop();
    }
}
// Deals with all the rotations for the cubies to do a "move"
class RotationHandler{
    constructor(cubie){
        // Get the cubie argument
        this.cubie = cubie;
        // This is the rotation vector
        this.rotation = createVector();
    }
    applyRotations(){
        // The rotations are applied on every axis
        // Take the stored rotations and applies them to the cubie
        rotateX(this.rotation.x);
        rotateY(this.rotation.y);
        rotateZ(this.rotation.z);
    }
    rotate(axis,multiplier){
        // This applies all rotation on each axis. The multiplier is either 1 or -1 for clockwise or counter clockwise
        this.rotation[axis]+=(PI/2)*multiplier;
        //This resets the positions of the cubie once a rotation has been applied 
        this.cubie.initPosition();
    }
}
//Consists of 3x3x3 cubies to make Rubik's Cube this is what appears on screen
class Rubiks_Cube{
    constructor(){
        // Initialize the cubies as an array
        this.cubies = [];
        // This is the amount of cubies for each side
        this.cubeSize = 3;
        // This is each panel's size in pixels
        this.panelSize = 50;
        // These are all of the moves that are used for scrambling
        this.moves = ["q","Q","w","W","e","E","a","A","s","S","d","D"]; 
        // This is the amount of moves that the scrambler makes
        this.scrambleDepth = 60;
        // This is a orbitControls() variable 
        this.orbitAngle = createVector();

        
    }
    run(){
        
        // Set the background properties
        this.background();
        // Create a inner black cube of the Rubik's Cube itself
        // Did this because otherwise there is a space in between panels and it would just be background color
        
        fill(0);
        box(this.panelSize*this.cubeSize,this.panelSize*this.cubeSize,this.panelSize*this.cubeSize);
        
        // Render the cubies
        for (var i =0; i < this.cubies.length; i++){
            this.cubies[i].run();
        }
        
    }
    background(){
        //Set the background color
        background(220);
        // Set the lights, this is a default function for lights
        lights();
        //Rotate the cube according to the orbitControls function
        rotateX(this.orbitAngle.y);
        rotateY(this.orbitAngle.x);
        // Update orbitControls
        this.updateOrbitAngle();
        
    }
    updateOrbitAngle(){
        // Update the orbitAngle
        if (keyIsDown(37)){
            this.orbitAngle.x+=0.02;
        } 
        else if (keyIsDown(39)){
            this.orbitAngle.x-=0.02;
        }
        if (keyIsDown(38)){
            this.orbitAngle.y-=0.02;
        } 
        else if (keyIsDown(40)){
            this.orbitAngle.y+=0.02;
        }
    }
    setup(){
        // Creates the cubies
        for (let i = 0; i < this.cubeSize; i++){
          for (let j = 0; j < this.cubeSize; j++){
            for (let k = 0; k < this.cubeSize; k++) {
              var cubie = new Cubie(i,j,k,this);
              
              cubie.setup();
              
              this.cubies.push(cubie);
            }
          }
        }
    }
    calculatePositionFromSide(side){
        // This returns the position relative to a cubie for a panel
        switch (side){
            case 'top':
                return createVector(0,-1,0);
            case 'bottom':
                return createVector(0,1,0);
            case 'left':
                return createVector(-1,0,0);
             case 'right':
              return createVector(1,0,0);
            case 'front':
             return createVector(0,0,-1);
            case 'back':
                return createVector(0,0,1);
        }
    }
    getColorFromSide(side){
        switch (side){
            // Colors each side of the cube
            case 'top':
                return color("yellow");
            case 'bottom':
                return color("white");
            case 'left':
                return color("red");
            case 'right':
                return color("orange");
            case 'front':
                return color("green");
            case 'back':
                return color("blue");
        }
    }
    scramble(){
        // Makes random moves to scramble the cube
        for (let i = 0; i < this.scrambleDepth; i++){
            this.move(random(this.moves));
        }
    }
    move(move){
        // If you press Enter key, the cube will scramble itself
        if (move == 'Enter'){
            this.scramble();
            return;
        }
        switch (move){
            case "q":
                for (let i = 0; i < this.cubies.length; i++){
                    if (this.cubies[i].index.x == 2){
                        var temp = this.cubies[i].index.y;
                        this.cubies[i].index.y = -(this.cubies[i].index.z-(this.cubeSize-1)/2)+(this.cubeSize-1)/2;
                        this.cubies[i].index.z = temp;
                        this.cubies[i].rotationHandler.rotate("x",1);
                    }
                }
                break;
            case "Q":
                for (let i = 0; i < this.cubies.length; i++){
                    if (this.cubies[i].index.x == 2){
                        var temp = this.cubies[i].index.z;
                        this.cubies[i].index.z = -(this.cubies[i].index.y-(this.cubeSize-1)/2)+(this.cubeSize-1)/2;
                        this.cubies[i].index.y = temp;
                        this.cubies[i].rotationHandler.rotate("x",-1);
                    }
                }
                break;
            case "w":
                for (let i = 0; i < this.cubies.length; i++){
                    if (this.cubies[i].index.x == 0){
                        var temp = this.cubies[i].index.z;
                        this.cubies[i].index.z = -(this.cubies[i].index.y-(this.cubeSize-1)/2)+(this.cubeSize-1)/2;
                        this.cubies[i].index.y = temp;
                        this.cubies[i].rotationHandler.rotate("x",-1);
                    }
                }
                break;
            case "W":
                for (let i = 0; i < this.cubies.length; i++){
                    if (this.cubies[i].index.x == 0){
                        var temp = this.cubies[i].index.y;
                        this.cubies[i].index.y = -(this.cubies[i].index.z-(this.cubeSize-1)/2)+(this.cubeSize-1)/2;
                        this.cubies[i].index.z = temp;
                        this.cubies[i].rotationHandler.rotate("x",1);
                    }
                }
                break;
            case "e":
                for (let i = 0; i < this.cubies.length; i++){
                    if (this.cubies[i].index.y == 0){
                        var temp = this.cubies[i].index.x;
                        this.cubies[i].index.x = -(this.cubies[i].index.z-(this.cubeSize-1)/2)+(this.cubeSize-1)/2;
                        this.cubies[i].index.z = temp;
                        this.cubies[i].rotationHandler.rotate("y",1);
                    }
                }
                break;
            case "E":
                for (let i = 0; i < this.cubies.length; i++){
                    if (this.cubies[i].index.y == 0){
                        var temp = this.cubies[i].index.z;
                        this.cubies[i].index.z = -(this.cubies[i].index.x-(this.cubeSize-1)/2)+(this.cubeSize-1)/2;
                        this.cubies[i].index.x = temp;
                        this.cubies[i].rotationHandler.rotate("y",-1);
                    }
                }
                break;
            case "a":
                for (let i = 0; i < this.cubies.length; i++){
                    if (this.cubies[i].index.y == 2){
                        var temp = this.cubies[i].index.z;
                        this.cubies[i].index.z = -(this.cubies[i].index.x-(this.cubeSize-1)/2)+(this.cubeSize-1)/2;
                        this.cubies[i].index.x = temp;
                        this.cubies[i].rotationHandler.rotate("y",-1);
                    }
                }
                break;
            case "A":
                for (let i = 0; i < this.cubies.length; i++){
                    if (this.cubies[i].index.y == 2){
                        var temp = this.cubies[i].index.x;
                        this.cubies[i].index.x = -(this.cubies[i].index.z-(this.cubeSize-1)/2)+(this.cubeSize-1)/2;
                        this.cubies[i].index.z = temp;
                        this.cubies[i].rotationHandler.rotate("y",1);
                    }
                }
                break; 
            case "s":
                for (let i = 0; i < this.cubies.length; i++){
                    if (this.cubies[i].index.z == 2){
                        var temp = this.cubies[i].index.x;
                        this.cubies[i].index.x = -(this.cubies[i].index.y-(this.cubeSize-1)/2)+(this.cubeSize-1)/2;
                        this.cubies[i].index.y = temp;
                        this.cubies[i].rotationHandler.rotate("z",1);
                    }
                }
                break; 
            case "S":
                for (let i = 0; i < this.cubies.length; i++){
                    if (this.cubies[i].index.z == 2){
                        var temp = this.cubies[i].index.y;
                        this.cubies[i].index.y = -(this.cubies[i].index.x-(this.cubeSize-1)/2)+(this.cubeSize-1)/2;
                        this.cubies[i].index.x = temp;
                        this.cubies[i].rotationHandler.rotate("z",-1);
                    }
                }
                break; 
            case "d":
                for (let i = 0; i < this.cubies.length; i++){
                    if (this.cubies[i].index.z == 0){
                        var temp = this.cubies[i].index.y;
                        this.cubies[i].index.y = -(this.cubies[i].index.x-(this.cubeSize-1)/2)+(this.cubeSize-1)/2;
                        this.cubies[i].index.x = temp;
                        this.cubies[i].rotationHandler.rotate("z",-1);
                    }
                }
                break; 
            case "D":
                for (let i = 0; i < this.cubies.length; i++){
                    if (this.cubies[i].index.z == 0){
                        var temp = this.cubies[i].index.x;
                        this.cubies[i].index.x = -(this.cubies[i].index.y-(this.cubeSize-1)/2)+(this.cubeSize-1)/2;
                        this.cubies[i].index.y = temp;
                        this.cubies[i].rotationHandler.rotate("z",1);
                    }
                }
                break;  
        }
    }
}

function keyPressed()
{
  // Takes keypress and executes that move
  cube.move(key);
}


