var backdropSprite;
var sharkSprite;
var fish1Sprite;

var sharkImageIndex = 0;
var sharkImageNames = ["shark-a", "shark-b", "shark-c"];

var inputTimer = 0;
var sharkAnimationTimer = 0;
var fish1MoveTimer = 0;
var fish1HideTimer = 0;

var score = 0;
var gameOver = false;

var backgroundMusic;

function preload()
{
    backgroundMusic = loadSound("sound/Baby Shark.mp3");
}

function setup()
{
    backgroundMusic.loop();
    // put setup code here
    createCanvas(480, 360);

    backdropSprite = createSprite(width/2, height/2, 480, 360);
    backdropSprite.addImage("backdrop", loadImage("img/underwater3.png"));

    sharkSprite = createSprite(width/10*6, height/2, 154, 72);
    sharkSprite.addImage(sharkImageNames[0], loadImage("img/shark-a.png"));
    sharkSprite.addImage(sharkImageNames[1], loadImage("img/shark-b.png"));
    sharkSprite.addImage(sharkImageNames[2], loadImage("img/shark-c.png"));

    fish1Sprite = createSprite(width/10*3, height/10*7, 50, 50);
    fish1Sprite.addImage("fish1", loadImage("img/fish1-2.png"));
    fish1Sprite.rotateToDirection = true;
}

function nextSharkImageName()
{
    sharkImageIndex++;
    if(sharkImageIndex >= sharkImageNames.length)
    {
        sharkImageIndex = 0;
    }
    return sharkImageNames[sharkImageIndex];
}

function killFish()
{
    if(fish1Sprite.visible)
    {
        score += 10;

        fish1HideTimer = 0;
        fish1Sprite.visible = false;
    }
}

function draw()
{
    if(!gameOver)
    {
        // put drawing code here
        inputTimer = setTimer(inputTimer, 0.05);
        if(inputTimer == 0)
        {
            if (keyIsDown(UP_ARROW))
            {
                sharkSprite.position.y -= 10;
            }

            if (keyIsDown(DOWN_ARROW))
            {
                sharkSprite.position.y += 10;
            }

            if (keyIsDown(RIGHT_ARROW))
            {
                sharkSprite.mirrorX(1);
                sharkSprite.position.x += 10;
            }

            if (keyIsDown(LEFT_ARROW))
            {
                sharkSprite.mirrorX(-1);
                sharkSprite.position.x -= 10;
            }

            mouseInput();
        }



        stayInBorder(sharkSprite);

        sharkAnimationTimer = setTimer(sharkAnimationTimer, 0.5);
        if(sharkAnimationTimer == 0)
        {
            sharkSprite.changeImage(nextSharkImageName());
        }

        fishMotion();

        drawSprites();

        textSize(32);
        text("score "+score, 10, 35);
    }

    if(score > 100)
    {
        gameOver = true;
        backgroundMusic.stop();
    }
}

function mouseInput()
{
    if(mouseIsPressed)
    {
        if(mouseY > sharkSprite.position.y)
        {
            sharkSprite.position.y += 10;
        }

        if(mouseY < sharkSprite.position.y)
        {
            sharkSprite.position.y -= 10;
        }

        if(mouseX > sharkSprite.position.x)
        {
            sharkSprite.mirrorX(1);
            sharkSprite.position.x += 10;
        }

        if(mouseX < sharkSprite.position.x)
        {
            sharkSprite.mirrorX(-1);
            sharkSprite.position.x -= 10;
        }
    }
}

function stayInBorder(sprite)
{
    if(sprite.position.x < 0)
    {
        sprite.position.x = 0;
    }
    else if(sprite.position.x >= width)
    {
        sprite.position.x = width - 1;
    }

    if(sprite.position.y < 0)
    {
        sprite.position.y = 0;
    }
    else if(sprite.position.y >= height)
    {
        sprite.position.y = height - 1;
    }
}

function setTimer(currentTimer, interval)
{
    if(currentTimer >= interval)
    {
        currentTimer = 0;
    }
    else
    {
        currentTimer += deltaTime /1000;
    }

    return currentTimer;
}

function fishMotion()
{
    fish1Sprite.setSpeed(0);

    fish1MoveTimer = setTimer(fish1MoveTimer, 0.5);

    if(fish1MoveTimer == 0)
    {
        fish1Sprite.setSpeed(20);
        fish1Sprite.rotation += Math.floor(Math.random() * 10) + 1;
    }

    ifOnEdgeBounce(fish1Sprite);

    stayInBorder(fish1Sprite);

    fish1Sprite.overlap(sharkSprite, killFish);

    fish1HideTimer = setTimer(fish1HideTimer, 3);
    if(!fish1Sprite.visible && fish1HideTimer == 0)
    {
        fish1Sprite.visible = true;
        fish1Sprite.position.x = Math.floor(Math.random() * 480);
        fish1Sprite.position.y = Math.floor(Math.random() * 360);
    }
}

function ifOnEdgeBounce(sprite)
{
    if(sprite.position.x < 0 || sprite.position.x >= width || sprite.position.y < 0 || sprite.position.y >= height)
        sprite.rotation += 180;
}

/*
    if(sprite.position.x < 0)
    {
        sprite.rotation += 180;
    }

    if(sprite.position.x >= width)
    {
        sprite.rotation += 180;
    }

    if(sprite.position.y < 0)
    {
        sprite.rotation += 180;
    }

    if(sprite.position.y >= height)
    {
        sprite.rotation += 180;
    }
*/

function keyPressed()
{
    if (getAudioContext().state !== 'running')
    {
        getAudioContext().resume();
    }
}