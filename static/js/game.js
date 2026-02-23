const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdY = 300;
let velocity = 0;
let gravity = 0.5;
let jump = -8;

let pipes = [];
let pipeWidth = 60;
let pipeGap = 150;
let pipeSpeed = 2;

let score = 0;

// Create pipe
function createPipe() {
    let topHeight = Math.random() * 300 + 50;
    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + pipeGap
    });
}

// Game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird physics
    velocity += gravity;
    birdY += velocity;

    // Draw bird
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(80, birdY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Pipes
    pipes.forEach((pipe, index) => {
        pipe.x -= pipeSpeed;

        // Draw top pipe
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);

        // Draw bottom pipe
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height);

        // Collision
        if (
            80 + 15 > pipe.x &&
            80 - 15 < pipe.x + pipeWidth &&
            (birdY - 15 < pipe.top || birdY + 15 > pipe.bottom)
        ) {
            alert("Game Over! Score: " + Math.floor(score));
            document.location.reload();
        }

        // Remove off screen pipes
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            score++;
        }
    });

    // Ground collision
    if (birdY > canvas.height || birdY < 0) {
        alert("Game Over! Score: " + Math.floor(score));
        document.location.reload();
    }

    // Score display
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + Math.floor(score), 10, 25);

    requestAnimationFrame(update);
}

// Jump
document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        velocity = jump;
    }
});

// Spawn pipes
setInterval(createPipe, 2000);

update();