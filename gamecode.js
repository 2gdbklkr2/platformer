// JavaScript source code
(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");
    width = 800;
    height = 600;

    //create a player object
    player = {
        x: width / 2,
        y: height - 15,
        width: 15,
        height: 15,
        speed: 3,
        velX: 0,
        velY: 0,
        score:0,
        jumping: false,
        grounded: false
    },
    keys = [],
    friction = 0.8,
    gravity = 0.1;

var boxes = [];
var coins = [];
var enemies =[];
var gameOver=false;

// left border
boxes.push({
    x: 0,
    y: 0,
    width: 1,
    height: height
});
// bottom border
boxes.push({
    x: 0,
    y: height - 2,
    width: width,
    height: 50
});
//right border
boxes.push({
    x: width -1,
    y: 0,
    width: 1,
    height: height
});

boxes.push({
    x: 50,
    y: 200,
    width: 100,
    height: 40
});
boxes.push({
    x: 400,
    y: 250,
    width: 80,
    height: 40
});
boxes.push({
    x: 100,
    y: 350,
    width: 150,
    height: 40
});
boxes.push({
    x: 300,
    y: 450,
    width: 150,
    height: 40
});

boxes.push({
    x: 600,
    y: 100,
    width: 150,
    height: 40
});

coins.push({
    x: 150,
    y: 170,
    width: 10,
    height: 10
});

coins.push({
    x: 200,
    y: 310,
    width: 10,
    height: 10
});

coins.push({
    x: 160,
    y: 310,
    width: 10,
    height: 10
});

enemies.push({
    x: 200,
    y: 60,
    width: 10,
    height: 10,
    spdX: 2,
    spdY: 2
});

enemies.push({
    x: 100,
    y: 20,
    width: 10,
    height: 10,
    spdX: 2,
    spdY: 2
});

enemies.push({
    x: 300,
    y: 40,
    width: 10,
    height: 10,
    spdX: 2,
    spdY: 2
});
canvas.width = width;
canvas.height = height;

function update() {

    if(!gameOver){
    // check keys
    if (keys[38] || keys[32] || keys[87]) {
        // up arrow or space
        if (!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 2;
        }
    }
    if (keys[39] || keys[68]) {
        // right arrow
        if (player.velX < player.speed) {
            player.velX++;
        }
    }
    if (keys[37] || keys[65]) {
        // left arrow
        if (player.velX > -player.speed) {
            player.velX--;
        }
    }

    player.velX *= friction;
    player.velY += gravity;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle="black";
    ctx.beginPath();

    player.grounded = false;

    for (var i = 0; i < boxes.length; i++) {

        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

        var dir = colCheck(player, boxes[i]);

        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.velY *= -1;
        }

    }

    if (player.grounded) {
        player.velY = 0;
    }

    player.x += player.velX;
    player.y += player.velY;

    ctx.fill();
    ctx.fillStyle = "green";
    ctx.font = "30px Verdana";  
    ctx.fillRect(player.x, player.y, player.width, player.height);

    
    ctx.fillStyle = "yellow";
    // ctx.beginPath();
    for (var j = 0; j < coins.length; j++) {
        ctx.fillRect(coins[j].x, coins[j].y, coins[j].width, coins[j].height);
        // colCheck(player, coins[j]);
        checkCoinCollision(player,coins[j],j);
    }

    //ctx.fill();
    ctx.fillStyle = "blue";
    ctx.fillText( "Score: "+ player.score, 650, 30);

    ctx.fillStyle = "red";
    for (var k=0; k<enemies.length; k++){
        ctx.fillRect(enemies[k].x, enemies[k].y, enemies[k].width, enemies[k].height);

       
        if (enemies[k].x < 0 || enemies[k].x + enemies[k].width > width) {
            enemies[k].spdX = -enemies[k].spdX;
        }
        if (enemies[k].y < 0 || enemies[k].y +enemies[k].height > height) {
            enemies[k].spdY = -enemies[k].spdY;
        }

        enemies[k].x += enemies[k].spdX;
        enemies[k].y += enemies[k].spdY;

        checkEnemyCollision(player,enemies[k],k);
    }   
   
    
    //ctx.fillRect(coins.x, coins.y, coins.width, coins.height);
    
    requestAnimationFrame(update);
}else{
    ctx.fillStyle = "black";
    ctx.font = "30px Verdana";  
    ctx.fillText("Game Over",220,40);
    ctx.font = "30px Verdana";        
}
}

function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}
//Check collision 
function  checkCoinCollision(entity1,entity2,index){
    
    if(entity1.x < entity2.x +entity2.width 
        && entity1.x +entity1.width> entity2.x 
        && entity1.y < entity2.y +entity2.height 
        && entity1.y +entity1.height> entity2.y){

            coins.splice(index,1);
            //console.log("collision");
            player.score = player.score + 10;
    }   
}

//Check collision of 
function  checkEnemyCollision(entity1,entity2,index){
    
    if(entity1.x < entity2.x +entity2.width 
        && entity1.x +entity1.width> entity2.x 
        && entity1.y < entity2.y +entity2.height 
        && entity1.y +entity1.height> entity2.y){

            //coins.splice(index,1);
            //console.log("collision");
            
        gameOver=true;
            
    }   
}

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

window.addEventListener("load", function () {
    update();
});




