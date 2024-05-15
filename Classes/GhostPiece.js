class GhostPiece{

    constructor(board){
        this.img = new Array(4).fill().map(e => scene.add.rectangle(20, 20, boardTileWidth, boardTileWidth, 0xff0000).setAlpha(0.45));
        this.board = board;
    }

    updateDisplay(type, r, ox, oy){

        var mat = pieceMatrices[type][r];
        var offset = Math.floor(mat.length / 2);

        while(!this.board.collides(
            mat, ox - offset, oy - offset
        )) oy--;
        oy++;

        var i = 0;
        for(var y = 0; y < mat.length; y++){
            for(var x = 0; x < mat.length; x++){
                
                if(mat[y][x] == "#"){
                    this.img[i].setY(
                        this.board.renderY(y + oy - offset)
                    ).setX(
                        this.board.renderX(ox + x - offset)
                    );

                    this.img[i].fillColor = palette[type]
                    i++;
                }

            }
        }
    }

}