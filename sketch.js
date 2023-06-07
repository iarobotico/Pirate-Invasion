const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;

var engine
var world
var ground
var bg
var tower
var cannon
var boatSpriteData
var boatSpriteSheet
var angle = 50
var balls = []
var boats = []
var boatAnimation = []
var brokenBoatAnimation = []
var brokenBoatSpriteSheet
var brokenBoatSpriteData
var waterSplashAnimation = [];
var waterSplashSpritedata
var waterSplashSpritesheet;
var score = 0
var bgM
var shoot
var lose
var miss
var isGameOver = false;
var isLaughing = false;

function preload() {
    bg = loadImage("./assets/background.gif")
    boatSpriteSheet = loadImage("./assets/boat/boat.png")
    boatSpriteData = loadJSON("./assets/boat/boat.json")
    brokenBoatSpriteSheet = loadImage("./assets/boat/broken_boat.png")
    brokenBoatSpriteData = loadJSON("./assets/boat/broken_boat.json")
    waterSplashSpritedata = loadJSON("./assets/water_splash/water_splash.json");
    waterSplashSpritesheet = loadImage("./assets/water_splash/water_splash.png");
    bgM = loadSound("./assets/sounds/background_music.mp3")
    shoot = loadSound("./assets/sounds/cannon_explosion.mp3")
    miss = loadSound("./assets/sounds/cannon_water.mp3")
    lose = loadSound("./assets/sounds/pirate_laugh.mp3")
}

function setup() {

    angleMode(DEGREES)

    canvas = createCanvas(1200, 600);
    engine = Engine.create();
    world = engine.world;

    tower = new Tower(150, 350, 160, 310)
    ground = new Ground(0, height - 1, width * 2, 1)
    cannon = new Cannon(180, 110, 110, 70, angle)

    var boatFrames = boatSpriteData.frames
    for (var i = 0; i < boatFrames.length; i++) {
        var pos = boatFrames[i].position
        var img = boatSpriteSheet.get(pos.x, pos.y, pos.w, pos.h)
        boatAnimation.push(img)
    }

    var brokenBoatFrames = brokenBoatSpriteData.frames
    for (var i = 0; i < brokenBoatFrames.length; i++) {
        var pos = brokenBoatFrames[i].position
        var img = brokenBoatSpriteSheet.get(pos.x, pos.y, pos.w, pos.h)
        brokenBoatAnimation.push(img)
    }

    var waterSplashFrames = waterSplashSpritedata.frames;
    for (var i = 0; i < waterSplashFrames.length; i++) {
        var pos = waterSplashFrames[i].position;
        var img = waterSplashSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
        waterSplashAnimation.push(img);
    }
}

function draw() {
    background(189);
    image(bg, 0, 0, width, height)
    if (!bgM.isPlaying()) {
        bgM.play();
      }

    Engine.update(engine);

    tower.display()
    ground.display()
    cannon.display()
    showBoats()

    for (var i = 0; i < balls.length; i++) {
        showCannonBalls(balls[i], i);
        for (var j = 0; j < boats.length; j++) {
            if (balls[i] !== undefined && boats[j] !== undefined) {
                var collision = Matter.SAT.collides(balls[i].body, boats[j].body);
                if (collision.collided) {
                    if (!boats[j].isBroken && !balls[i].isSink) {
                        score += 5;
                        boats[j].remove(j);
                        j--;
                    }

                    Matter.World.remove(world, balls[i].body);
                    balls.splice(i, 1);
                    i--;
                }
            }
        }

    }
    fill("#6d4c41");
    textSize(40);
    text("Score: "+score, width - 200, 50);
    textAlign(CENTER, CENTER);
}

function keyPressed() {
    if (keyCode === DOWN_ARROW) {
        var cannonBall = new CannonBall(cannon.x, cannon.y);
        balls.push(cannonBall);
    }
}

function keyReleased() {
    if (keyCode == DOWN_ARROW) {
        balls[balls.length - 1].shoot();
        shoot.play()
    }
}

function showCannonBalls(ball, index) {
    ball.display();
    ball.animate();
    if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
        if (!ball.isSink) {
            miss.play();
            ball.remove(index);
        }
    }
}

function showBoats() {
    if (boats.length > 0) {
        if (
            boats.length < 4 &&
            boats[boats.length - 1].body.position.x < width - 300
        ) {
            var positions = [-20, -60, -70, -80];
            var position = random(positions);
            var boat = new Boat(width, height - 100, 200, 200, position, boatAnimation);
            boats.push(boat);
        }

        for (var i = 0; i < boats.length; i++) {
            Matter.Body.setVelocity(boats[i].body, {
                x: -0.9,
                y: 0
            });

            boats[i].display();
            boats[i].animate()

            var collision = Matter.SAT.collides(tower.body, boats[i].body);
            if (collision.collided && !boats[i].isBroken) {
                if (!isLaughing && !lose.isPlaying()) {
                    lose.play();
                    isLaughing = true
                }
                isGameOver = true;
                gameOver();
            }

        }
    } else {
        var boat = new Boat(width, height - 100, 200, 200, -20, boatAnimation);
        boats.push(boat);
    }
}

function gameOver() {
    swal(
        {
            title: `Game Over!!!`,
            text: "Thanks for playing!!",
            imageUrl:
                "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
            imageSize: "150x150",
            confirmButtonText: "Play Again"
        },
        function (isConfirm) {
            if (isConfirm) {
                location.reload();
            }
        }
    );
}