//import { DrawingCanvas } from './DrawingOnCanvas';
class DrawingCanvas {
    constructor() {
        this.CELL_SIZE = 20;
        this.GRID_LINE_COLOR = "lightgray";
        this.CANVAS_NAME = "canvas";
        this.SNAKE_COLOR = "green";
        this.SNAKE_HEAD_COLOR = "blue";
        this.RESTART_ELEMENT = "restart";
        this.KEY_LISTENER = "keydown";
        this.MOUSE_LISTENER = "click";
        this.selectedDirection = Direction.up;
        this.restartEventHandler = () => {
            location.reload(true);
        };
        this.pressEventHandler = (e) => {
            //WASD-control or arrows
            switch (e.keyCode) {
                //A or left 
                case 65:
                case 37: {
                    this.selectedDirection = Direction.left;
                    break;
                }
                //W or up 
                case 87:
                case 38: {
                    this.selectedDirection = Direction.up;
                    break;
                }
                //D or right
                case 68:
                case 39: {
                    this.selectedDirection = Direction.right;
                    break;
                }
                //S or down
                case 83:
                case 40: {
                    this.selectedDirection = Direction.down;
                    break;
                }
            }
        };
        this.canvas = document.getElementById(this.CANVAS_NAME);
        this.context = this.canvas.getContext("2d");
        this.canvasSizeInCells = {
            x: Math.floor(this.canvas.width / this.CELL_SIZE),
            y: Math.floor(this.canvas.height / this.CELL_SIZE),
        };
        this.createUserEvents();
    }
    getDirection() {
        return this.selectedDirection;
    }
    getCanvasSizeInCells() {
        return this.canvasSizeInCells;
    }
    createUserEvents() {
        let canvas = this.canvas;
        document.addEventListener(this.KEY_LISTENER, this.pressEventHandler);
        document
            .getElementById(this.RESTART_ELEMENT)
            .addEventListener(this.MOUSE_LISTENER, this.restartEventHandler);
    }
    isCollision(snake) {
        //Border collision
        if (snake[0].x < 1 || snake[0].x > this.canvasSizeInCells.x) {
            return true;
        }
        if (snake[0].y < 1 || snake[0].y > this.canvasSizeInCells.y) {
            return true;
        }
        //Self-collision
        for (let i = 1; i < snake.length; i++) {
            if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
                return true;
            }
        }
        return false;
    }
    drawLine(fromX, fromY, toX, toY, color) {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.lineWidth = 1;
        this.context.moveTo(fromX, fromY);
        this.context.lineTo(toX, toY);
        this.context.stroke();
    }
    drawGrid() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 1; i < Math.floor(this.canvas.width / this.CELL_SIZE); i++) {
            this.drawLine(i * this.CELL_SIZE, 0, i * this.CELL_SIZE, this.canvas.height, this.GRID_LINE_COLOR);
        }
        for (let i = 1; i < Math.floor(this.canvas.height / this.CELL_SIZE); i++) {
            this.drawLine(0, i * this.CELL_SIZE, this.canvas.height, i * this.CELL_SIZE, this.GRID_LINE_COLOR);
        }
    }
    drawCircle(point, color) {
        let radius = Math.floor(this.CELL_SIZE / 2);
        let centrX = Math.floor(point.x * this.CELL_SIZE - this.CELL_SIZE / 2);
        let centrY = Math.floor(point.y * this.CELL_SIZE - this.CELL_SIZE / 2);
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.lineWidth = 3;
        this.context.ellipse(centrX, centrY, radius, radius, 0, 0, 2 * Math.PI);
        this.context.stroke();
    }
    drawSnake(snake) {
        for (let i = 0; i < snake.length; i++) {
            if (i == 0) {
                //Head
                this.drawCircle(snake[i], this.SNAKE_HEAD_COLOR);
            }
            else {
                //tail
                this.drawCircle(snake[i], this.SNAKE_COLOR);
            }
        }
    }
    redrawAll(snake) {
        this.drawGrid();
        this.drawSnake(snake);
    }
}
var Direction;
(function (Direction) {
    Direction[Direction["right"] = 0] = "right";
    Direction[Direction["left"] = 1] = "left";
    Direction[Direction["up"] = 2] = "up";
    Direction[Direction["down"] = 3] = "down";
})(Direction || (Direction = {}));
class Snake {
    //Snake growth down, StarPoint - Head
    constructor(starPoint, snakeLength) {
        this.tail = [];
        this.prevDirection = Direction.up;
        this.tail.push(starPoint);
        for (let i = 1; i <= snakeLength; i++) {
            this.tail.push({ x: starPoint.x, y: starPoint.y + i });
        }
        this.hasFood = false;
    }
    feed(foodPos) {
        this.foodPosition = { x: foodPos.x, y: foodPos.y };
        this.hasFood = true;
    }
    isHungry() {
        return !this.hasFood;
    }
    moveTo(direction) {
        let nextPoint = { x: this.tail[0].x, y: this.tail[0].y };
        switch (direction) {
            case Direction.right: {
                nextPoint.x++;
                break;
            }
            case Direction.left: {
                nextPoint.x--;
                break;
            }
            case Direction.up: {
                nextPoint.y--;
                break;
            }
            case Direction.down: {
                nextPoint.y++;
                break;
            }
        }
        // Food check
        let isOnfoodPosition = false;
        if (this.hasFood) {
            if (nextPoint.x == this.foodPosition.x &&
                nextPoint.y == this.foodPosition.y) {
                isOnfoodPosition = true;
                this.hasFood = false;
            }
        }
        //Do not allow to move snake back inside itself
        if (nextPoint.x != this.tail[1].x || nextPoint.y != this.tail[1].y) {
            this.tail.unshift(nextPoint);
            if (!isOnfoodPosition) {
                this.tail.pop();
            }
            this.prevDirection = direction;
        }
        else {
            this.moveTo(this.prevDirection);
        }
    }
    getTail() {
        return this.tail;
    }
}
class SnakeFood {
    constructor(allSnake, maxSize) {
        this.MAX_ITER = 100;
        this.setRndPosition(allSnake, maxSize);
    }
    getPosition() {
        return this.position;
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    setRndPosition(allSnake, maxSize) {
        let maxIter = 0;
        let isInside = true;
        do {
            this.position = {
                x: this.getRandomInt(maxSize.x - 1) + 1,
                y: this.getRandomInt(maxSize.y - 1) + 1,
            };
            isInside = allSnake.includes(allSnake.find((el) => el.x == this.position.x && el.y == this.position.y));
            maxIter++;
        } while (isInside || maxIter < this.MAX_ITER);
    }
}
class Timer {
    constructor(runFunct) {
        this.funct = runFunct;
        this.timer = setInterval(null, 10000);
    }
    start(milsec) {
        this.stop();
        this.timer = setInterval(this.funct, milsec);
    }
    stop() {
        clearTimeout(this.timer);
    }
}
function runGame() {
    const GAME_SPEED = 200;
    const BEGIN_POINT = { x: 10, y: 20 };
    const SNAKE_LENGTH = 5;
    const FOOD_COLOR = "orange";
    const COLLISION_COLOR = "red";
    const SCORE_NAME = "Score: ";
    const SCORE_ELEMENT = "content";
    let score = 0;
    let el = document.getElementById(SCORE_ELEMENT);
    el.innerHTML = SCORE_NAME + score;
    let currentCanvas = new DrawingCanvas();
    let snake = new Snake(BEGIN_POINT, SNAKE_LENGTH);
    let snakeFood = new SnakeFood(snake.getTail(), currentCanvas.getCanvasSizeInCells());
    snake.feed(snakeFood.getPosition());
    let moveSnake = () => {
        if (snake.isHungry()) {
            snakeFood.setRndPosition(snake.getTail(), currentCanvas.getCanvasSizeInCells());
            snake.feed(snakeFood.getPosition());
            score++;
            el.innerHTML = SCORE_NAME + score;
        }
        snake.moveTo(currentCanvas.getDirection());
        currentCanvas.redrawAll(snake.getTail());
        currentCanvas.drawCircle(snakeFood.getPosition(), FOOD_COLOR);
        if (currentCanvas.isCollision(snake.getTail())) {
            moveTimer.stop();
            currentCanvas.drawCircle(snake.getTail()[0], COLLISION_COLOR);
            currentCanvas.drawCircle(snake.getTail()[1], COLLISION_COLOR);
        }
    };
    let moveTimer = new Timer(moveSnake);
    moveTimer.start(GAME_SPEED);
}
runGame();
//# sourceMappingURL=app.js.map