const boardWidth = 10;
const boardHeight = 24;

const boardOffsets = 300;

const boardTileWidth = 17;
const boardTileSpacing = 20;

class Board{
    garbageQueue = [];
    dots = [];

    lines = 0;

    constructor(port = 0){
        this.port = port;

        this.x = scene.width * 0.5 + boardOffsets * (this.port - 1) - boardWidth * boardTileSpacing * 0.5;
        this.y = scene.height * 0.42 + boardHeight * boardTileSpacing * 0.5;
        this.rows = new Array(boardHeight).fill().map(e => new Row(this));

        this.garbageImg = scene.add.line(0, 0, this.renderX(10.25), 0, this.renderX(10.25), 0, palette["Z"])

        this.rows.forEach((e, i) => e.updateDisplay(i));

        for(var y = 1; y < boardHeight; y++){
            for(var x = 1; x < boardWidth; x++){
                this.dots.push(scene.add.circle(
                    this.renderX(x - 0.5), 
                    this.renderY(y - 0.5),
                    1,
                    0xffffff
                ));
            }
        }

        this.leftLine = scene.add.line(0, 0,
            this.renderX(-0.5), this.renderY(-0.5),
            this.renderX(-0.5), this.renderY(boardHeight - 0.5), 0xffffff
        ).setOrigin(0, 0);

        this.rightLine = scene.add.line(0, 0,
            this.renderX(boardWidth-0.5), this.renderY(-0.5),
            this.renderX(boardWidth-0.5), this.renderY(boardHeight - 0.5), 0xffffff
        ).setOrigin(0, 0);

        this.bottomLine = scene.add.line(0, 0,
            this.renderX(-0.5), this.renderY(-0.5),
            this.renderX(boardWidth-0.5), this.renderY(-0.5), 0xffffff
        ).setOrigin(0, 0);

        this.player = new PossesedPiece(this);

        this.text = new Text(this.renderX(0), this.renderY(-4), "lines:0", 10);
    }

    win(){
        this.player.win();
    }

    opponent = null;

    setOpponent(o){
        this.opponent = o;
        this.text.remove();
    }

    clearRow(rowIndex){
        var row = this.rows.splice(rowIndex, 1)[0];
        row.clear();
        this.rows.push(row);

        this.updateDisplay();
    }

    updateGarbageDisplay(){
        this.garbageImg.geom.y1 = this.renderY(-0.5);
        let y = 0;
        if(this.garbageQueue.length > 0) y = this.garbageQueue.reduce((a, b) => a + b)
        this.garbageImg.geom.y2 = this.renderY(y - 0.5);        
    }

    sendGarbage(l){
        this.garbageQueue.push(l);
        this.updateGarbageDisplay();
    }

    addGarbage(lines){
        var a = this.rows.splice(this.rows.length - lines, lines);

        var col = Math.floor(boardWidth * Math.random());
        a.forEach(e => {
            e.clear();
            e.addGarbage(col);
        });

        this.rows.splice(0, 0, ...a);

        this.updateDisplay();
    }

    updateDisplay(){
        this.rows.forEach((e, i) => e.updateDisplay(i));
    }

    collides(mat, ox, oy){
        for(var y = 0; y < mat.length; y++){
            for(var x = 0; x < mat.length; x++){
                if(
                    mat[y][x] == "#" &&
                    (
                        ox + x < 0 || ox + x > boardWidth - 1|| 
                        oy + y < 0 || oy + y > boardHeight - 1 ||
                        this.get(ox + x, oy + y)
                    )
                ) return true;
            }
        }
        return false;
    }

    get(x, y){
        return this.rows[y].row[x];
    }

    prevClear = false;

    add(mat, ox, oy, type){
        var tSpinCorners = 0;
        for(var y = 0; y < mat.length; y++){
            for(var x = 0; x < mat.length; x++){
                if(
                    mat[y][x] == "#"
                ) {
                    this.rows[oy + y].row[ox + x] = true;
                    this.rows[oy + y].img[ox + x].fillColor = palette[type];
                }
                if(
                    type == "T" && mat[y][x] == "-" && this.get(x, y)
                ){
                    tSpinCorners++;
                }
            }
        }
        
        this.updateDisplay();

        var clearedLines = 0;

        for(var i = 0; i < this.rows.length; i++){
            if(this.rows[i].full()){
                this.clearRow(i);
                clearedLines++;
                i--;

                this.lines++;
            }
        }

        if(this.opponent == null) {
            if(clearedLines > 0) this.updateLineDisplay();
            return;
        }

        if(clearedLines > 0 && tSpinCorners >= 3) {
            if(this.collides(mat, ox, oy+1)) clearedLines += 4;
        }
        var sendLines = clearTable[clearedLines];

        if(clearedLines > 0 && this.prevClear) sendLines += 1;
        this.prevClear = clearedLines > 0;

        if(sendLines > 0){                
            while(sendLines > 0){
                if(this.garbageQueue.length == 0) break;

                var q = this.garbageQueue[0];
                if(sendLines >= q){
                    this.garbageQueue.splice(0, 1);
                    sendLines -= q;
                }else{
                    this.garbageQueue[0] -= sendLines;
                    sendLines = 0;
                }
            }

            if(sendLines > 0){
                this.opponent.sendGarbage(sendLines);
            }

            this.updateGarbageDisplay();
        }else{
            while(this.garbageQueue.length > 0){
                var g = this.garbageQueue.splice(0, 1)[0];
                this.addGarbage(g);
            }
            this.updateGarbageDisplay();
        }
    }

    updateLineDisplay(){
        this.text.setText("lines:" + this.lines);
    }

    renderX(x){
        return this.x + x * boardTileSpacing;
    }

    renderY(y){
        return this.y - (y * boardTileSpacing);
    }
}

class Row{
    constructor(board){
        this.board = board;
        this.row = new Array(boardWidth).fill().map((e, i) => false);
        this.img = new Array(boardWidth).fill().map((e, i) => 
            scene.add.rectangle(this.board.renderX(i), 0, boardTileWidth, boardTileWidth, 0xffffff)
        )
    }

    clear(){
        this.row = this.row.map(e => false);
    }

    full(){
        return this.row.every(e => e);
    }

    addGarbage(col){
        this.row = this.row.map((e, i) => i != col);
        this.img.forEach(e => e.fillColor = palette["G"])
    }

    updateDisplay(rowIndex){

        this.img.forEach((e, i) => e.setY(
            this.board.renderY(rowIndex)
        ).setVisible(this.row[i]), this);

    }

    updateX(){
        this.img.forEach((e, i) =>
            e.setX(this.board.renderX(i))
        )
    }
}