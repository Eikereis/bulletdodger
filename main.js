const canvas = document.getElementById("MyCanvas");
const ctx = canvas.getContext('2d');
const img = new Image();


img.src = "Voitto.png";

let gameTimer = 150; // Timer in seconds
let gameInterval; // Interval for the timer
let gameStarted = 0;
let gameRunning = true; // Add a flag to control game updates

if (gameStarted = 1) {
class Player {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height - 50;
        this.w = 20;
        this.h = 20;
        this.dx = 0;
        this.dy = 0;
        this.speed = 5;
        this.gravity = 0.06; // Gravity force
        this.jumpStrength = -3; // Jump strength (negative for upward movement)
        this.isJumping = false; // Track if the player is jumping
        this.lives = 5; // Player starts with set amount of lives
    }

    update() {
        // Apply gravity
        if (this.y < canvas.height - this.h || this.dy < 0) {
            this.dy += this.gravity;
        } else {
            this.dy = 0;
            this.isJumping = false; // Reset jumping state when on the ground
        }

        this.x += this.dx;
        this.y += this.dy;

        // Prevent player from going out of bounds
        this.x = Math.max(0, Math.min(canvas.width - this.w, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.h, this.y));
    }

    draw() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Draw lives
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(`Lives: ${this.lives}`, 10, 20);
    }

    loseLife() {
        this.lives -= 1;
        if (this.lives <= 0) {
            alert("Game Over! You lost.");
            document.location.reload(); // Reload the game
        }
    }
}

class Bullet {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.r = 5;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 30;
        this.h = 30;
        this.bullets = [];
        this.speed = 3; // Speed of the horizontal movement
        this.attackMode = 3; // Current attack mode
        this.attackTimer = 0; // Timer to track attack mode changes

        this.blockTimer = 0; // Timer for vertical block attack
        this.blockWarning = false; // Whether the block is in the warning phase
        this.blockActive = false; // Whether the vertical block is active
        this.rngwall = 0
    }

    shoot() {
        const directionX = player.x + player.w / 2 - (this.x + this.w / 2);
        const directionY = player.y + player.h / 2 + 5 - (this.y + this.h / 2);
        const magnitude = Math.sqrt(directionX ** 2 + directionY ** 2);
        const normalizedX = directionX / magnitude;
        const normalizedY = directionY / magnitude;

        if (this.attackMode === 1) {
            // Normal shooting
            const dx = normalizedX + Math.random() * 3 - 1.5; // Add slight randomness
            const dy = normalizedY + Math.random() * 3;
            this.bullets.push(new Bullet(this.x + this.w / 2, this.y + this.h / 2, dx, dy));
        } else if (this.attackMode === 2) {
            // Spread shooting
            for (let angle = -1; angle <= 1; angle++) {
                const dx = normalizedX + angle * 0.5; // Spread bullets horizontally
                const dy = normalizedY + 1;
                this.bullets.push(new Bullet(this.x + this.w / 2, this.y + this.h / 2, dx, dy));
            }
        } else if (this.attackMode === 3) {
            // Circular wall of bullets
            for (let angle = 0; angle < 360; angle += 30) {
                const radians = (angle * Math.PI) / 180;
                const dx = Math.cos(radians) * 3;
                const dy = Math.sin(radians) * 3;
                this.bullets.push(new Bullet(this.x + this.w / 2, this.y + this.h / 2, dx, dy));
            }
        } else if (this.attackMode === 5) {
            // Slow but big bullets
            const dx = normalizedX * 2;
            const dy = normalizedY * 2;
            const bigBullet = new Bullet(this.x + this.w / 2, this.y + this.h / 2, dx, dy);
            bigBullet.r = 20; // Increase bullet size
            this.bullets.push(bigBullet);
        } else if (this.attackMode === 6) {
            // Vertical block attack
            if (!this.blockActive && !this.blockWarning) {
                this.rngwall = Math.random();
                this.blockWarning = true; // Start warning phase
                this.blockTimer = 180; // 3 seconds warning (180 frames at 60 FPS)
                
            } else if (this.blockWarning && this.blockTimer <= 0) {
                this.blockWarning = false; // End warning phase
                this.blockActive = true; // Activate block
                this.blockTimer = 180; // 30 seconds active (1800 frames at 60 FPS)
            }
        }
    }

    update() {
        if (gameTimer > 0) { 
            // Update all bullets and remove those that go offscreen
            this.bullets = this.bullets.filter(bullet => bullet.y <= canvas.height && bullet.x >= 0 && bullet.x <= canvas.width);
            this.bullets.forEach(bullet => bullet.update());
            this.x += this.speed;
            if (this.x + this.w > canvas.width || this.x < 0) {
                this.speed *= -1; // Reverse direction
            }

            // Update attack mode every 10 seconds
            this.attackTimer++;
            if (this.attackTimer >= 150) { // Assuming 60 FPS, 600 frames = 10 seconds
                this.attackMode = (this.attackMode % 6) + 1; // Cycle through attack modes (1 to 6)
                this.attackTimer = 0; // Reset timer
            }

            // Handle vertical block attack
            if (this.blockWarning || this.blockActive) {
                this.blockTimer--;
                if (this.blockActive && this.blockTimer <= 0) {
                    this.blockActive = false; // Deactivate block after 30 seconds
                }
            }
        }
    }

    draw() {


        // Draw bullets
        this.bullets.forEach(bullet => bullet.draw());

        // Draw vertical block if active or in warning phase
        if (this.rngwall <= 0.5) {
            if (this.blockWarning) {
                ctx.fillStyle = "rgba(255, 255, 0, 0.5)"; // Bright yellow for warning
                ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
            } else if (this.blockActive) { 
                ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Red for active block
                ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
            } 
        } else {
            if (this.blockWarning) {
                ctx.fillStyle = "rgba(255, 255, 0, 0.5)"; // Bright yellow for warning
                ctx.fillRect(0, 0, canvas.width / 2, canvas.height);
            } else if (this.blockActive) { 
                ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Red for active block
                ctx.fillRect(0, 0, canvas.width / 2, canvas.height);
            } 

        }
    }

    clearBullets() {
        this.bullets = []; // Remove all bullets
    }
}

const player = new Player();
const enemies = [new Enemy(canvas.width / 2, 50)];

function handleInput() {
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp" && !player.isJumping) {
            player.dy = player.jumpStrength; // Apply jump strength
            player.isJumping = true; // Set jumping state
        }
        if (e.key === "ArrowLeft") player.dx = -player.speed;
        if (e.key === "ArrowRight") player.dx = player.speed;
    });

    document.addEventListener("keyup", (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.dx = 0;
    });
}

function checkCollisions() {
    enemies.forEach(enemy => {
        enemy.bullets.forEach(bullet => {
            if (
                bullet.x > player.x &&
                bullet.x < player.x + player.w &&
                bullet.y > player.y &&
                bullet.y < player.y + player.h
            ) {
                // Collision with bullet
                player.loseLife();
                enemies.forEach(enemy => enemy.clearBullets()); // Clear all bullets
            }
        });

        // Collision with vertical block
        if (enemy.blockActive && player.x + player.w > canvas.width / 2 && this.rngwall > 0.5) {
            player.loseLife();
            player.x = canvas.width / 3; // Reset player position
        }
    });
}

function updateTimer() {
    gameTimer--;
    if (gameTimer <= 0) {
        if (gameStarted === 1) {
            clearInterval(gameInterval); // Stop the timer
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Display the victory image
            gameStarted = 0;
            gameRunning = false; // Stop the game loop
        }
    }
}

function update() {
    if (!gameRunning) return; // Stop updating if the game is no longer running

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw player
    player.update();
    player.draw();

    // Update and draw enemies
    enemies.forEach(enemy => {
        enemy.update();
        enemy.draw();

        // Shoot bullets with a higher frequency (more shots)
        if (Math.random() < 1) {
            enemy.shoot();
        }
    });

    // Draw timer
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Time Remaining: ${gameTimer}s`, canvas.width - 200, 20);

    // Check for collisions
    checkCollisions();
    requestAnimationFrame(update);
}

}
function startgame() {
    const button = document.getElementById("beginbutton");
    button.style.display = "none"; // Hide the button
    gameStarted = 1;
    update();
    handleInput();
    gameInterval = setInterval(updateTimer, 1000); // Decrease timer every second
}