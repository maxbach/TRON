class Snake {

    constructor(id, maxLength, leftCharCode, rightCharCode) {
        this.id = id;
        this.color = Snake.getColor(id);
        this.points = [];
        this.THICKNESS = 2;
        this.BORDER_INIT_WIDTH = 10;
        this.maxLength = maxLength;
        this.refresh();
        this.leftKey = leftCharCode;
        this.rightKey = rightCharCode;
    }

    static getColor(id) {
        switch (id) {
            case 0:
                return "#F60018";
            case 1:
                return "#FFBA00";
            case 2:
                return "#1826B0";
            default:
                return "#25D500";
        }
    }

    static getNameById(id) {
        switch (id) {
            case 0:
                return "RED";
            case 1:
                return "YELLOW";
            case 2:
                return "BLUE";
            default:
                return "GREEN";
        }
    }

    move(ctx) {
        this.points.push({
            x: this.x,
            y: this.y
        });
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
        let p = this.gameOver(ctx);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.THICKNESS, this.THICKNESS);
        return p;
    }

    turnLeft() {
        let ddx = this.dx;
        this.dx = this.dy;
        this.dy = -ddx;
    }

    turnRight() {
        let ddx = this.dx;
        this.dx = -this.dy;
        this.dy = ddx;
    }

    gameOver(ctx) {
        // for debug
        let data = ctx.getImageData(this.x, this.y, 1, 1).data;
        if (this.x < 0 || this.y < 0 || this.x > this.maxLength || this.y > this.maxLength) {
            return true;
        } else if (data[0] !== 0 || data[1] !== 0 || data[2] !== 0 || data[3] !== 0) {
            return true;
        }
        return false;
    }

    refresh(width) {
        this.maxLength = width;
        this.x = Math.round(Math.random() * (this.maxLength - this.BORDER_INIT_WIDTH) + this.BORDER_INIT_WIDTH);
        this.y = Math.round(Math.random() * (this.maxLength - this.BORDER_INIT_WIDTH) + this.BORDER_INIT_WIDTH);
        this.points = [];
        this.score = 0;
        if (this.x < this.maxLength / 2) {
            this.dx = this.THICKNESS;
        } else {
            this.dx = - this.THICKNESS;
        }
        this.dy = 0;
    }

    remove() {
        ctx.fillStyle = "#9599a0";
        for (let point of this.points) {
            ctx.fillRect(point.x, point.y, this.THICKNESS, this.THICKNESS);
        }
    }

}