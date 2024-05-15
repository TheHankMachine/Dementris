const lockDownTime = 30;
const maxLockDownResets = 15;
const holdLocationX = -3;
const holdLocationY = 21;

class PossesedPiece{    

    fallTimer = 0;

    constructor(board){
        this.bag = new Bag(board);
        this.img = new Array(4).fill().map(e => scene.add.rectangle(-20, -20, boardTileWidth, boardTileWidth, 0xff0000));

        this.holdImg = new Array(4).fill().map(e => scene.add.rectangle(-20, -20, boardTileWidth, boardTileWidth, 0xff0000));
    
        this.hold = null;

        this.board = board;
        this.port = this.board.port;

        this.ghost = new GhostPiece(board);

        this.reset();

        UpdateList.add(this)
    }

    holdReset = true;

    holdBlock(){
        if(!this.holdReset) return;

        this.holdReset = false;

        var temp = this.hold;
        this.hold = this.type;

        if(temp != null) this.type = temp;
        else this.type = this.bag.pull();

        this.x = 5;
        this.y = 22;
        this.r = 0;

        this.img.forEach(
            e => {e.fillColor = palette[this.type]}, this
        )

        this.updateHoldDisplay()

        this.updateDisplay();
    }

    updateHoldDisplay(){
        var mat = pieceMatrices[this.hold][0];
        var offset = Math.floor(mat.length / 2);

        var i = 0;
        for(var y = 0; y < mat.length; y++){
            for(var x = 0; x < mat.length; x++){
                
                if(mat[y][x] == "#"){
                    this.holdImg[i].setY(
                        this.board.renderY(y + holdLocationY - offset)
                    ).setX(
                        this.board.renderX(holdLocationX + x - offset)
                    );

                    this.holdImg[i].fillColor = palette[this.hold]
                    i++;
                }
            }
        }
    }

    reset(){
        this.holdReset = true;
        this.x = 5;
        this.y = 22;
        this.r = 0;
        this.type = this.bag.pull();

        this.img.forEach(
            e => {e.fillColor = palette[this.type]}, this
        )

        if(this.collides()){
            this.lose();
        }

        this.updateDisplay();
    }

    win(){
        new Text(this.board.renderX(0), this.board.renderY(-2), "you win", 15);
    }

    lose(){
        if(this.board.opponent != null) this.board.opponent.win();
        this.winText = new Text(this.board.renderX(0), this.board.renderY(-2), "you lose", 15);

        new Text(10, 10, this.board.lines + "");
        
        this.board.updateDisplay();

        UpdateList.remove(this);
    }

    lockDownTimer = "open";
    lockDownResetCounter = 0;

    update(){
        if(isHit(this.port, "hold")) this.holdBlock();

        if(isHit(this.port, "rotate")) this.rotate(1);
        if(isHit(this.port, "altRotate")) this.rotate(-1);

        if(isPressed(this.port, "left", 8, 2)) this.move(-1);
        if(isPressed(this.port, "right", 8, 2)) this.move(1); 

        if(isPressed(this.port, "down", 0, 1)) {
            this.down(1);
        }

        if(isHit(this.port, "drop")){
            this.hardDrop();
        }

        if(typeof this.lockDownTimer == "number") this.lockDownTimer--;
        if(this.lockDownTimer == 1) {

            this.y--;
            if(this.collides()){
                this.y++;
                this.lockDownTimer = "lock"
                this.lockDown();
                this.lockDownTimer = "open"    
            }else{
                this.y++;
                this.resetLockDown();
            }
        }

        this.fallTimer--;
        if(this.fallTimer <= 0){
            this.down(1);
            this.fallTimer = 30;
        }
    }

    down(delta){
        this.y -= delta;

        if(this.collides()){
            this.y += delta;

            if(this.lockDownTimer == "open") this.lockDownTimer = lockDownTime;
            return true;
        }

        this.updateDisplay();
        return false
    }

    hardDrop(){
        while(!this.down(1));
        this.lockDown();
    }

    lockDown(){
        var mat = pieceMatrices[this.type][this.r]
        var offset = Math.floor(mat.length / 2);
        this.board.add(
            mat, this.x - offset, this.y - offset, this.type
        )

        this.lockDownTimer = "open"
        this.lockDownResetCounter = 0;
        this.reset();
    }

    resetLockDown(){
        if(this.lockDownTimer == "open") return;

        this.lockDownResetCounter++;
        if(this.lockDownResetCounter >= maxLockDownResets){
            return;
        }
        this.lockDownTimer = lockDownTime;
    }

    collides(){
        var mat = pieceMatrices[this.type][this.r]
        var offset = Math.floor(mat.length / 2);
        return this.board.collides(
            mat, this.x - offset, this.y - offset
        );
    }

    move(delta){
        this.x += delta;

        if(this.collides()){
            this.x -= delta
            return;
        }

        this.updateDisplay();
        this.resetLockDown();
    }

    rotate(delta){
        var pre = this.r;
        this.r += delta;

        this.r += 4;
        this.r %= 4;

        if(!this.collides()) {
            this.resetLockDown();
            this.updateDisplay();
            return;
        }

        let x = this.x;
        let y = this.y;
        
        var a = (this.type == "I"? IwallKickTable : wallKickTable)[pre];
        var b = wallKickTable[this.r];

        for(var i = 0; i < 4; i++){
            this.x = x + a[i][0] - b[i][0];
            this.y = y + a[i][1] - b[i][1];

            if(!this.collides()) {
                this.resetLockDown();
                this.updateDisplay();
                return;
            }
        }

        this.x = x;
        this.y = y;

        this.r = pre;
    }

    updateDisplay(){
        var mat = pieceMatrices[this.type][this.r];
        var offset = Math.floor(mat.length / 2);

        var i = 0;
        for(var y = 0; y < mat.length; y++){
            for(var x = 0; x < mat.length; x++){
                
                if(mat[y][x] == "#"){
                    this.img[i].setY(
                        this.board.renderY(y + this.y - offset)
                    ).setX(
                        this.board.renderX(this.x + x - offset)
                    );
                    i++;
                }

            }
        }
        this.ghost.updateDisplay(this.type, this.r, this.x, this.y)
    }
}