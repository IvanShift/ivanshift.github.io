//import { DrawingCanvas } from './DrawingOnCanvas'; 
class TDrawingCanvas {
    constructor() {
        this.CELL_SIZE = 10;
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
    }
    getDirection() {
        return this.selectedDirection;
    }
    CreateUserEvents() {
        let canvas = this.canvas;
        document.addEventListener("keydown", this.pressEventHandler);
        //  document.getElementById('clear')
        //     .addEventListener("click", this.clearEventHandler);
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
        //Draw Some Rect
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 1; i < Math.floor(this.canvas.width / this.CELL_SIZE); i++) {
            this.DrawLine(i * this.CELL_SIZE, 0, i * this.CELL_SIZE, this.canvas.height, this.GRID_LINE_COLOR);
        }
        for (let i = 1; i < Math.floor(this.canvas.height / this.CELL_SIZE); i++) {
            this.DrawLine(0, i * this.CELL_SIZE, this.canvas.height, i * this.CELL_SIZE, this.GRID_LINE_COLOR);
        }
    }
    DrawOneSegment(Point, Color) {
        let Radius = Math.floor(this.CELL_SIZE / 2);
        let CentrX = Math.floor(Point.x * this.CELL_SIZE + this.CELL_SIZE / 2);
        let CentrY = Math.floor(Point.y * this.CELL_SIZE - this.CELL_SIZE / 2);
        this.context.beginPath();
        this.context.strokeStyle = Color;
        this.context.lineWidth = 3;
        this.context.ellipse(CentrX, CentrY, Radius, Radius, 0, 0, 2 * Math.PI);
        this.context.stroke();
        // console.log(CentrX + ' ' + CentrY + ' ' + Radius);
    }
    DrawSnake(Snake) {
        for (let i = 0; i < Snake.length; i++) {
            if (i == 0) 
            //Head
            {
                this.DrawOneSegment(Snake[i], 'blue');
            }
            //Tail
            else {
                this.DrawOneSegment(Snake[i], 'green');
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
        this.Tail.push(StartPoint);
        for (let i = 1; i <= SnakeLength; i++) {
            let NextPoint = { x: StartPoint.x, y: StartPoint.y + i };
            this.Tail.push(NextPoint);
        }
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
        this.Tail.unshift(NextPoint);
        this.Tail.pop();
    }
    GetTail() {
        return this.Tail;
    }
}
class TTimer {
    constructor(RunFunct) {
        this.Funct = RunFunct;
        this.Timer = setInterval(null, 1000);
    }
    Start(milsec) {
        this.Timer = setInterval(this.Funct, milsec);
    }
    Stop() {
        clearTimeout(this.Timer);
    }
}
function RunApp() {
    var el = document.getElementById("content");
    el.innerHTML = "Gamer: Tom, age: 29";
    let CurrentCanvas = new TDrawingCanvas();
    CurrentCanvas.DrawGrid();
    let BeginPoint = { x: 20, y: 40 };
    let Snake = new TSnake(BeginPoint, 5);
    CurrentCanvas.DrawSnake(Snake.GetTail());
    Snake.MoveTo(Direction.Up);
    let DrawSnake = () => CurrentCanvas.RedrawAll(Snake.GetTail());
    let DrawTimer = new TTimer(DrawSnake);
    DrawTimer.Start(300);
    let MoveSnake = () => Snake.MoveTo(CurrentCanvas.getDirection());
    let MoveTimer = new TTimer(MoveSnake);
    MoveTimer.Start(500);
}
RunApp();
//# sourceMappingURL=app.js.map