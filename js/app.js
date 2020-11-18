//import { DrawingCanvas } from './DrawingOnCanvas'; 
class TDrawingCanvas {
    constructor() {
        this.CELL_SIZE = 20;
        this.GRID_LINE_COLOR = 'lightgray';
        this.pressEventHandler = (e) => {
            //WASD-control
            switch (e.keyCode) {
                //A
                case 65: {
                    this.selectedDirection = Direction.Left;
                    break;
                }
                //W
                case 87: {
                    this.selectedDirection = Direction.Up;
                    break;
                }
                //D
                case 68: {
                    this.selectedDirection = Direction.Right;
                    break;
                }
                //S
                case 83: {
                    this.selectedDirection = Direction.Down;
                    break;
                }
            }
        };
        let canvas = document.getElementById('canvas');
        let context = canvas.getContext("2d");
        this.canvas = canvas;
        this.context = context;
        this.selectedDirection = Direction.Up;
        this.CreateUserEvents();
        this.CanvasSizeInCells = { x: Math.floor(this.canvas.width / this.CELL_SIZE), y: Math.floor(this.canvas.height / this.CELL_SIZE) };
    }
    getDirection() {
        return this.selectedDirection;
    }
    getCanvasSizeInCells() {
        return this.CanvasSizeInCells;
    }
    CreateUserEvents() {
        let canvas = this.canvas;
        document.addEventListener("keydown", this.pressEventHandler);
        //    document.getElementById('restart').addEventListener("click", this.restartEventHandler);
    }
    //   private restartEventHandler = () => {       RunGame();   };
    IsCollision(Snake) {
        let isCollision = false;
        //Border collision
        if ((Snake[0].x) < 1 || (Snake[0].x > this.CanvasSizeInCells.x)) {
            isCollision = true;
        }
        ;
        if ((Snake[0].y) < 1 || (Snake[0].y > this.CanvasSizeInCells.y)) {
            isCollision = true;
        }
        ;
        //Self-collision
        let Head = Snake[0];
        for (let i = 1; i < Snake.length; i++) {
            if ((Snake[0].x == Snake[i].x) && (Snake[0].y == Snake[i].y)) {
                isCollision = true;
                break;
            }
            ;
        }
        ;
        return isCollision;
    }
    DrawLine(FromX, FromY, ToX, ToY, Color) {
        this.context.beginPath();
        this.context.strokeStyle = Color;
        this.context.lineWidth = 1;
        this.context.moveTo(FromX, FromY);
        this.context.lineTo(ToX, ToY);
        this.context.stroke();
    }
    DrawGrid() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 1; i < Math.floor(this.canvas.width / this.CELL_SIZE); i++) {
            this.DrawLine(i * this.CELL_SIZE, 0, i * this.CELL_SIZE, this.canvas.height, this.GRID_LINE_COLOR);
        }
        for (let i = 1; i < Math.floor(this.canvas.height / this.CELL_SIZE); i++) {
            this.DrawLine(0, i * this.CELL_SIZE, this.canvas.height, i * this.CELL_SIZE, this.GRID_LINE_COLOR);
        }
    }
    DrawOneCircle(Point, Color) {
        let Radius = Math.floor(this.CELL_SIZE / 2);
        let CentrX = Math.floor(Point.x * this.CELL_SIZE - this.CELL_SIZE / 2);
        let CentrY = Math.floor(Point.y * this.CELL_SIZE - this.CELL_SIZE / 2);
        this.context.beginPath();
        this.context.strokeStyle = Color;
        this.context.lineWidth = 3;
        this.context.ellipse(CentrX, CentrY, Radius, Radius, 0, 0, 2 * Math.PI);
        this.context.stroke();
    }
    DrawSnake(Snake) {
        for (let i = 0; i < Snake.length; i++) {
            if (i == 0) 
            //Head
            {
                this.DrawOneCircle(Snake[i], 'blue');
            }
            //Tail
            else {
                this.DrawOneCircle(Snake[i], 'green');
            }
        }
    }
    RedrawAll(Snake) {
        this.DrawGrid();
        this.DrawSnake(Snake);
    }
}
var Direction;
(function (Direction) {
    Direction[Direction["Right"] = 0] = "Right";
    Direction[Direction["Left"] = 1] = "Left";
    Direction[Direction["Up"] = 2] = "Up";
    Direction[Direction["Down"] = 3] = "Down";
})(Direction || (Direction = {}));
;
class TSnake {
    //Snake growth Down, StartPoint - Head
    constructor(StartPoint, SnakeLength) {
        this.Tail = [];
        this.PrevDirection = Direction.Up;
        this.Tail.push(StartPoint);
        for (let i = 1; i <= SnakeLength; i++) {
            let NextPoint = { x: StartPoint.x, y: StartPoint.y + i };
            this.Tail.push(NextPoint);
        }
        this.HasFood = false;
    }
    Feed(FoodPos) {
        this.FoodPosition = { x: FoodPos.x, y: FoodPos.y };
        this.HasFood = true;
    }
    IsHungry() {
        return !(this.HasFood);
    }
    MoveTo(direction) {
        let NextPoint = { x: this.Tail[0].x, y: this.Tail[0].y };
        switch (direction) {
            case Direction.Right: {
                NextPoint.x++;
                break;
            }
            case Direction.Left: {
                NextPoint.x--;
                break;
            }
            case Direction.Up: {
                NextPoint.y--;
                break;
            }
            case Direction.Down: {
                NextPoint.y++;
                break;
            }
        }
        // Food check
        let IsOnFoodPosition = false;
        if (this.HasFood) {
            if ((NextPoint.x == this.FoodPosition.x) && (NextPoint.y == this.FoodPosition.y)) {
                IsOnFoodPosition = true;
                this.HasFood = false;
            }
        }
        //Do not allow to move snake back inside itself
        if ((NextPoint.x != this.Tail[1].x) || (NextPoint.y != this.Tail[1].y)) {
            this.Tail.unshift(NextPoint);
            if (!(IsOnFoodPosition)) {
                this.Tail.pop();
            }
            this.PrevDirection = direction;
        }
        else {
            this.MoveTo(this.PrevDirection);
        }
    }
    GetTail() {
        return this.Tail;
    }
}
class TSnakeFood {
    constructor(AllSnake, MaxSize) {
        this.MAX_ITER = 100;
        this.setRndPosition(AllSnake, MaxSize);
    }
    getPosition() {
        return this.Position;
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    setRndPosition(AllSnake, MaxSize) {
        let MaxIter = 0;
        do {
            this.Position = { x: this.getRandomInt(MaxSize.x - 1) + 1, y: this.getRandomInt(MaxSize.y - 1) + 1 };
            var IsInside = AllSnake.includes(AllSnake.find(el => el.x == this.Position.x, el => el.y == this.Position.y));
            MaxIter++;
        } while ((IsInside) || (MaxIter < this.MAX_ITER));
    }
}
class TTimer {
    constructor(RunFunct) {
        this.Funct = RunFunct;
        this.Timer = setInterval(null, 10000);
    }
    Start(milsec) {
        this.Stop();
        this.Timer = setInterval(this.Funct, milsec);
    }
    Stop() {
        clearTimeout(this.Timer);
    }
}
function RunGame() {
    const GAME_SPEED = 200;
    const BEGIN_POINT = { x: 10, y: 20 };
    const SNAKE_LENGTH = 5;
    const FOOD_COLOR = 'orange';
    const COLLISION_COLOR = 'red';
    var el = document.getElementById("content");
    el.innerHTML = 'Score: 0';
    let CurrentCanvas = new TDrawingCanvas();
    let Snake = new TSnake(BEGIN_POINT, SNAKE_LENGTH);
    let SnakeFood = new TSnakeFood(Snake.GetTail(), CurrentCanvas.getCanvasSizeInCells());
    Snake.Feed(SnakeFood.getPosition());
    let Score = 0;
    let MoveSnake = () => {
        if (Snake.IsHungry()) {
            SnakeFood.setRndPosition(Snake.GetTail(), CurrentCanvas.getCanvasSizeInCells());
            Snake.Feed(SnakeFood.getPosition());
            Score++;
            el.innerHTML = 'Score: ' + Score;
        }
        Snake.MoveTo(CurrentCanvas.getDirection());
        CurrentCanvas.RedrawAll(Snake.GetTail());
        CurrentCanvas.DrawOneCircle(SnakeFood.getPosition(), FOOD_COLOR);
        if (CurrentCanvas.IsCollision(Snake.GetTail())) {
            MoveTimer.Stop();
            CurrentCanvas.DrawOneCircle(Snake.GetTail()[0], COLLISION_COLOR);
            CurrentCanvas.DrawOneCircle(Snake.GetTail()[1], COLLISION_COLOR);
        }
    };
    let MoveTimer = new TTimer(MoveSnake);
    MoveTimer.Start(GAME_SPEED);
}
RunGame();
//# sourceMappingURL=app.js.map